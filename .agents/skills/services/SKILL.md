---
name: services
description: 'Skill for the Services area of svykhoa-client. 9 symbols across 3 files.'
---

# Services

9 symbols | 3 files | Cohesion: 89%

## When to Use

- Working with code in `src/`
- Understanding how handleSearchChange, handleClearFilters, createApiClient work
- Modifying services-related functionality

## Key Files

| File                                                         | Symbols                                                |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| `src/services/httpClient.ts`                                 | put, delete, handleError, HttpClient, constructor (+1) |
| `src/pages/authentication/ResourcePage/ListResourcePage.tsx` | handleSearchChange, handleClearFilters                 |
| `src/services/apiClient.ts`                                  | createApiClient                                        |

## Entry Points

Start here when exploring this area:

- **`handleSearchChange`** (Function) — `src/pages/authentication/ResourcePage/ListResourcePage.tsx:123`
- **`handleClearFilters`** (Function) — `src/pages/authentication/ResourcePage/ListResourcePage.tsx:136`
- **`createApiClient`** (Function) — `src/services/apiClient.ts:8`

## Key Symbols

| Symbol               | Type     | File                                                         | Line |
| -------------------- | -------- | ------------------------------------------------------------ | ---- |
| `handleSearchChange` | Function | `src/pages/authentication/ResourcePage/ListResourcePage.tsx` | 123  |
| `handleClearFilters` | Function | `src/pages/authentication/ResourcePage/ListResourcePage.tsx` | 136  |
| `createApiClient`    | Function | `src/services/apiClient.ts`                                  | 8    |
| `HttpClient`         | Class    | `src/services/httpClient.ts`                                 | 6    |
| `put`                | Method   | `src/services/httpClient.ts`                                 | 99   |
| `delete`             | Method   | `src/services/httpClient.ts`                                 | 108  |
| `handleError`        | Method   | `src/services/httpClient.ts`                                 | 117  |
| `constructor`        | Method   | `src/services/httpClient.ts`                                 | 9    |
| `setupInterceptors`  | Method   | `src/services/httpClient.ts`                                 | 23   |

## Execution Flows

| Flow                               | Type            | Steps |
| ---------------------------------- | --------------- | ----- |
| `DocumentListPage → HandleError`   | cross_community | 3     |
| `ForumPage → HandleError`          | cross_community | 3     |
| `ListResourcePage → HandleError`   | cross_community | 3     |
| `MedicalSearchPage → HandleError`  | cross_community | 3     |
| `PaymentResultPage → HandleError`  | cross_community | 3     |
| `HandleSearchChange → HandleError` | intra_community | 3     |
| `HandleClearFilters → HandleError` | intra_community | 3     |
| `ResourceListPage → HandleError`   | cross_community | 3     |
| `LoginPage → HandleError`          | cross_community | 3     |
| `PostsPage → HandleError`          | cross_community | 3     |

## How to Explore

1. `gitnexus_context({name: "handleSearchChange"})` — see callers and callees
2. `gitnexus_query({query: "services"})` — find related execution flows
3. Read key files listed above for implementation details
