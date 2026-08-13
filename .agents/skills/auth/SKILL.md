---
name: auth
description: 'Skill for the Auth area of svykhoa-client. 6 symbols across 6 files.'
---

# Auth

6 symbols | 6 files | Cohesion: 77%

## When to Use

- Working with code in `src/`
- Understanding how unwrapDetail, register, logout work
- Modifying auth-related functionality

## Key Files

| File                                   | Symbols               |
| -------------------------------------- | --------------------- |
| `src/utils/apiResponse.ts`             | unwrapDetail          |
| `src/services/auth/register.ts`        | register              |
| `src/services/auth/logout.ts`          | logout                |
| `src/services/auth/login.ts`           | login                 |
| `src/services/Document/myDocuments.ts` | listMyDocuments       |
| `src/services/Document/checkout.ts`    | checkoutDocumentOrder |

## Entry Points

Start here when exploring this area:

- **`unwrapDetail`** (Function) — `src/utils/apiResponse.ts:24`
- **`register`** (Function) — `src/services/auth/register.ts:8`
- **`logout`** (Function) — `src/services/auth/logout.ts:6`
- **`login`** (Function) — `src/services/auth/login.ts:8`
- **`listMyDocuments`** (Function) — `src/services/Document/myDocuments.ts:16`

## Key Symbols

| Symbol                  | Type     | File                                   | Line |
| ----------------------- | -------- | -------------------------------------- | ---- |
| `unwrapDetail`          | Function | `src/utils/apiResponse.ts`             | 24   |
| `register`              | Function | `src/services/auth/register.ts`        | 8    |
| `logout`                | Function | `src/services/auth/logout.ts`          | 6    |
| `login`                 | Function | `src/services/auth/login.ts`           | 8    |
| `listMyDocuments`       | Function | `src/services/Document/myDocuments.ts` | 16   |
| `checkoutDocumentOrder` | Function | `src/services/Document/checkout.ts`    | 28   |

## Execution Flows

| Flow                                             | Type            | Steps |
| ------------------------------------------------ | --------------- | ----- |
| `RenderPurchasedDocumentCard → ApiResponseError` | cross_community | 5     |
| `DocumentDetailPage → ApiResponseError`          | cross_community | 4     |
| `Register → ApiResponseError`                    | cross_community | 3     |
| `Logout → ApiResponseError`                      | cross_community | 3     |
| `Login → ApiResponseError`                       | cross_community | 3     |
| `ListMyDocuments → ApiResponseError`             | cross_community | 3     |
| `CheckoutDocumentOrder → ApiResponseError`       | cross_community | 3     |

## Connected Areas

| Area             | Connections |
| ---------------- | ----------- |
| DocumentClassify | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "unwrapDetail"})` — see callers and callees
2. `gitnexus_query({query: "auth"})` — find related execution flows
3. Read key files listed above for implementation details
