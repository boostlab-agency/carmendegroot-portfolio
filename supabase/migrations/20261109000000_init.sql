-- ═══════════════════════════════════════════════════════════════════
--  carmendegroot.nl — database schema
--  Run in Supabase: SQL Editor → paste → Run   (or: supabase db push)
--  Idempotent where practical, so it can safely be re-run.
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
--  Helpers
-- ───────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ───────────────────────────────────────────────────────────────────
--  USERS  (profiles linked 1:1 to auth.users)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'CMS users. Only role admin/editor can manage content. New sign-ups default to viewer.';

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Automatically create a profile for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Is the current user allowed to manage content?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'editor')
  );
$$;

-- ───────────────────────────────────────────────────────────────────
--  CATEGORIES
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────
--  PROJECTS
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title             text not null check (char_length(title) between 1 and 200),
  description       text,                 -- short summary (cards, meta)
  intro             text,                 -- intro paragraph on detail page
  body              text,                 -- full case text (markdown)
  challenge         text,
  approach          text,
  result            text,
  cover_image_url   text,
  cover_image_path  text,                 -- storage path (null for external/placeholder)
  cover_alt         text,
  tags              text[] not null default '{}',
  project_date      date,
  category_id       uuid references public.categories (id) on delete set null,
  client            text,
  role              text,
  duration          text,
  team              text,
  seo_title         text,
  seo_description   text,
  status            text not null default 'draft' check (status in ('draft', 'published')),
  featured          boolean not null default false,
  sort_order        integer not null default 0,
  published_at      timestamptz,
  created_by        uuid references auth.users (id) on delete set null,
  updated_by        uuid references auth.users (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects (status, sort_order, project_date desc);
create index if not exists projects_category_idx on public.projects (category_id);
create index if not exists projects_updated_idx on public.projects (updated_at desc);

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- Set published_at the first time a project goes live
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists projects_published_at on public.projects;
create trigger projects_published_at before insert or update on public.projects
  for each row execute function public.set_published_at();

-- ───────────────────────────────────────────────────────────────────
--  PROJECT IMAGES  (ordered gallery per project)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  url         text not null,
  path        text,
  alt         text,
  caption     text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

-- ───────────────────────────────────────────────────────────────────
--  MEDIA LIBRARY  (every uploaded file in the "media" bucket)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  url         text not null,
  name        text not null,
  alt         text,
  mime_type   text,
  size_bytes  bigint,
  width       integer,
  height      integer,
  sort_order  integer not null default 0,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists media_sort_idx on public.media (sort_order, created_at desc);

-- ───────────────────────────────────────────────────────────────────
--  SITE SETTINGS  (single row, flexible JSON)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.site_settings (
  id          integer primary key default 1 check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_by  uuid references auth.users (id) on delete set null,
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- ───────────────────────────────────────────────────────────────────
--  PAGES  (structured content per page: home, about, cv, contact)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.pages (
  key              text primary key check (key in ('home', 'about', 'cv', 'contact')),
  title            text not null,
  content          jsonb not null default '{}'::jsonb,
  seo_title        text,
  seo_description  text,
  updated_by       uuid references auth.users (id) on delete set null,
  updated_at       timestamptz not null default now()
);

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────
--  MESSAGES  (contact form submissions)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     text check (subject is null or char_length(subject) <= 160),
  message     text not null check (char_length(message) between 10 and 5000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists messages_created_idx on public.messages (created_at desc);

-- ═══════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;
alter table public.media          enable row level security;
alter table public.site_settings  enable row level security;
alter table public.pages          enable row level security;
alter table public.messages       enable row level security;

-- profiles: users can read their own profile; admins can read all.
-- No insert/update/delete policies → roles can only be changed with the service role / SQL editor.
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

-- categories: public read, admin write
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- projects: public sees published only; admins see and manage everything
drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published" on public.projects
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "projects: admin write" on public.projects;
create policy "projects: admin write" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- project_images: visible when the parent project is visible
drop policy if exists "project_images: public read" on public.project_images;
create policy "project_images: public read" on public.project_images
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and (p.status = 'published' or public.is_admin())
    )
  );

drop policy if exists "project_images: admin write" on public.project_images;
create policy "project_images: admin write" on public.project_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- media: admin only
drop policy if exists "media: admin all" on public.media;
create policy "media: admin all" on public.media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings & pages: public read, admin write
drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings: admin write" on public.site_settings;
create policy "site_settings: admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pages: public read" on public.pages;
create policy "pages: public read" on public.pages
  for select to anon, authenticated using (true);

drop policy if exists "pages: admin write" on public.pages;
create policy "pages: admin write" on public.pages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- messages: anyone may submit (insert only, unread), only admins can read/manage
drop policy if exists "messages: public insert" on public.messages;
create policy "messages: public insert" on public.messages
  for insert to anon, authenticated with check (is_read = false);

drop policy if exists "messages: admin read" on public.messages;
create policy "messages: admin read" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "messages: admin update" on public.messages;
create policy "messages: admin update" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages: admin delete" on public.messages;
create policy "messages: admin delete" on public.messages
  for delete to authenticated using (public.is_admin());

-- ═══════════════════════════════════════════════════════════════════
--  STORAGE  — public "media" bucket, admin-only writes
-- ═══════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public files are served via the public URL without any policy.
-- Listing / managing objects is restricted to admins (prevents anonymous enumeration).
drop policy if exists "media bucket: public read" on storage.objects;
drop policy if exists "media bucket: admin read" on storage.objects;
create policy "media bucket: admin read" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media bucket: admin insert" on storage.objects;
create policy "media bucket: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media bucket: admin update" on storage.objects;
create policy "media bucket: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media bucket: admin delete" on storage.objects;
create policy "media bucket: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
