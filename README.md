# Stylebar Anamnese

Sistema de fichas de anamnese do Stylebar. A cliente acessa o endereço público, escolhe um dos três formulários (Massoterapia, Head Spa ou Depilação), preenche e a ficha fica disponível no admin para todas as terapeutas, separada por tipo. Cada envio gera uma ficha nova, então a paciente acumula histórico.

## Stack

| Camada | Escolha |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 com tokens da marca em `src/app/globals.css` |
| Fontes | Bodoni Moda (títulos) e Work Sans (UI) via `next/font` |
| Validação | Zod (formulários e variáveis de ambiente) |
| Banco | Supabase Postgres via Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Supabase Auth (e-mail e senha) com `@supabase/ssr`, verificação por `getClaims()` |
| Deploy (planejado) | Vercel |

## Identidade visual

Tokens extraídos do site institucional (stylebarfranquia.com.br):

- Paleta: laranja `#EC7F17` (ação e acento), cinza escuro `#2F2F2F` (texto e superfícies escuras, fundo do logo), cinzas de apoio (`#7A7A7A`, `#D7D7D9`, `#F9F9F9`) e branco. Sem azul.
- Títulos em Bodoni Moda, corpo e formulários em Work Sans.
- Botões laranja em caixa alta, cards com raio de 14px, controles com 44px de altura mínima (mobile first).
- Componentes base em `src/components/ui` (Button, Card, Field, Badge, BrandBar, EmptyState). Formulário público em etapas com validação por etapa; admin com navegação inferior no celular e listas em cards que viram tabela a partir de `md`.

## Arquitetura de rotas

```
src/app
├── layout.tsx                          Root layout: fontes, metadata, lang pt-BR
├── not-found.tsx
├── [...rest]/page.tsx                  Catch-all: qualquer URL desconhecida redireciona para /
├── (publico)/
│   ├── page.tsx                        /  Escolha do tipo (3 cards)
│   └── ficha/
│       ├── [tipo]/page.tsx             Formulário do tipo (massoterapia | head-spa | depilacao)
│       ├── [tipo]/actions.ts           Server Action enviarFicha (honeypot + Zod + salvarFicha)
│       └── obrigado/page.tsx
├── (auth)/login/
│   ├── page.tsx + login-form.tsx       Login por e-mail e senha
│   └── actions.ts                      login() e logout() via Supabase Auth
├── (admin)/admin/
│   ├── layout.tsx                      requireTerapeuta() + navegação por tipo + sair
│   ├── page.tsx                        Contadores por tipo e total de pacientes
│   ├── fichas/[tipo]/                  Lista com busca por nome/telefone e filtro de status
│   ├── fichas/[tipo]/[id]/             Detalhe com rótulos, observações e "marcar revisada"
│   └── pacientes/                      Pacientes com contagem de fichas por tipo
└── api/health/route.ts                 Health check (app + banco)
```

Os route groups `(publico)`, `(auth)` e `(admin)` não aparecem na URL. Servem para separar layouts e regras de acesso.


## Organização do código

```
src/
├── app/          Rotas (apenas composição de UI e chamada de serviços)
├── components/
│   ├── ui/       Botão, input, card, etc. com os tokens da marca
│   ├── anamnese/ campos.ts, ficha-form.tsx (etapas), progresso, ícones
│   └── painel/   BottomNav/TopNav, ListaFichas, Busca e Chips do admin
├── server/
│   ├── db/       Client do Prisma (único ponto de acesso ao banco)
│   ├── auth/     getClaims() e requireTerapeuta() (upsert em terapeutas no 1º login)
│   └── anamnese/ telefone, pacientes e fichas (salvar, listar, obter, revisar, contar)
├── lib/
│   ├── env.ts               Variáveis de ambiente validadas com Zod
│   ├── supabase/            Clientes @supabase/ssr (server, client, proxy/updateSession)
│   └── validation/anamnese/ Schemas Zod por tipo + mapa slug ↔ enum
├── components/anamnese/     campos.ts (rótulos/seções por tipo) e ficha-form.tsx
└── types/        Reexporta tipos do Prisma e dos schemas
```

