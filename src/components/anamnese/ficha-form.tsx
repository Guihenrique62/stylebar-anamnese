"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { z } from "zod";
import type { TipoFicha } from "@/generated/prisma/enums";
import { enviarFicha, type EnvioState } from "@/app/(publico)/ficha/[tipo]/actions";
import { ENVIO_SCHEMA, formatarErros } from "@/lib/validation/anamnese";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, NumberScale, PhoneInput, Select, TextArea, TextInput } from "@/components/ui/field";
import type { Campo, Secao } from "./campos";
import { Progresso } from "./progresso";

type Props = { tipo: TipoFicha; tipoSlug: string; secoes: Secao[] };

/**
 * Formulário público em etapas (uma seção por tela). Todas as etapas ficam no mesmo
 * <form>; as inativas ficam ocultas, então o FormData final tem todos os campos e a
 * Server Action recebe tudo de uma vez. A validação por etapa roda no cliente com o
 * mesmo schema Zod do servidor.
 */
export function FichaForm({ tipo, tipoSlug, secoes }: Props) {
  const [state, action, pending] = useActionState<EnvioState, FormData>(enviarFicha, undefined);
  const [etapa, setEtapa] = useState(0);
  const [errosCliente, setErrosCliente] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const topoRef = useRef<HTMLDivElement>(null);

  const total = secoes.length;
  const ultima = etapa === total - 1;
  const errosServidor = state?.erros ?? {};
  const erros = { ...errosServidor, ...errosCliente };

  // Erro vindo do servidor: volta para a primeira etapa que contém um campo com erro.
  // Padrão de estado derivado (setState durante o render, sem efeito).
  const [stateTratado, setStateTratado] = useState<EnvioState>(state);
  if (state !== stateTratado) {
    setStateTratado(state);
    if (state && state.ok === false) {
      const campos = Object.keys(state.erros);
      const idx = secoes.findIndex((s) => s.campos.some((c) => campos.includes(c.nome)));
      if (idx >= 0) setEtapa(idx);
    }
  }
  useEffect(() => {
    if (state && state.ok === false) topoRef.current?.scrollIntoView({ block: "start" });
  }, [state]);

  function validarEtapa(): boolean {
    const form = formRef.current;
    if (!form) return true;
    const nomes = secoes[etapa].campos.map((c) => c.nome);
    // Os três schemas têm shapes diferentes; para o pick por etapa basta tratá-los como objeto genérico.
    const schema = ENVIO_SCHEMA[tipo] as unknown as z.ZodObject<z.ZodRawShape>;
    const parcial = schema.pick(Object.fromEntries(nomes.map((n) => [n, true])));
    const fd = new FormData(form);
    const dados: Record<string, unknown> = {};
    for (const n of nomes) dados[n] = fd.get(n) ?? undefined;

    const r = parcial.safeParse(dados);
    if (r.success) {
      setErrosCliente({});
      return true;
    }
    const e = formatarErros(r.error);
    setErrosCliente(e);
    const primeiro = Object.keys(e)[0];
    const el = form.querySelector<HTMLElement>(`[name="${primeiro}"]`);
    el?.focus();
    return false;
  }

  function avancar() {
    if (!validarEtapa()) return;
    setEtapa((e) => Math.min(e + 1, total - 1));
    topoRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function voltar() {
    setErrosCliente({});
    setEtapa((e) => Math.max(e - 1, 0));
    topoRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!ultima || !validarEtapa()) e.preventDefault();
      }}
      className="flex flex-1 flex-col"
    >
      <input type="hidden" name="_tipo" value={tipoSlug} />
      {/* Honeypot: invisível e fora da ordem de foco; pessoas não preenchem, bots sim. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Site
          <input type="text" name="site" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div ref={topoRef} className="sticky top-[57px] z-10 border-b border-gray-200 bg-background-soft/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <Progresso atual={etapa} total={total} rotulo={secoes[etapa].titulo} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-5">
        {secoes.map((secao, i) => (
          <fieldset key={secao.titulo} hidden={i !== etapa} className="flex flex-col gap-4">
            <legend className="sr-only">{secao.titulo}</legend>
            <Card className="flex flex-col gap-5">
              {secao.campos.map((campo) => (
                <CampoInput key={campo.nome} campo={campo} valor={state?.valores?.[campo.nome]} erro={erros[campo.nome]} />
              ))}
            </Card>
          </fieldset>
        ))}

        {erros._form ? (
          <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
            {erros._form}
          </p>
        ) : null}
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl gap-3 px-4 py-3">
          {etapa > 0 ? (
            <Button type="button" variante="secondary" tamanho="lg" onClick={voltar} className="basis-1/3">
              Voltar
            </Button>
          ) : null}
          {ultima ? (
            <Button type="submit" tamanho="lg" pending={pending} className="flex-1">
              Enviar ficha
            </Button>
          ) : (
            <Button type="button" tamanho="lg" onClick={avancar} className="flex-1">
              Continuar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function CampoInput({ campo, valor, erro }: { campo: Campo; valor: unknown; erro?: string }) {
  const valorStr = typeof valor === "string" ? valor : undefined;

  if (campo.tipo === "checkbox") {
    return <Checkbox nome={campo.nome} rotulo={campo.rotulo} defaultChecked={valorStr === "on"} erro={erro} />;
  }

  const obrigatorio = "obrigatorio" in campo && campo.obrigatorio;

  return (
    <Field rotulo={campo.rotulo} obrigatorio={obrigatorio} erro={erro}>
      {(id, describedBy) => {
        const comum = { id, name: campo.nome, "aria-describedby": describedBy, invalido: Boolean(erro) };
        switch (campo.tipo) {
          case "textarea":
            return <TextArea {...comum} defaultValue={valorStr} />;
          case "select":
            return (
              <Select {...comum} defaultValue={valorStr}>
                {campo.opcoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </Select>
            );
          case "numero":
            return (
              <NumberScale
                nome={campo.nome}
                min={campo.min}
                max={campo.max}
                padrao={valorStr ? Number(valorStr) : campo.padrao}
                rotuloMin={campo.min === 0 ? "Nenhuma" : "Baixo"}
                rotuloMax={campo.max === 10 ? "Máxima" : "Alto"}
              />
            );
          case "data":
            return <TextInput {...comum} type="date" defaultValue={valorStr} />;
          default:
            if (campo.nome === "telefone") return <PhoneInput {...comum} defaultValue={valorStr} />;
            if (campo.nome === "email") return <TextInput {...comum} type="email" inputMode="email" autoComplete="email" defaultValue={valorStr} placeholder={campo.placeholder} />;
            if (campo.nome === "nome") return <TextInput {...comum} autoComplete="name" defaultValue={valorStr} placeholder={campo.placeholder} />;
            return <TextInput {...comum} defaultValue={valorStr} placeholder={campo.placeholder} />;
        }
      }}
    </Field>
  );
}
