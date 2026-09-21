import type { Metadata } from "next";
import { Busca } from "@/components/painel/filtros";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { listarPacientes } from "@/server/anamnese";
import { requireTerapeuta } from "@/server/auth";

export const metadata: Metadata = { title: "Pacientes" };
export const dynamic = "force-dynamic";

export default async function PacientesPage(props: PageProps<"/admin/pacientes">) {
  await requireTerapeuta();
  const sp = await props.searchParams;
  const busca = typeof sp.q === "string" ? sp.q : undefined;
  const pacientes = await listarPacientes(busca);

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl">Pacientes</h1>
        <p className="shrink-0 text-sm text-muted">{pacientes.length} {pacientes.length === 1 ? "paciente" : "pacientes"}</p>
      </div>

      <div className="mt-4">
        <Busca valor={busca} placeholder="Buscar por nome ou telefone" />
      </div>

      <div className="mt-5">
        {pacientes.length === 0 ? (
          <EmptyState titulo="Nenhuma paciente encontrada" descricao="As pacientes aparecem aqui assim que enviam a primeira ficha." />
        ) : (
          <>
            <ul className="flex flex-col gap-3 md:hidden">
              {pacientes.map((p) => (
                <li key={p.id} className="rounded-(--radius-card) border border-gray-200 bg-background p-4 shadow-(--shadow-card)">
                  <p className="font-medium">{p.nome}</p>
                  <p className="mt-0.5 text-sm">
                    <a href={`tel:+55${p.telefone}`} className="text-primary underline-offset-4 hover:underline">
                      {p.telefone}
                    </a>
                    {p.email ? <span className="text-muted"> · {p.email}</span> : null}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Contagem rotulo="Masso" n={p._count.fichasMassoterapia} />
                    <Contagem rotulo="Head Spa" n={p._count.fichasHeadSpa} />
                    <Contagem rotulo="Depilação" n={p._count.fichasDepilacao} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-hidden rounded-(--radius-card) border border-gray-200 bg-background md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Telefone</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 text-center font-medium">Massoterapia</th>
                    <th className="px-4 py-3 text-center font-medium">Head Spa</th>
                    <th className="px-4 py-3 text-center font-medium">Depilação</th>
                    <th className="px-4 py-3 font-medium">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((p) => (
                    <tr key={p.id} className="border-t border-gray-200 hover:bg-background-soft">
                      <td className="px-4 py-3 font-medium">{p.nome}</td>
                      <td className="px-4 py-3">{p.telefone}</td>
                      <td className="px-4 py-3">{p.email ?? "—"}</td>
                      <td className="px-4 py-3 text-center">{p._count.fichasMassoterapia}</td>
                      <td className="px-4 py-3 text-center">{p._count.fichasHeadSpa}</td>
                      <td className="px-4 py-3 text-center">{p._count.fichasDepilacao}</td>
                      <td className="px-4 py-3">{formatDate(p.criadoEm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Contagem({ rotulo, n }: { rotulo: string; n: number }) {
  return (
    <Badge tom={n > 0 ? "laranja" : "cinza"}>
      {rotulo} · {n}
    </Badge>
  );
}
