import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/admin/AuthShell";
import { ResetRequestForm } from "@/components/admin/forms/PasswordForms";

export const metadata: Metadata = { title: "Wachtwoord vergeten" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Wachtwoord vergeten" subtitle="Je ontvangt een e-mail met een link om een nieuw wachtwoord in te stellen.">
      <ResetRequestForm />
      <p className="mt-6 text-sm text-stone">
        <Link href="/admin/login" className="underline decoration-accent decoration-2 underline-offset-4 hover:text-ink">
          Terug naar inloggen
        </Link>
      </p>
    </AuthShell>
  );
}
