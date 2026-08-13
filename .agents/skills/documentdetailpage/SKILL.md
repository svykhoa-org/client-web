---
name: documentdetailpage
description: 'Skill for the DocumentDetailPage area of svykhoa-client. 5 symbols across 3 files.'
---

# DocumentDetailPage

5 symbols | 3 files | Cohesion: 73%

## When to Use

- Working with code in `src/`
- Understanding how getDocumentDetail, useDetail, DocumentDetailPage work
- Modifying documentdetailpage-related functionality

## Key Files

| File                                                         | Symbols                                               |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| `src/pages/public/DocumentDetailPage/DocumentDetailPage.tsx` | resolveFileUrl, resolvePreviewUrl, DocumentDetailPage |
| `src/services/Document/detail.ts`                            | getDocumentDetail                                     |
| `src/hooks/request/useDetail.ts`                             | useDetail                                             |

## Entry Points

Start here when exploring this area:

- **`getDocumentDetail`** (Function) — `src/services/Document/detail.ts:13`
- **`useDetail`** (Function) — `src/hooks/request/useDetail.ts:16`
- **`DocumentDetailPage`** (Function) — `src/pages/public/DocumentDetailPage/DocumentDetailPage.tsx:47`

## Key Symbols

| Symbol               | Type     | File                                                         | Line |
| -------------------- | -------- | ------------------------------------------------------------ | ---- |
| `getDocumentDetail`  | Function | `src/services/Document/detail.ts`                            | 13   |
| `useDetail`          | Function | `src/hooks/request/useDetail.ts`                             | 16   |
| `DocumentDetailPage` | Function | `src/pages/public/DocumentDetailPage/DocumentDetailPage.tsx` | 47   |
| `resolveFileUrl`     | Function | `src/pages/public/DocumentDetailPage/DocumentDetailPage.tsx` | 27   |
| `resolvePreviewUrl`  | Function | `src/pages/public/DocumentDetailPage/DocumentDetailPage.tsx` | 37   |

## Execution Flows

| Flow                                    | Type            | Steps |
| --------------------------------------- | --------------- | ----- |
| `DocumentDetailPage → ApiResponseError` | cross_community | 4     |
| `DocumentDetailPage → UseRequest`       | cross_community | 3     |

## Connected Areas

| Area    | Connections |
| ------- | ----------- |
| Request | 2 calls     |
| Auth    | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "getDocumentDetail"})` — see callers and callees
2. `gitnexus_query({query: "documentdetailpage"})` — find related execution flows
3. Read key files listed above for implementation details
