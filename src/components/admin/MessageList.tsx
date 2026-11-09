"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMessage, setMessageRead } from "@/lib/admin/actions/content";
import { cn, formatDateTime } from "@/lib/utils";
import { useToast } from "@/components/admin/Toast";
import { AnchorButton, buttonClasses } from "@/components/ui/Button";
import { Trash } from "@/components/ui/icons";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function MessageList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const toast = useToast();
  const [openId, setOpenId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const open = (m: Message) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) startTransition(async () => {
      await setMessageRead(m.id, true);
      router.refresh();
    });
  };

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {messages.map((m) => (
        <li key={m.id}>
          <button type="button" onClick={() => open(m)} aria-expanded={openId === m.id} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-paper/60">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", m.is_read ? "bg-transparent" : "bg-accent ring-1 ring-ink/30")} aria-label={m.is_read ? undefined : "Ongelezen"} />
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate", !m.is_read && "font-semibold")}>{m.name}</span>
              <span className="block truncate text-sm text-stone">{m.subject || m.message.slice(0, 90)}</span>
            </span>
            <span className="shrink-0 text-xs text-stone">{formatDateTime(m.created_at)}</span>
          </button>
          {openId === m.id && (
            <div className="border-t border-line bg-paper/40 px-5 py-5 sm:pl-[2.85rem]">
              <p className="text-sm text-stone">
                {m.name} &lt;<a href={`mailto:${m.email}`} className="underline">{m.email}</a>&gt;
              </p>
              {m.subject && <p className="mt-2 font-medium">{m.subject}</p>}
              <p className="mt-3 whitespace-pre-wrap leading-relaxed">{m.message}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <AnchorButton href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "je bericht"}`)}`} size="sm">
                  Beantwoorden
                </AnchorButton>
                <button
                  type="button"
                  className={buttonClasses("ghost", "sm")}
                  onClick={() =>
                    startTransition(async () => {
                      await setMessageRead(m.id, false);
                      setOpenId(null);
                      router.refresh();
                    })
                  }
                >
                  Markeer als ongelezen
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm text-danger hover:bg-danger/10"
                  onClick={() => {
                    if (!confirm("Dit bericht definitief verwijderen?")) return;
                    startTransition(async () => {
                      const res = await deleteMessage(m.id);
                      if (!res.ok) return toast(res.error, "error");
                      toast(res.message ?? "Verwijderd.");
                      router.refresh();
                    });
                  }}
                >
                  <Trash size={15} /> Verwijderen
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
