import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/admin/AuthShell";
import { LoginForm } from "@/components/admin/forms/LoginForm";

export const metadata: Metadata = { title: "Inloggen" };

const ERRORS: Record<string, string> = {
  "geen-toegang": "Dit account heeft geen toegang tot het CMS.",
  "link-verlopen": "Deze link is ongeldig of verlopen. Vraag een nieuwe aan.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <AuthShell title="Inloggen" subtitle="Log in om de website te beheren.">
      {error && ERRORS[error] && (
        <p role="alert" className="mb-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {ERRORS[error]}
        </p>
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
