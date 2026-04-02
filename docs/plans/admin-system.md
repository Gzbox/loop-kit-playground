# Admin Management System — Design Plan

> Issue: #7 — 构建当前主流技术栈的中后台管理系统
> Priority: P0-critical
> Status: Round 1 — Design Only

## Problem

Build a complete, modern admin management system (中后台管理系统) using the current mainstream tech stack, providing a fully functional foundation for internal tooling and data management.

## Tech Stack (from issue requirements)

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Build | Vite | 7 |
| Framework | React | 19 |
| Type System | TypeScript | 5.9 |
| Styling | Tailwind CSS | 4 |
| UI Components | shadcn/ui (Base UI) | latest |
| Routing | TanStack Router | latest |
| State Management | Zustand | latest |
| Data Fetching | TanStack Query + Axios | latest |
| Forms | React Hook Form + Zod | latest |
| i18n | i18next | latest |
| Linting | Biome | latest |

## Architecture

```
admin/
├── public/                    # Static assets
├── src/
│   ├── components/            # Shared UI components (shadcn/ui based)
│   │   ├── ui/                # shadcn/ui primitives (Button, Input, etc.)
│   │   └── layout/            # App shell: Sidebar, Header, Breadcrumb
│   ├── features/              # Feature modules (domain-driven)
│   │   ├── dashboard/         # Overview dashboard
│   │   ├── users/             # User management CRUD
│   │   └── settings/          # System settings
│   ├── hooks/                 # Custom hooks (useAuth, useTheme, etc.)
│   ├── lib/                   # Utilities (axios instance, query client, cn())
│   ├── locales/               # i18n translations (zh-CN, en-US)
│   ├── routes/                # TanStack Router route definitions
│   ├── stores/                # Zustand stores (auth, theme, sidebar)
│   ├── types/                 # Shared TypeScript types
│   ├── App.tsx                # Root component with providers
│   └── main.tsx               # Entry point
├── biome.json                 # Biome config
├── index.html                 # HTML entry
├── package.json
├── tailwind.config.ts         # Tailwind CSS 4 config
├── tsconfig.json
└── vite.config.ts
```

## Core Features

### 1. App Shell & Layout
- Collapsible sidebar with navigation
- Top header with user avatar, theme toggle, language switcher
- Breadcrumb navigation
- Responsive design (mobile-friendly sidebar drawer)

### 2. Authentication
- Login page with React Hook Form + Zod validation
- Token-based auth flow (mock API for demo)
- Route guards via TanStack Router beforeLoad
- Auth state in Zustand store, persisted to localStorage

### 3. Dashboard
- Stats cards (users, revenue, orders, conversion)
- Activity feed / recent items
- Quick action shortcuts

### 4. User Management (CRUD demo)
- Data table with search, filter, sort, pagination (TanStack Query)
- Create/Edit forms (React Hook Form + Zod)
- Delete confirmation dialog
- Role-based access indicators

### 5. Settings
- Profile settings form
- System preferences (theme, language, notifications)

### 6. i18n
- zh-CN (default) and en-US support
- Language switcher in header
- All UI text externalized to locale files

### 7. Theme
- Light/dark mode toggle
- System preference detection
- Persisted to localStorage

## Sub-tasks (implementation order)

- [x] 1. **Project scaffold** — `npx create-vite`, install all dependencies, configure Vite/TS/Biome/Tailwind (PR #11)
- [x] 2. **shadcn/ui setup** — initialize shadcn/ui, install base components (PR #12)
- [x] 3. **App shell** — layout components (Sidebar, Header, Breadcrumb) (PR #13)
- [x] 4. **Routing** — TanStack Router setup, route tree, layout routes (PR #14)
- [x] 5. **Auth flow** — Zustand auth store, login page, route guards (PR #15)
- [x] 6. **i18n** — i18next setup, locale files, language switcher (PR #16)
- [x] 7. **Theme** — dark/light mode, system detection, persistence (PR #17)
- [x] 8. **Dashboard page** — stats cards, charts, activity feed
- [ ] 9. **User management** — CRUD pages with TanStack Query, forms, data table
- [ ] 10. **Settings page** — profile and system preferences
- [ ] 11. **Polish** — animations, loading states, error boundaries, responsive fixes

## Dependencies on Existing Project

> [!IMPORTANT]
> This admin system will be a **separate application** within the repo, housed in an `admin/` directory.
> The existing `src/`, `test/`, and `landing/` directories remain untouched.
> `AGENTS.md` will need updating to add the admin component.

## Verification Plan

- `npm run dev` — confirm dev server starts without errors
- `npm run build` — confirm production build succeeds
- `npx biome check .` — confirm no lint errors
- Manual browser verification of all pages and features
- Responsive layout verification at mobile/tablet/desktop
