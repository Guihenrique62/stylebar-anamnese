/**
 * Autenticação das terapeutas.
 *
 * Plano: login com e-mail e senha, sessão em cookie httpOnly assinado com
 * SESSION_SECRET. O proxy (src/proxy.ts) só verifica a presença do cookie;
 * a validação da assinatura e a carga da terapeuta acontecem aqui.
 */
export {};
