# Plan: Admin Dashboard / 中后台管理系统

## Problem / 问题

构建一个完整的中后台管理系统，使用当前主流技术栈。需要完整的功能体系，包括认证、路由、数据管理、国际化等。

Tech stack specified by issue:
- Build: Vite 7
- Framework: React 19
- Types: TypeScript 5.9
- Styling: Tailwind CSS 4
- UI: shadcn/ui (Base UI)
- Routing: TanStack Router
- State: Zustand
- Data: TanStack Query + Axios
- Forms: React Hook Form + Zod
- i18n: i18next
- Linting: Biome

## Proposed Approach / 方案

Use `create-vite` to scaffold, then layer in each dependency. File-based routing with TanStack Router. Zustand for global state (auth, theme, sidebar). TanStack Query for server state. shadcn/ui for consistent component library.

## Sub-tasks / 子任务
> Implementation order. Each becomes a separate PR.
> 实现顺序。每个子任务将成为一个独立的 PR。

- [x] 1. Project scaffolding — Vite 7 + React 19 + TypeScript 5.9 + Biome setup (PR #11)
- [ ] 2. Tailwind CSS 4 + shadcn/ui integration — theme system, dark mode
- [ ] 3. TanStack Router — file-based routing, layout system, auth guards
- [ ] 4. Authentication module — login page, Zustand auth store, token management
- [ ] 5. Dashboard layout — sidebar, header, breadcrumbs, responsive design
- [ ] 6. TanStack Query + Axios — API client, interceptors, error handling
- [ ] 7. CRUD module template — list/create/edit/detail pages with React Hook Form + Zod
- [ ] 8. i18next integration — zh-CN/en-US, language switcher
- [ ] 9. Polish — loading states, error boundaries, 404 page, production build optimization

## Dependencies / 依赖

- Sub-task 2 depends on 1
- Sub-tasks 3-5 depend on 2
- Sub-task 6 depends on 3
- Sub-task 7 depends on 5 + 6
- Sub-task 8 can be done in parallel with 6-7
- Sub-task 9 depends on all others

## Open Questions / 待确认

- API base URL and mock server strategy (MSW vs JSON Server?)
- Auth flow: JWT vs session-based?
- Target deployment platform (Vercel, Docker, etc.)?
