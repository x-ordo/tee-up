# Repository Guidelines

## Project Structure & Module Organization
- `web/`: Next.js 14 frontend. `src/app` for routes, `src/components` shared UI, `src/lib` utilities, `__tests__` unit/RTL, `e2e/` Playwright. Tailwind/PostCSS configs at package root.
- `api/`: Express + TypeScript. Place handlers in `src/routes`, business logic in `src/services`, cross-cutting code in `src/middleware`. Jest config at root.
- `docs/`: Canonical references (`CONTEXT.md`, `ENVIRONMENT.md`, specs in `docs/specs`, guides in `docs/guides`). Ops artifacts live in `supabase/`, `scripts/`, `infra/`.

## Build, Test, and Development Commands
- Frontend (`cd web`): `npm run dev` (http://localhost:3000), `npm run build` + `npm start` (prod), `npm run lint` (ESLint), `npm run test` / `test:watch` / `test:coverage` (Jest + RTL), `npm run type-check` (TS no-emit).
- Backend (`cd api`): `npm run dev` (nodemon + ts-node at http://localhost:5000), `npm run build` + `npm start`, `npm run lint` or `lint:fix`, `npm run test` / `test:coverage` (Jest + Supertest), `npm run type-check`.

## Coding Style & Naming Conventions
- TypeScript strict; avoid `any`; exported functions should declare return types.
- Naming: components `PascalCase.tsx`; utilities/hooks `camelCase.ts`; files match default exports.
- Lint before PRs (`npm run lint` in each package). Tailwind: use provided design tokens/variables; avoid hardcoded colors. Keep feature code colocated under its route folder.

## Testing Guidelines
- Unit/UI tests beside code or in `__tests__`; name `*.test.ts[x]`.
- API integration: use Supertest, mock externals.
- Run `npm run test:coverage` in each package; add regression tests for fixes.
- Cross-stack flows: use Playwright specs in `web/e2e` (`npx playwright test` if needed).

## Commit & Pull Request Guidelines
- Conventional Commits (`feat|fix|docs|chore|refactor|test(scope): subject`); breaking changes via `!` or `BREAKING CHANGE` footer. Branches: `feature/*`, `bugfix/*`, `release/*`, `hotfix/*` per `VERSIONING_GUIDE.md`.
- PRs: describe scope, link issues, call out migrations/env changes; add UI screenshots or API examples when relevant.
- Pre-PR checklist (both packages): lint, tests, build, type-check; ensure `.env` files come from templates and secrets stay local.
