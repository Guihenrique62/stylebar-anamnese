# Stylebar Anamnese

Sistema de fichas de anamnese do Stylebar. A terapeuta gera um link único no painel e envia à cliente. A cliente abre o link, preenche o formulário e a ficha fica disponível no painel para consulta.

## Stack

| Camada | Escolha |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 com tokens da marca em `src/app/globals.css` |
| Fontes | Bodoni Moda (títulos) e Work Sans (UI) via `next/font` |
| Validação | Zod (formulários e variáveis de ambiente) |
| Banco (planejado) | PostgreSQL com Prisma |
| Auth (planejado) | E-mail e senha, sessão em cookie httpOnly assinado |
| Deploy (planejado) | Vercel |

## Identidade visual

Tokens extraídos do site institucional (stylebarfranquia.com.br):

- Laranja principal `#EC7F17`, azul-petróleo `#183C51`, texto `#2F2F2F`, teal `#47A7A6`.
- Títulos em Bodoni Moda, corpo e formulários em Work Sans.
- Botões laranja sólidos com texto branco em caixa alta. Cards com raio de 14px e sombra suave.

## Arquitetura de rotas

```
src/app
├── layout.tsx                 Root layout: fontes, metadata, lang pt-BR
├── page.tsx                   Landing mínima com acesso ao painel
├── not-found.tsx
├── (publico)/
│   └── ficha/[token]/
│       ├── page.tsx           Formulário público (token do link)
│       └── obrigado/page.tsx  Confirmação de envio
├── (auth)/
│   └── login/page.tsx         Login das terapeutas
├── (painel)/
│   └── painel/
│       ├── layout.tsx         Header e navegação do painel
│       ├── page.tsx           Resumo
│       ├── fichas/page.tsx    Lista de fichas
│       ├── fichas/[id]/page.tsx  Detalhe da ficha
│       ├── pacientes/page.tsx Pacientes e histórico
│       └── links/page.tsx     Geração de links únicos
└── api/
    └── health/route.ts        Health check
```

Os route groups `(publico)`, `(auth)` e `(painel)` não aparecem na URL. Servem para separar layouts e regras de acesso.

`src/proxy.ts` redireciona para `/login` qualquer acesso a `/painel/*` sem cookie de sessão, e manda quem já está logado de `/login` para `/painel`.

## Organização do código

```
src/
├── app/          Rotas (apenas composição de UI e chamada de serviços)
├── components/
│   ├── ui/       Botão, input, card, etc. com os tokens da marca
│   ├── anamnese/ Etapas e campos do formulário público
│   └── painel/   Tabelas, filtros e cards do painel
├── server/
│   ├── db/       Client do banco (único ponto de acesso)
│   ├── auth/     Sessão e login das terapeutas
│   └── anamnese/ Serviços: gerar link, validar token, salvar e listar fichas
├── lib/          env validado, utilitários
└── types/        Modelo de domínio (Terapeuta, Paciente, LinkAnamnese, FichaAnamnese)
```

Regra: páginas e route handlers nunca acessam o banco diretamente. Eles chamam serviços em `src/server/*`, que por sua vez usam `src/server/db`.

## Fluxo principal

1. Terapeuta autenticada gera um link em `/painel/links`. O serviço cria um `LinkAnamnese` com token aleatório e validade.
2. Cliente abre `/ficha/[token]`. O servidor valida o token (ativo e não expirado) antes de renderizar o formulário.
3. Cliente envia o formulário. Uma Server Action valida com Zod, cria ou vincula o `Paciente`, salva a `FichaAnamnese`, marca o link como usado e redireciona para `/ficha/[token]/obrigado`.
4. Terapeuta consulta a ficha em `/painel/fichas/[id]` e pode registrar observações.

## Rodando localmente

```bash
cp .env.example .env.local
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

## Próximos passos

- [ ] Definir com as terapeutas os campos definitivos da anamnese (`src/types/anamnese.ts`)
- [ ] Prisma schema e migrações
- [ ] Login e sessão em `src/server/auth`
- [ ] Formulário público em etapas com validação Zod
- [ ] Listagem, busca e detalhe das fichas no painel
- [ ] Geração e expiração de links
- [ ] Deploy na Vercel
