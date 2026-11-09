import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/Toast";
import { SetupNotice } from "@/components/admin/ui";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "CMS", template: "%s — CMS Carmen de Groot" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNotice />;
  return <ToastProvider>{children}</ToastProvider>;
}
