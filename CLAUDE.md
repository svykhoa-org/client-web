# svykhoa-client AI Configuration Guide

Core configuration ruleset for Claude operating in the `svykhoa-client` (end-user frontend) project.
This is the app-specific canon; the workspace-level "how to think / how to build" doctrine lives one
level up in the `production/` runner and is loaded from its `CLAUDE.md`. Dev server runs at `:5173`.

## Core Tech Stack

- **Framework & Build**: React 19, Vite, TypeScript.
- **Routing**: `react-router` v7.
- **Styling**: Tailwind CSS v4, **Ant Design `antd` v5** (with `@ant-design/v5-patch-for-react-19`).
- **Data fetching**: **TanStack Query** (`@tanstack/react-query`) over `axios`. Query client in
  `src/lib/tanstack-query/`, axios instance in `src/lib/axios/`.
- **State**: `zustand` (`src/stores/`) for client state; server state stays in TanStack Query.
- **Forms**: `react-hook-form` + `zod` (`@hookform/resolvers`).
- **i18n**: `i18next` (`src/i18n/locales/`). **Media**: `react-pdf` (PdfViewer), `@vidstack/react` /
  `media-chrome` / `react-player` (VideoPlayer). **Rich text**: `react-quill-new`, `react-markdown`.

## Global Design Rules

- Newly generated interactive UI elements MUST use an 8px border radius (`rounded-lg`).
- Avoid heavy drop shadows — default to soft, ambient shadows (`shadow-sm`).
- Do NOT use hardcoded hex or arbitrary Tailwind colors (e.g. `bg-blue-500`). Use only the global CSS
  variables defined in Tailwind config / index.css (`text-primary`, `bg-background`, `border-border`, …).

## Code Structure & Architecture

- **Pages**: split by auth context — `src/pages/authentication/`, `src/pages/unauthentication/`,
  `src/pages/public/`.
- **Services**: one folder per domain under `src/services/` (`Course/`, `Order/`, `post/`, `auth/`,
  `comment/`, `enrollment/`, …), each wrapping the shared `axios` instance. New API call → add a
  function beside the nearest domain service; never call `axios`/`fetch` ad-hoc from a component.
- **Data fetching**: wrap service calls in TanStack Query hooks (`useQuery`/`useMutation`); shared
  hooks live in `src/hooks/` (`useCRUD`, `useDebounce`, `request/`). Don't hold server data in
  `zustand` — that's TanStack Query's job.
- **State**: minimal `zustand` slices in `src/stores/`; cross-cutting context in `src/contexts/`
  (`auth`, `layout`, `theme`).
- **Components**: `src/components/` grouped by domain (`post`, `auth`, `payment`, `user`, `common`,
  `ui`, `PdfViewer`, `VideoPlayer`). Layouts in `src/layouts/`, routes in `src/routes/`, models/types
  in `src/models/` + `src/shared/` + `src/types/`.
- **Typing**: follow `eslint.config.*` + `.prettierrc`; enforce `import type` for type imports.

## Behavioral guidelines

- **Think before coding.** State assumptions; surface multiple interpretations; prefer the simpler
  approach and say so.
- **Simplicity first.** Minimum code; no speculative abstraction or unrequested flexibility.
- **Surgical changes.** Touch only what the request needs; match existing style; don't refactor
  working code the change doesn't require.
- **Cross-project awareness.** When the API contract changes on `svykhoa-server`, update the matching
  service + model/type here to stay in sync (see the workspace runner's doctrine).
- **Verify.** Exercise the path in the running app (`:5173`), not just typecheck.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **svykhoa-client** (2791 symbols, 4374 relationships, 109 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/svykhoa-client/context` | Codebase overview, check index freshness |
| `gitnexus://repo/svykhoa-client/clusters` | All functional areas |
| `gitnexus://repo/svykhoa-client/processes` | All execution flows |
| `gitnexus://repo/svykhoa-client/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
