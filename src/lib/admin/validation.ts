import "server-only";
import { z } from "zod";
import type { FieldGroup, ScalarField } from "./fields";

/* ── zod from field definitions ───────────────────────────────────── */

const urlish = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v) || v.startsWith("mailto:"), "Ongeldige URL");

function scalarZod(f: ScalarField): z.ZodTypeAny {
  switch (f.type) {
    case "text":
    case "textarea":
    case "markdown":
      return z.string().max(f.max ?? 20000, `${f.label}: maximaal ${f.max} tekens`);
    case "url":
    case "image":
    case "file":
      return urlish;
    case "email":
      return z.union([z.literal(""), z.string().trim().email(`${f.label}: ongeldig e-mailadres`)]);
    case "boolean":
      return z.boolean();
    case "number":
      return z.coerce.number().min(f.min ?? -1e9).max(f.max ?? 1e9);
    case "stringList":
      return z.array(z.string().trim().max(200)).max(100);
  }
}

export function zodFromGroups(groups: FieldGroup[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const g of groups) {
    for (const f of g.fields) {
      if (f.type === "list") {
        const item: Record<string, z.ZodTypeAny> = {};
        f.fields.forEach((sf) => (item[sf.name] = scalarZod(sf)));
        shape[f.name] = z.array(z.object(item)).max(50);
      } else {
        shape[f.name] = scalarZod(f);
      }
    }
  }
  return z.object(shape);
}

