"use client";

import { MEDIA_BUCKET } from "@/lib/env";
import { registerMedia } from "@/lib/admin/actions/content";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export interface UploadedFile {
  id: string;
  url: string;
  path: string;
  name: string;
  width: number | null;
  height: number | null;
}

function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  if (!file.type.startsWith("image/")) return Promise.resolve({ width: null, height: null });
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth || null, height: img.naturalHeight || null });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Uploads directly from the browser to Supabase Storage (protected by RLS:
 * only admins can write) and registers the file in the media library.
 */
export async function uploadFile(file: File, folder = "library", allowed: string[] = IMAGE_TYPES): Promise<UploadedFile> {
  if (!allowed.includes(file.type)) throw new Error(`Bestandstype niet toegestaan: ${file.name}`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name} is groter dan 10 MB.`);

  const supabase = createBrowserSupabase();
  const dot = file.name.lastIndexOf(".");
  const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "bestand";
  const ext = (dot > 0 ? file.name.slice(dot + 1) : "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${Date.now().toString(36)}-${base}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  const { width, height } = await readDimensions(file);

  const res = await registerMedia({
    path,
    url: data.publicUrl,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    width,
    height,
  });
  if (!res.ok) throw new Error(res.error);

  return { id: res.data!.id, url: data.publicUrl, path, name: file.name, width, height };
}
