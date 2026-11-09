/**
 * Creates (or promotes) a CMS administrator.
 * Usage: npm run create-admin -- carmen@example.nl "een-sterk-wachtwoord" "Carmen de Groot"
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";

const [email, password, fullName = "Carmen de Groot"] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY zijn vereist (zie .env.example).");
  process.exit(1);
}
if (!email) {
  console.error('✗ Gebruik: npm run create-admin -- <email> <wachtwoord> ["Volledige naam"]');
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  // Find existing user (paginated)
  let userId: string | undefined;
  for (let page = 1; page < 50 && !userId; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
    if (data.users.length < 200) break;
  }

  if (!userId) {
    if (!password || password.length < 10) {
      console.error("✗ Geef een wachtwoord van minimaal 10 tekens op voor een nieuwe gebruiker.");
      process.exit(1);
    }
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`✓ Gebruiker aangemaakt: ${email}`);
  } else {
    console.log(`• Gebruiker bestaat al: ${email}`);
  }

  const { error } = await db
    .from("profiles")
    .upsert({ id: userId, email, full_name: fullName, role: "admin" }, { onConflict: "id" });
  if (error) throw error;
  console.log("✓ Rol ingesteld op admin. Inloggen via /admin");
}

main().catch((e) => {
  console.error("✗", e.message ?? e);
  process.exit(1);
});
