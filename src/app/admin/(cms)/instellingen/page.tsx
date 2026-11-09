import type { Metadata } from "next";
import { SettingsEditor } from "@/components/admin/forms/Editors";
import { PageHeader } from "@/components/admin/ui";
import { defaultSettings } from "@/content/defaults";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Instellingen" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
  const settings = { ...defaultSettings, ...((data?.data as object) ?? {}) } as unknown as Record<string, unknown>;

  return (
    <>
      <PageHeader title="Instellingen" description="Site titel, meta-informatie, contactgegevens, social links en bestanden." />
      <SettingsEditor settings={settings} />
    </>
  );
}
