import type { Metadata } from "next";
import { MediaLibrary, type MediaItem } from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("media")
    .select("id, url, path, name, alt, mime_type, size_bytes, width, height, created_at")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="Media" description="Upload, beschrijf, orden en verwijder afbeeldingen en bestanden." />
      <MediaLibrary items={(data ?? []) as MediaItem[]} />
    </>
  );
}
