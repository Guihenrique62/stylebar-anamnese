"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { TipoFicha } from "@/generated/prisma/enums";
import { enviarFicha, type EnvioState } from "@/app/(publico)/ficha/[tipo]/actions";
import { ENVIO_SCHEMA, errosDasRegras, formDataParaObjeto, formatarErros } from "@/lib/validation/anamnese";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Checkbox,
  CheckboxGroup,
  Field,
  NumberScale,
  PhoneInput,
  RadioGroup,
  Select,
  SimNao,
  TextArea,
  TextInput,
} from "@/components/ui/field";
import type { Campo, Secao } from "./campos";
import { Progresso } from "./progresso";

type Props = { tipo: TipoFicha; tipoSlug: string; secoes: Secao[] };

/** Campo dependente só conta (e só aparece) quando a condição vale. */
function visivel(campo: Campo, valores: Record<string, unknown>) {
  if (!campo.dependeDe) return true;
  const v = valores[campo.dependeDe.campo];
  return Array.isArray(v) ? v.includes(campo.dependeDe.valor) : v === campo.dependeDe.valor;
}

/**
 * Formulário público em etapas (uma seção por tela). Todas as etapas ficam no mesmo
 * <form>; as inativas ficam ocultas, então o FormData final tem todos os campos e a
 * Server Action recebe tudo de uma vez. A validação por etapa roda o schema completo
 * no cliente e mostra só os erros dos campos da etapa atual.
 */
export function FichaForm({ tipo, tipoSlug, secoes }: Props) {
  const [state, action, pending] = useActionState<EnvioState, FormData>(enviarFicha, undefined);
  const [etapa, setEtapa] = useState(0);
  const [errosCliente, setErrosCliente] = useState<Record<string, string>>({});
  const [valoresAtuais, setValoresAtuais] = useState<Record<string, unknown>>({});
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

  function lerValores() {
    const form = formRef.current;
    return form ? formDataParaObjeto(new FormData(form)) : {};
  }

  function validarEtapa(): boolean {
    const valores = lerValores();
    const nomesEtapa = new Set(secoes[etapa].campos.filter((c) => visivel(c, valores)).map((c) => c.nome));
    const r = ENVIO_SCHEMA[tipo].safeParse(valores);
    // Regras condicionais rodam à parte: o Zod pula o superRefine quando há outros erros
    // (e em etapas anteriores sempre há campos das etapas seguintes ainda vazios).
    const todos = { ...(r.success ? {} : formatarErros(r.error)), ...errosDasRegras(tipo, valores) };
    const daEtapa = Object.fromEntries(Object.entries(todos).filter(([k]) => nomesEtapa.has(k)));
    setErrosCliente(daEtapa);
    if (Object.keys(daEtapa).length === 0) return true;

    const primeiro = Object.keys(daEtapa)[0];
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`);
    const alvo = (el?.closest("[role=radiogroup]") as HTMLElement | null) ?? el;
    alvo?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus({ preventScroll: true });
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
      onChange={() => setValoresAtuais(lerValores())}
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
                <div key={campo.nome} hidden={!visivel(campo, valoresAtuais)}>
                  <CampoInput campo={campo} valor={state?.valores?.[campo.nome]} erro={erros[campo.nome]} />
                </div>
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
  const valorArr = Array.isArray(valor) ? (valor as string[]) : valorStr ? [valorStr] : undefined;

  if (campo.tipo === "checkbox") {
    return <Checkbox nome={campo.nome} rotulo={campo.rotulo} defaultChecked={valorStr === "on"} erro={erro} ajuda={campo.ajuda} />;
  }

  const obrigatorio = "obrigatorio" in campo && campo.obrigatorio;

  return (
    <Field rotulo={campo.rotulo} obrigatorio={obrigatorio} erro={erro} ajuda={campo.ajuda}>
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
          case "simnao":
            return <SimNao nome={campo.nome} valor={valorStr} erro={erro} />;
          case "radio":
            return (
              <RadioGroup
                nome={campo.nome}
                opcoes={campo.opcoes}
                valor={valorStr}
                erro={erro}
                colunas={campo.opcoes.length > 3 ? 2 : 1}
              />
            );
          case "multi":
            return <CheckboxGroup nome={campo.nome} opcoes={campo.opcoes} valores={valorArr} />;
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
            if (campo.nome === "email")
              return <TextInput {...comum} type="email" inputMode="email" autoComplete="email" defaultValue={valorStr} placeholder={campo.placeholder} />;
            if (campo.nome === "nome") return <TextInput {...comum} autoComplete="name" defaultValue={valorStr} placeholder={campo.placeholder} />;
            return <TextInput {...comum} defaultValue={valorStr} placeholder={campo.placeholder} />;
        }
      }}
    </Field>
  );
}
