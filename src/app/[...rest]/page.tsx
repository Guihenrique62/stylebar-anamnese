import { redirect } from "next/navigation";

/**
 * Catch-all: qualquer URL que não seja rota real (/, /ficha/*, /login, /admin/*, /api/*)
 * leva a cliente para a página do formulário.
 */
export default function RedirecionarParaInicio() {
  redirect("/");
}
