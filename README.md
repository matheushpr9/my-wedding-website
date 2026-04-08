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
│   ├── RSVPSection.tsx   # Formulário de confirmação de presença
│   ├── VenueSection.tsx  # Cards de cerimônia e recepção
│   ├── PhotosSection.tsx # Galeria com carrossel e lightbox
│   ├── GiftListSection.tsx # Lista de presentes + modal Pix
│   ├── VerseSection.tsx  # Versículo bíblico
│   └── Footer.tsx        # Rodapé
├── hooks/           # Custom hooks (ex: use-mobile)
├── lib/             # Utilitários
├── pages/
│   ├── Index.tsx    # Página principal (compõe todas as seções)
│   └── NotFound.tsx # Página 404
├── App.tsx          # Providers e rotas
└── main.tsx         # Entry point
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
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # ESLint
npm run test         # Testes unitários (Vitest)
npm run test:watch   # Testes em modo watch
```
