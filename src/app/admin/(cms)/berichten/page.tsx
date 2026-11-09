import type { Metadata } from "next";
import { MessageList } from "@/components/admin/MessageList";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Berichten" };

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("messages")
    .select("id, name, email, subject, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHeader title="Berichten" description="Berichten die via het contactformulier zijn verstuurd." />
      {data?.length ? <MessageList messages={data} /> : <EmptyState title="Nog geen berichten" text="Nieuwe berichten via het contactformulier verschijnen hier." />}
    </>
  );
}
