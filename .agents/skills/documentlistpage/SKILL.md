---
name: documentlistpage
description: 'Skill for the DocumentListPage area of svykhoa-client. 7 symbols across 4 files.'
---

# DocumentListPage

7 symbols | 4 files | Cohesion: 86%

## When to Use

- Working with code in `src/`
- Understanding how useList, useInfiniteList, DocumentListPage work
- Modifying documentlistpage-related functionality

## Key Files

| File                                                          | Symbols                                           |
| ------------------------------------------------------------- | ------------------------------------------------- |
| `src/pages/public/DocumentListPage/DocumentListPage.tsx`      | DocumentListPage, sortNodes, traverse, collectIds |
| `src/hooks/request/useList.ts`                                | useList                                           |
| `src/hooks/request/useInfiniteList.ts`                        | useInfiniteList                                   |
| `src/components/ui/SelectVariants/DocumentClassifySelect.tsx` | DocumentClassifySelect                            |

## Entry Points

Start here when exploring this area:

- **`useList`** (Function) — `src/hooks/request/useList.ts:44`
- **`useInfiniteList`** (Function) — `src/hooks/request/useInfiniteList.ts:32`
- **`DocumentListPage`** (Function) — `src/pages/public/DocumentListPage/DocumentListPage.tsx:43`
- **`sortNodes`** (Function) — `src/pages/public/DocumentListPage/DocumentListPage.tsx:102`
- **`traverse`** (Function) — `src/pages/public/DocumentListPage/DocumentListPage.tsx:114`

## Key Symbols

| Symbol                   | Type     | File                                                          | Line |
| ------------------------ | -------- | ------------------------------------------------------------- | ---- |
| `useList`                | Function | `src/hooks/request/useList.ts`                                | 44   |
| `useInfiniteList`        | Function | `src/hooks/request/useInfiniteList.ts`                        | 32   |
| `DocumentListPage`       | Function | `src/pages/public/DocumentListPage/DocumentListPage.tsx`      | 43   |
| `sortNodes`              | Function | `src/pages/public/DocumentListPage/DocumentListPage.tsx`      | 102  |
| `traverse`               | Function | `src/pages/public/DocumentListPage/DocumentListPage.tsx`      | 114  |
| `collectIds`             | Function | `src/pages/public/DocumentListPage/DocumentListPage.tsx`      | 212  |
| `DocumentClassifySelect` | Function | `src/components/ui/SelectVariants/DocumentClassifySelect.tsx` | 21   |

## Execution Flows

| Flow                             | Type            | Steps |
| -------------------------------- | --------------- | ----- |
| `DocumentListPage → HandleError` | cross_community | 3     |

## Connected Areas

| Area         | Connections |
| ------------ | ----------- |
| ForumPage    | 1 calls     |
| ResourcePage | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "useList"})` — see callers and callees
2. `gitnexus_query({query: "documentlistpage"})` — find related execution flows
3. Read key files listed above for implementation details
