"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { login, type LoginState } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <Field rotulo="E-mail">
        {(id) => <TextInput id={id} name="email" type="email" inputMode="email" required autoComplete="email" autoFocus />}
      </Field>

      <Field rotulo="Senha">
        {(id) => <TextInput id={id} name="senha" type="password" required autoComplete="current-password" />}
      </Field>

      {state?.erro ? (
        <p role="alert" className="rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
          {state.erro}
        </p>
      ) : null}

      <Button type="submit" tamanho="lg" largo pending={pending} className="mt-2">
        Entrar
      </Button>
    </form>
  );
}