Regra: páginas e route handlers nunca acessam o banco diretamente. Eles chamam serviços em `src/server/*`, que por sua vez usam `src/server/db`.

## Fluxo principal

1. Cliente abre o endereço público (`/`). Qualquer outra URL fora de `/admin`, `/login` e `/api` redireciona para lá.
2. Escolhe o tipo (Massoterapia, Head Spa ou Depilação) e preenche o formulário.
3. A Server Action descarta envios que preencheram o honeypot, valida com o schema Zod do tipo e, em uma transação, encontra ou cria a paciente pelo telefone e grava a ficha na tabela do tipo. Cada envio gera uma ficha nova.
4. Terapeuta vê a ficha em `/admin/fichas/[tipo]/[id]`, registra observações e marca como revisada.

## Autenticação e segurança

- Terapeutas são criadas no dashboard do Supabase (Authentication > Users). Não há cadastro público. No primeiro login o registro em `terapeutas` é criado automaticamente.
- `src/proxy.ts` renova a sessão a cada requisição e redireciona `/admin/*` sem sessão para `/login`. A verificação real é `requireTerapeuta()`, chamada em toda página e Server Action do admin, que usa `getClaims()` (assinatura do JWT verificada). `getSession()` nunca é usado no servidor.
- Todo input passa por Zod no servidor. O redirect pós-login só aceita caminhos internos em `/admin`.
- O formulário é público por design. A proteção anti-bot é um campo honeypot invisível: se vier preenchido, o envio é descartado silenciosamente.
- RLS está habilitado em todas as tabelas, sem políticas, e os grants de `anon`/`authenticated` foram revogados (migração `rls_enable`). Assim a Data API do Supabase não expõe as fichas; só a aplicação, via Prisma como `postgres`, acessa os dados.
- No browser só entram as chaves `NEXT_PUBLIC_*` (publishable). A `service_role` não é usada.

## Banco de dados

Tabelas: `terapeutas`, `pacientes`, `fichas_massoterapia`, `fichas_head_spa`, `fichas_depilacao`. Uma paciente (telefone único) pode ter várias fichas de cada tipo. Cada ficha tem colunas fixas por pergunta (definidas provisoriamente em `prisma/schema.prisma`; rótulos em `src/components/anamnese/campos.ts`).

## Rodando localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Abra http://localhost:3000. Node 26 (ver `.nvmrc`).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build |
| `npm run lint` | ESLint |
| `npm run test:smoke` | Testa os serviços contra o banco real (cria e apaga dados de teste) |
| `npm run db:migrate` | Cria/aplica migração (interativo) |
| `npm run db:deploy` | Aplica migrações pendentes (não interativo) |
| `npm run db:studio` | Prisma Studio |

## Próximos passos

- [ ] Validar com as terapeutas as perguntas de cada formulário e ajustar schema + `campos.ts`
- [ ] Recuperação de senha (Supabase Auth)
- [ ] Deploy na Vercel

## Configuração do Supabase

1. Copie `.env.example` para `.env` e substitua `[YOUR-PASSWORD]` pela senha do banco nas duas URLs.
2. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Project Settings > API Keys).
3. `npm run db:deploy` aplica as migrações e o `postinstall` gera o client.
4. Crie as terapeutas em Authentication > Users (e-mail e senha). Opcional: `user_metadata.nome` vira o nome exibido.

A aplicação usa `DATABASE_URL` (pooler em modo transação, porta 6543) no adapter em `src/server/db`. A CLI do Prisma usa `DIRECT_URL` (modo sessão, porta 5432) definida em `prisma.config.ts`, já que o Prisma 7 não tem mais `directUrl` no schema. O client gerado fica em `src/generated/prisma` e não é versionado; ele é regenerado no `postinstall`.
