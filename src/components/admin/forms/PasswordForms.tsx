"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword, requestPasswordReset, setNewPassword } from "@/lib/admin/actions/auth";
import type { ActionResult } from "@/lib/admin/auth";
import { buttonClasses } from "@/components/ui/Button";

function Feedback({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return state.ok ? (
    <p role="status" className="rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
      {state.message}
    </p>
  ) : (
    <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
      {state.error}
    </p>
  );
}

const HINT = "Minimaal 10 tekens, met ten minste één letter en één cijfer.";

export function ChangePasswordForm({ reset = false }: { reset?: boolean }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(reset ? setNewPassword : changePassword, null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="max-w-md space-y-5">
      <Feedback state={state} />
      {!reset && (
        <div>
          <label htmlFor="current" className="field-label">
            Huidig wachtwoord
          </label>
          <input id="current" name="current" type="password" autoComplete="current-password" required className="input" />
        </div>
      )}
      <div>
        <label htmlFor="password" className="field-label">
          Nieuw wachtwoord
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} className="input" aria-describedby="pw-hint" />
        <span id="pw-hint" className="field-hint">
          {HINT}
        </span>
      </div>
      <div>
        <label htmlFor="confirm" className="field-label">
          Herhaal nieuw wachtwoord
        </label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className="input" />
      </div>
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md")}>
        {pending ? "Opslaan…" : "Wachtwoord wijzigen"}
      </button>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(requestPasswordReset, null);
  return (
    <form action={action} className="space-y-5">
      <Feedback state={state} />
      <div>
        <label htmlFor="email" className="field-label">
          E-mailadres
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full")}>
        {pending ? "Versturen…" : "Stuur resetlink"}
      </button>
    </form>
  );
}
