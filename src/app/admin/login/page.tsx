import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/admin/AuthShell";
import { LoginForm } from "@/components/admin/forms/LoginForm";
import { buttonClasses } from "@/components/ui/Button";
import { signOut } from "@/lib/admin/actions/auth";

export const metadata: Metadata = { title: "Inloggen" };

const ERRORS: Record<string, string> = {
  "geen-toegang": "Dit account heeft geen toegang tot het CMS.",
  "rechten-onbekend":
    "Je rechten konden niet worden gecontroleerd door een databasefout. Controleer of alle migraties in supabase/migrations zijn uitgevoerd; de exacte fout staat in de serverlogs.",
  "link-verlopen": "Deze link is ongeldig of verlopen. Vraag een nieuwe aan.",
};

/** Errors that occur while a session is still active — offer an explicit logout. */
const SIGNED_IN_ERRORS = new Set(["geen-toegang", "rechten-onbekend"]);

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const message = error ? ERRORS[error] : undefined;

  return (
    <AuthShell title="Inloggen" subtitle="Log in om de website te beheren.">
      {message && (
        <div role="alert" className="mb-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <p>{message}</p>
          {error && SIGNED_IN_ERRORS.has(error) && (
            <form action={signOut} className="mt-3">
              <button type="submit" className={buttonClasses("secondary", "sm", "!border-danger/30 !text-danger hover:!bg-danger hover:!text-white")}>
                Uitloggen en met een ander account inloggen
              </button>
            </form>
          )}
        </div>
      )}
      <LoginForm next={next ?? "/admin"} />
      <p className="mt-6 text-sm text-stone">
        <Link href="/admin/wachtwoord-vergeten" className="underline decoration-accent decoration-2 underline-offset-4 hover:text-ink">
          Wachtwoord vergeten?
        </Link>
      </p>
    </AuthShell>
  );
}
