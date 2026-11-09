"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/lib/admin/actions/auth";
import { buttonClasses } from "@/components/ui/Button";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="field-label">
          E-mailadres
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className="input" autoFocus />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Wachtwoord
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full")}>
        {pending ? "Bezig met inloggen…" : "Inloggen"}
      </button>
    </form>
  );
}
