/**
 * Seeds Supabase with the default content (pages, settings, categories, demo projects).
 * Usage:  npm run seed            → inserts missing content, never overwrites edits
 *         npm run seed -- --force → overwrites pages/settings/projects with the defaults
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { defaultPages, defaultSettings } from "../src/content/defaults";
import { seedCategories, seedProjects } from "../src/content/projects";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const force = process.argv.includes("--force");

if (!url || !serviceKey) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY zijn vereist (zie .env.example).");
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

function check<T>(res: { data: T; error: { message: string } | null }, label: string): T {
  if (res.error) {
    console.error(`✗ ${label}: ${res.error.message}`);
    process.exit(1);
  }
  return res.data;
}

async function main() {
  console.log(`→ Seeding ${url}${force ? " (force)" : ""}`);

  // Settings
  const existingSettings = check(await db.from("site_settings").select("data").eq("id", 1).maybeSingle(), "settings read");
  const hasSettings = existingSettings && Object.keys((existingSettings.data as object) ?? {}).length > 0;
  if (!hasSettings || force) {
    check(await db.from("site_settings").upsert({ id: 1, data: defaultSettings }), "settings");
    console.log("✓ site_settings");
  } else console.log("• site_settings bestaat al — overgeslagen");

  // Pages
  for (const [key, page] of Object.entries(defaultPages)) {
    const exists = check(await db.from("pages").select("key").eq("key", key).maybeSingle(), `page ${key}`);
    if (exists && !force) {
      console.log(`• page ${key} bestaat al — overgeslagen`);
      continue;
    }
    check(
      await db.from("pages").upsert({
        key,
        title: page.title,
        content: page.content,
        seo_title: page.seoTitle,
        seo_description: page.seoDescription,
      }),
      `page ${key}`,
    );
    console.log(`✓ page ${key}`);
  }

  // Categories
  check(
    await db.from("categories").upsert(
      seedCategories.map((c) => ({ name: c.name, slug: c.slug, description: c.description, sort_order: c.sortOrder })),
      { onConflict: "slug", ignoreDuplicates: !force },
    ),
    "categories",
  );
  const categories = check(await db.from("categories").select("id, slug"), "categories read") as { id: string; slug: string }[];
  const catId = (slug?: string) => categories.find((c) => c.slug === slug)?.id ?? null;
  console.log(`✓ ${seedCategories.length} categories`);

  // Projects + images
  for (const p of seedProjects) {
    const existing = check(await db.from("projects").select("id").eq("slug", p.slug).maybeSingle(), `project ${p.slug}`) as { id: string } | null;
    if (existing && !force) {
      console.log(`• project ${p.slug} bestaat al — overgeslagen`);
      continue;
    }
    const row = {
      slug: p.slug,
      title: p.title,
      description: p.description,
      intro: p.intro,
      body: p.body,
      challenge: p.challenge,
      approach: p.approach,
      result: p.result,
      cover_image_url: p.coverImage,
      cover_alt: p.coverAlt,
      tags: p.tags,
      project_date: p.date,
      category_id: catId(p.category?.slug),
      client: p.client,
      role: p.role,
      duration: p.duration,
      team: p.team,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      status: p.status,
      featured: p.featured,
      sort_order: p.sortOrder,
    };
    const saved = check(
      await db.from("projects").upsert(row, { onConflict: "slug" }).select("id").single(),
      `project ${p.slug}`,
    ) as { id: string };
    check(await db.from("project_images").delete().eq("project_id", saved.id), "images clear");
    check(
      await db.from("project_images").insert(
        p.images.map((img, i) => ({ project_id: saved.id, url: img.url, path: null, alt: img.alt, caption: img.caption || null, sort_order: i })),
      ),
      `images ${p.slug}`,
    );
    console.log(`✓ project ${p.slug}`);
  }

  console.log("\n✓ Klaar. Maak nu een beheerder aan met:  npm run create-admin -- <email> <wachtwoord>");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
