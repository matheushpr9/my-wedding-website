# 💒 Laura & Matheus — Site de Casamento

Site de casamento single-page responsivo, construído com React + TypeScript + Vite.

## ✨ Funcionalidades

- **Contagem regressiva** — Timer em tempo real até a data do casamento (11/07/2026)
- **Confirmação de presença (RSVP)** — Formulário com suporte a acompanhantes
- **Informações do local** — Cerimônia e recepção com links para Google Maps
- **Galeria de fotos** — Carrossel com autoplay (Embla Carousel) e lightbox
- **Lista de presentes** — Seleção de presentes com geração de chave Pix para pagamento
- **Versículo bíblico** — Seção decorativa com citação

## 🛠️ Stack

| Camada       | Tecnologia                                      |
| ------------ | ------------------------------------------------ |
| Framework    | [React 18](https://react.dev) + TypeScript       |
| Build        | [Vite 5](https://vitejs.dev)                     |
| Estilização  | [Tailwind CSS 3](https://tailwindcss.com)        |
| Componentes  | [shadcn/ui](https://ui.shadcn.com) (Radix UI)   |
| Carrossel    | [Embla Carousel](https://www.embla-carousel.com) |
| Roteamento   | React Router DOM v6                              |
| Testes       | Vitest + Testing Library + Playwright            |

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Imagens (fotos do casal, presentes, hero)
├── components/
│   ├── ui/          # Componentes shadcn/ui (button, toast, dialog, etc.)
│   ├── Header.tsx        # Navbar fixa com menu mobile
│   ├── HeroSection.tsx   # Banner principal + contagem regressiva
│   ├── RSVPSection.tsx   # Formulário de confirmação de presença (Google Sheets)
│   ├── VenueSection.tsx  # Cards de cerimônia e recepção
│   ├── PhotosSection.tsx # Galeria com carrossel e lightbox
│   ├── GiftListSection.tsx # Lista de presentes + modal Pix
│   ├── VerseSection.tsx  # Versículo bíblico
│   └── Footer.tsx        # Rodapé
├── hooks/           # Custom hooks (ex: use-mobile)
├── lib/             # Utilitários (api.ts, pix.ts, utils.ts)
├── pages/
│   ├── Index.tsx    # Página principal (compõe todas as seções)
│   ├── Admin.tsx    # Painel admin (presentes e fotos)
│   └── NotFound.tsx # Página 404
├── App.tsx          # Providers e rotas
└── main.tsx         # Entry point

server/
├── db.ts            # SQLite setup (presentes, fotos, admin)
├── index.ts         # API Express (auth, CRUD presentes/fotos)
└── uploads/         # Imagens enviadas pelo admin

scripts/
└── export.ts        # Exporta dados do banco para JSONs estáticos

public/
├── data/            # JSONs gerados pelo export (gifts.json, photos.json)
└── uploads/         # Imagens copiadas pelo export
```

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) >= 18

### Instalação e execução

```bash
npm install
npm run dev
```

O servidor de desenvolvimento inicia em `http://localhost:8080`.

### Outros comandos

```bash
npm run server       # Sobe a API local (Express + SQLite)
npm run dev          # Sobe o frontend (Vite)
npm run dev:all      # Sobe API + frontend juntos
npm run export       # Exporta dados do banco para JSONs estáticos
npm run deploy       # Export + build de produção
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # ESLint
npm run test         # Testes unitários (Vitest)
npm run test:watch   # Testes em modo watch
```

## 🔧 Painel Admin (Presentes e Fotos)

O site possui um painel admin local em `/admin` para gerenciar presentes e fotos.
Os dados são salvos em um banco SQLite local e exportados como arquivos estáticos para o deploy.

### Fluxo de atualização

1. Suba o servidor local:

```bash
npm run server
```

2. Suba o frontend (em outro terminal):

```bash
npm run dev
```

3. Acesse `http://localhost:8080/admin` e cadastre os presentes e fotos

4. Exporte os dados:

```bash
npm run export
```

5. Comite e push (incluindo `public/data/` e `public/uploads/`):

```bash
git add .
git commit -m "feat: export static data"
git push
```

A Hostinger faz o `npm run build` e serve tudo estático — presentes, fotos, tudo já vai estar nos JSONs e imagens dentro do `public/`.

Sempre que quiser atualizar presentes ou fotos, repita os passos 1→5.

> **Credenciais padrão:** `admin` / `admin123` (configurável via variáveis de ambiente `ADMIN_USER` e `ADMIN_PASS`).
> Na primeira execução o banco é criado automaticamente. Para redefinir as credenciais, delete `server/data.db` e reinicie o servidor.
