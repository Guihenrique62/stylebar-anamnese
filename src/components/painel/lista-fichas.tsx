import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { FichaResumo } from "@/server/anamnese/fichas";

/** Lista de fichas: cards no celular, tabela a partir de md. */
export function ListaFichas({ fichas, slug }: { fichas: FichaResumo[]; slug: string }) {
  if (fichas.length === 0) {
    return <EmptyState titulo="Nenhuma ficha encontrada" descricao="Ajuste a busca ou o filtro de status." />;
  }

  return (
    <>
      <ul className="flex flex-col gap-3 md:hidden">
        {fichas.map((f) => (
          <li key={f.id}>
            <Link
              href={`/admin/fichas/${slug}/${f.id}`}
              className="flex items-center gap-3 rounded-(--radius-card) border border-gray-200 bg-background p-4 shadow-(--shadow-card) active:bg-gray-100"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{f.paciente.nome}</p>
                <p className="mt-0.5 text-sm text-muted">{f.paciente.telefone}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <StatusBadge status={f.status} />
                  <span>{formatDate(f.enviadaEm)}</span>
                </div>
              </div>
              <Chevron />
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-(--radius-card) border border-gray-200 bg-background md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Paciente</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3 font-medium">Enviada em</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Revisada por</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((f) => (
              <tr key={f.id} className="border-t border-gray-200 hover:bg-background-soft">
                <td className="px-4 py-3 font-medium">{f.paciente.nome}</td>
                <td className="px-4 py-3">{f.paciente.telefone}</td>
                <td className="px-4 py-3">{formatDate(f.enviadaEm)}</td>
                <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                <td className="px-4 py-3">{f.revisadaPor?.nome ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/fichas/${slug}/${f.id}`} className="font-medium text-primary hover:underline">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
