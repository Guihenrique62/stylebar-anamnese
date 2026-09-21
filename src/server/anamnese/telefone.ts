/** Mantém só dígitos. Usado como chave de identificação da paciente. */
export function normalizarTelefone(telefone: string) {
  return telefone.replace(/\D/g, "");
}
