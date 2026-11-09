"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";

const initial: ContactState = { status: "idle" };

export function ContactForm({ successMessage, email }: { successMessage: string; email: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [startedAt, setStartedAt] = useState(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => setStartedAt(Date.now()), []);
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[1.5rem] border border-line bg-surface p-10 text-center focus:outline-none md:p-14">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink">
          <Check size={26} />
        </span>
        <p className="mt-6 text-display-sm font-medium">Bericht verstuurd</p>
        <p className="mx-auto mt-3 max-w-sm text-stone">{successMessage}</p>
      </div>
    );
  }

  const err = state.errors ?? {};
  const v = state.values;

  return (
    <form action={action} noValidate className="space-y-6">
      {state.status === "error" && state.message && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-5 py-4 text-sm text-danger focus:outline-none">
          {state.message}
          {!state.errors && email && (
            <>
              {" "}
              <a href={`mailto:${email}`} className="font-medium underline">
                {email}
              </a>
            </>
          )}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Naam" error={err.name}>
          <input id="name" name="name" type="text" autoComplete="name" required defaultValue={v?.name} className={inputCls(err.name)} aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} />
        </Field>
        <Field id="email" label="E-mailadres" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v?.email} className={inputCls(err.email)} aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} />
        </Field>
      </div>

      <Field id="subject" label="Onderwerp" optional error={err.subject}>
        <input id="subject" name="subject" type="text" defaultValue={v?.subject} className={inputCls(err.subject)} aria-invalid={!!err.subject} />
      </Field>

      <Field id="message" label="Bericht" error={err.message}>
        <textarea id="message" name="message" rows={6} required defaultValue={v?.message} className={cn(inputCls(err.message), "min-h-[180px]")} aria-invalid={!!err.message} aria-describedby={err.message ? "message-error" : undefined} />
      </Field>

      {/* Honeypot — hidden from humans and assistive tech */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="company">Bedrijf</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-stone">
          Je gegevens worden alleen gebruikt om op je bericht te reageren.
        </p>
        <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
          {pending ? "Versturen…" : "Verstuur bericht"}
        </button>
      </div>
    </form>
  );
}

function inputCls(error?: string) {
  return cn("input", error && "!border-danger focus:!ring-danger/10");
}

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-normal text-stone">(optioneel)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
