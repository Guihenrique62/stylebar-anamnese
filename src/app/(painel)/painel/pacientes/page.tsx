import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pacientes" };

export default function PacientesPage() {
  return (
    <>
      <h1 className="text-3xl">Pacientes</h1>
      <p className="mt-2 text-muted">Cadastro e histórico de fichas por paciente. Em construção.</p>
    </>
  );
}
