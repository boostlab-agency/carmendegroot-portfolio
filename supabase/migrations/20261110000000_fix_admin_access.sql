-- ═══════════════════════════════════════════════════════════════════
--  Fix: CMS admins krijgen "Dit account heeft geen toegang tot het CMS."
--
--  Oorzaak
--  De init-migratie bevatte geen enkele GRANT en leunde op de standaard-
--  privileges die Supabase normaal aan tabellen in `public` geeft. Ontbreken
--  die (projectinstelling "expose new tables" uit, of tabellen aangemaakt via
--  een andere route), dan faalt `select ... from profiles` voor de rol
--  `authenticated` met "permission denied" — en de app zag dat als
--  "geen admin". RLS bepaalt WELKE rijen zichtbaar zijn, maar zonder GRANT
--  komt een rol niet eens bij de tabel.
--
--  Deze migratie
--  1. kent expliciet de minimale privileges toe (RLS blijft de rijen bewaken);
--  2. voegt `get_my_profile()` toe: een security-definer RPC waarmee de app
--     de eigen rol leest, onafhankelijk van tabel-grants en RLS op profiles.
--
--  Idempotent: veilig om (opnieuw) uit te voeren.
-- ═══════════════════════════════════════════════════════════════════

-- ── Schema ──────────────────────────────────────────────────────────
grant usage on schema public to anon, authenticated, service_role;

-- ── Publiek leesbare content (RLS filtert op status = 'published') ──
grant select on public.categories     to anon, authenticated;
grant select on public.projects       to anon, authenticated;
grant select on public.project_images to anon, authenticated;
grant select on public.site_settings  to anon, authenticated;
grant select on public.pages          to anon, authenticated;

-- ── Contactformulier: bezoekers mogen alleen insturen ───────────────
grant insert on public.messages to anon, authenticated;

-- ── CMS-beheer (RLS: alleen is_admin()) ─────────────────────────────
grant insert, update, delete on public.categories     to authenticated;
grant insert, update, delete on public.projects       to authenticated;
grant insert, update, delete on public.project_images to authenticated;
grant insert, update, delete on public.site_settings  to authenticated;
grant insert, update, delete on public.pages          to authenticated;
grant select, insert, update, delete on public.media    to authenticated;
grant select, update, delete         on public.messages to authenticated;

-- profiles: alleen lezen (rollen wijzigen kan uitsluitend via service role / SQL)
grant select on public.profiles to authenticated;

-- service_role (scripts: seed, create-admin) mag alles
grant all on all tables in schema public to service_role;

-- ── Functies ────────────────────────────────────────────────────────
-- is_admin() wordt in RLS-policies ook voor anon geëvalueerd
-- (bijv. "status = 'published' or is_admin()"), dus anon heeft EXECUTE nodig.
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Geeft het profiel van de ingelogde gebruiker terug (0 rijen als er geen is).
-- SECURITY DEFINER: werkt los van tabel-grants en RLS op profiles, en kan
-- alleen het EIGEN profiel opleveren (gefilterd op auth.uid()).
create or replace function public.get_my_profile()
returns table (id uuid, email text, full_name text, role text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.email, p.full_name, p.role
  from public.profiles p
  where p.id = (select auth.uid());
$$;

revoke all on function public.get_my_profile() from public, anon;
grant execute on function public.get_my_profile() to authenticated, service_role;

-- ── Toekomstige tabellen/functies krijgen dezelfde basis ────────────
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant execute on functions to service_role;

-- Laat PostgREST het schema opnieuw inlezen (nieuwe RPC direct beschikbaar)
notify pgrst, 'reload schema';
