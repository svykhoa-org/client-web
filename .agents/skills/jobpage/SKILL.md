---
name: jobpage
description: 'Skill for the JobPage area of svykhoa-client. 3 symbols across 2 files.'
---

# JobPage

3 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how handleGetDetail, JobDetailPage, formatSalary work
- Modifying jobpage-related functionality

## Key Files

| File                                                   | Symbols                     |
| ------------------------------------------------------ | --------------------------- |
| `src/pages/unauthentication/JobPage/JobDetailPage.tsx` | JobDetailPage, formatSalary |
| `src/hooks/useCRUD/useDetail.ts`                       | handleGetDetail             |

## Entry Points

Start here when exploring this area:

- **`handleGetDetail`** (Function) — `src/hooks/useCRUD/useDetail.ts:21`
- **`JobDetailPage`** (Function) — `src/pages/unauthentication/JobPage/JobDetailPage.tsx:23`
- **`formatSalary`** (Function) — `src/pages/unauthentication/JobPage/JobDetailPage.tsx:59`

## Key Symbols

| Symbol            | Type     | File                                                   | Line |
| ----------------- | -------- | ------------------------------------------------------ | ---- |
| `handleGetDetail` | Function | `src/hooks/useCRUD/useDetail.ts`                       | 21   |
| `JobDetailPage`   | Function | `src/pages/unauthentication/JobPage/JobDetailPage.tsx` | 23   |
| `formatSalary`    | Function | `src/pages/unauthentication/JobPage/JobDetailPage.tsx` | 59   |

## How to Explore

1. `gitnexus_context({name: "handleGetDetail"})` — see callers and callees
2. `gitnexus_query({query: "jobpage"})` — find related execution flows
3. Read key files listed above for implementation details
