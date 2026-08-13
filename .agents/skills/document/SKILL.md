---
name: document
description: 'Skill for the Document area of svykhoa-client. 5 symbols across 2 files.'
---

# Document

5 symbols | 2 files | Cohesion: 89%

## When to Use

- Working with code in `src/`
- Understanding how getDocumentDownloadUrl work
- Modifying document-related functionality

## Key Files

| File                                                       | Symbols                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `src/pages/authentication/ProfilePage/src/ProfilePage.tsx` | formatDateTime, handleDownloadDocument, renderPurchasedDocumentCard |
| `src/services/Document/download.ts`                        | buildDownloadUrl, getDocumentDownloadUrl                            |

## Entry Points

Start here when exploring this area:

- **`getDocumentDownloadUrl`** (Function) — `src/services/Document/download.ts:29`

## Key Symbols

| Symbol                        | Type     | File                                                       | Line |
| ----------------------------- | -------- | ---------------------------------------------------------- | ---- |
| `getDocumentDownloadUrl`      | Function | `src/services/Document/download.ts`                        | 29   |
| `buildDownloadUrl`            | Function | `src/services/Document/download.ts`                        | 19   |
| `formatDateTime`              | Function | `src/pages/authentication/ProfilePage/src/ProfilePage.tsx` | 45   |
| `handleDownloadDocument`      | Function | `src/pages/authentication/ProfilePage/src/ProfilePage.tsx` | 124  |
| `renderPurchasedDocumentCard` | Function | `src/pages/authentication/ProfilePage/src/ProfilePage.tsx` | 144  |

## Execution Flows

| Flow                                             | Type            | Steps |
| ------------------------------------------------ | --------------- | ----- |
| `RenderPurchasedDocumentCard → ApiResponseError` | cross_community | 5     |
| `RenderPurchasedDocumentCard → BuildDownloadUrl` | intra_community | 4     |

## Connected Areas

| Area | Connections |
| ---- | ----------- |
| Auth | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "getDocumentDownloadUrl"})` — see callers and callees
2. `gitnexus_query({query: "document"})` — find related execution flows
3. Read key files listed above for implementation details
