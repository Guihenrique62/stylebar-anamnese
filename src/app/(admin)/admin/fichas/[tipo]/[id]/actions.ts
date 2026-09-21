"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SLUG_POR_TIPO, tipoPorSlug } from "@/lib/validation/anamnese";
import { revisarFicha } from "@/server/anamnese";
import { requireTerapeuta } from "@/server/auth";

const schema = z.object({
  tipo: z.string(),
  id: z.string().uuid(),
  observacoesTerapeuta: z.string().trim().max(4000).optional(),
});

/** Marca a ficha como revisada pela terapeuta logada e salva as observações. */
export async function revisarFichaAction(formData: FormData) {
  const terapeuta = await requireTerapeuta();
  const dados = schema.parse({
    tipo: formData.get("tipo"),
    id: formData.get("id"),
    observacoesTerapeuta: formData.get("observacoesTerapeuta") || undefined,
  });
  const tipo = tipoPorSlug(dados.tipo);
  if (!tipo) throw new Error("Tipo inválido");

  await revisarFicha(tipo, dados.id, terapeuta.id, dados.observacoesTerapeuta);
  revalidatePath(`/admin/fichas/${SLUG_POR_TIPO[tipo]}/${dados.id}`);
  revalidatePath(`/admin/fichas/${SLUG_POR_TIPO[tipo]}`);
}
