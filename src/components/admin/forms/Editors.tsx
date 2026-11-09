"use client";

import { savePage, saveSettings } from "@/lib/admin/actions/content";
import { pageSchemas, settingsSchema, type FieldGroup } from "@/lib/admin/fields";
import type { PageKey } from "@/lib/types";
import { SchemaForm } from "./SchemaForm";

const seoGroup: FieldGroup = {
  title: "SEO",
  description: "Hoe deze pagina in Google en bij het delen op social media verschijnt.",
  fields: [
    { type: "text", name: "seoTitle", label: "SEO titel", max: 60 },
    { type: "textarea", name: "seoDescription", label: "SEO beschrijving", max: 160, rows: 3 },
  ],
};

export function PageEditor({
  pageKey,
  content,
  seo,
}: {
  pageKey: PageKey;
  content: Record<string, unknown>;
  seo: { seoTitle: string; seoDescription: string };
}) {
  return (
    <SchemaForm
      groups={pageSchemas[pageKey]}
      initial={content}
      extra={{ group: seoGroup, initial: seo }}
      submitLabel="Opslaan & publiceren"
      onSave={(values, extra) =>
        savePage(pageKey, values, {
          seoTitle: String(extra.seoTitle ?? ""),
          seoDescription: String(extra.seoDescription ?? ""),
        })
      }
    />
  );
}

export function SettingsEditor({ settings }: { settings: Record<string, unknown> }) {
  return <SchemaForm groups={settingsSchema} initial={settings} onSave={(values) => saveSettings(values)} />;
}
