import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/forms/PasswordForms";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const { reset } = await searchParams;
  const { user, profile } = await requireAdmin();
  const isReset = reset === "1";

  return (
    <>
      <PageHeader title="Account" description="Je gegevens en wachtwoord." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={isReset ? "Stel een nieuw wachtwoord in" : "Wachtwoord wijzigen"}>
          {isReset && (
            <p className="mb-5 rounded-xl bg-accent/40 px-4 py-3 text-sm">Je bent ingelogd via de resetlink. Kies hieronder een nieuw wachtwoord.</p>
          )}
          <ChangePasswordForm reset={isReset} />
        </Card>
        <Card title="Gegevens">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-stone">Naam</dt>
              <dd>{profile.full_name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-stone">E-mail</dt>
              <dd>{profile.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-stone">Rol</dt>
              <dd className="capitalize">{profile.role}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Laatst ingelogd</dt>
              <dd>{user.last_sign_in_at ? formatDateTime(user.last_sign_in_at) : "—"}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
