---
name: documentclassify
description: 'Skill for the DocumentClassify area of svykhoa-client. 5 symbols across 4 files.'
---

# DocumentClassify

5 symbols | 4 files | Cohesion: 91%

## When to Use

- Working with code in `src/`
- Understanding how buildQuery, unwrapList, listDocumentClassify work
- Modifying documentclassify-related functionality

## Key Files

| File                                    | Symbols                      |
| --------------------------------------- | ---------------------------- |
| `src/utils/apiResponse.ts`              | ApiResponseError, unwrapList |
| `src/utils/buildQuery.ts`               | buildQuery                   |
| `src/services/DocumentClassify/list.ts` | listDocumentClassify         |
| `src/services/Document/list.ts`         | listDocument                 |

## Entry Points

Start here when exploring this area:

- **`buildQuery`** (Function) — `src/utils/buildQuery.ts:85`
- **`unwrapList`** (Function) — `src/utils/apiResponse.ts:35`
- **`listDocumentClassify`** (Function) — `src/services/DocumentClassify/list.ts:18`
- **`listDocument`** (Function) — `src/services/Document/list.ts:14`
- **`ApiResponseError`** (Class) — `src/utils/apiResponse.ts:6`

## Key Symbols

| Symbol                 | Type     | File                                    | Line |
| ---------------------- | -------- | --------------------------------------- | ---- |
| `ApiResponseError`     | Class    | `src/utils/apiResponse.ts`              | 6    |
| `buildQuery`           | Function | `src/utils/buildQuery.ts`               | 85   |
| `unwrapList`           | Function | `src/utils/apiResponse.ts`              | 35   |
| `listDocumentClassify` | Function | `src/services/DocumentClassify/list.ts` | 18   |
| `listDocument`         | Function | `src/services/Document/list.ts`         | 14   |

## Execution Flows

| Flow                                             | Type            | Steps |
| ------------------------------------------------ | --------------- | ----- |
| `RenderPurchasedDocumentCard → ApiResponseError` | cross_community | 5     |
| `DocumentDetailPage → ApiResponseError`          | cross_community | 4     |
| `ListDocumentClassify → ApiResponseError`        | intra_community | 3     |
| `ListDocument → ApiResponseError`                | intra_community | 3     |
| `Register → ApiResponseError`                    | cross_community | 3     |
| `Logout → ApiResponseError`                      | cross_community | 3     |
| `Login → ApiResponseError`                       | cross_community | 3     |
| `ListMyDocuments → ApiResponseError`             | cross_community | 3     |
| `CheckoutDocumentOrder → ApiResponseError`       | cross_community | 3     |

## How to Explore

1. `gitnexus_context({name: "buildQuery"})` — see callers and callees
2. `gitnexus_query({query: "documentclassify"})` — find related execution flows
3. Read key files listed above for implementation details
