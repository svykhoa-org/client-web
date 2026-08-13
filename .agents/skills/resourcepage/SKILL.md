---
name: resourcepage
description: 'Skill for the ResourcePage area of svykhoa-client. 17 symbols across 9 files.'
---

# ResourcePage

17 symbols | 9 files | Cohesion: 87%

## When to Use

- Working with code in `src/`
- Understanding how buildCommentTree, sortComments, LoginPage work
- Modifying resourcepage-related functionality

## Key Files

| File                                                                   | Symbols                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/pages/authentication/ResourcePage/DetailResourcePage.tsx`         | DetailResourcePage, formatPrice, formatFileSize, handleShare |
| `src/pages/unauthentication/ResourceListPage/src/ResourceListPage.tsx` | ResourceListPage, handleCategoryChange, handlePageChange     |
| `src/utils/commentTree.ts`                                             | buildCommentTree, sortComments                               |
| `src/pages/authentication/ResourcePage/ListResourcePage.tsx`           | ListResourcePage, renderFilterPanel                          |
| `src/pages/authentication/PaymentTestPage/PaymentResultPage.tsx`       | PaymentResultPage, getResultConfig                           |
| `src/services/httpClient.ts`                                           | get                                                          |
| `src/hooks/useDebounce/index.ts`                                       | useDebounce                                                  |
| `src/pages/unauthentication/LoginPage/LoginPage.tsx`                   | LoginPage                                                    |
| `src/pages/unauthentication/RegisterPage/src/RegisterPage.tsx`         | RegisterPage                                                 |

## Entry Points

Start here when exploring this area:

- **`buildCommentTree`** (Function) — `src/utils/commentTree.ts:12`
- **`sortComments`** (Function) — `src/utils/commentTree.ts:48`
- **`LoginPage`** (Function) — `src/pages/unauthentication/LoginPage/LoginPage.tsx:16`
- **`ListResourcePage`** (Function) — `src/pages/authentication/ResourcePage/ListResourcePage.tsx:70`
- **`renderFilterPanel`** (Function) — `src/pages/authentication/ResourcePage/ListResourcePage.tsx:164`

## Key Symbols

| Symbol                 | Type     | File                                                                   | Line |
| ---------------------- | -------- | ---------------------------------------------------------------------- | ---- |
| `buildCommentTree`     | Function | `src/utils/commentTree.ts`                                             | 12   |
| `sortComments`         | Function | `src/utils/commentTree.ts`                                             | 48   |
| `LoginPage`            | Function | `src/pages/unauthentication/LoginPage/LoginPage.tsx`                   | 16   |
| `ListResourcePage`     | Function | `src/pages/authentication/ResourcePage/ListResourcePage.tsx`           | 70   |
| `renderFilterPanel`    | Function | `src/pages/authentication/ResourcePage/ListResourcePage.tsx`           | 164  |
| `PaymentResultPage`    | Function | `src/pages/authentication/PaymentTestPage/PaymentResultPage.tsx`       | 6    |
| `getResultConfig`      | Function | `src/pages/authentication/PaymentTestPage/PaymentResultPage.tsx`       | 21   |
| `DetailResourcePage`   | Function | `src/pages/authentication/ResourcePage/DetailResourcePage.tsx`         | 54   |
| `formatPrice`          | Function | `src/pages/authentication/ResourcePage/DetailResourcePage.tsx`         | 95   |
| `formatFileSize`       | Function | `src/pages/authentication/ResourcePage/DetailResourcePage.tsx`         | 100  |
| `handleShare`          | Function | `src/pages/authentication/ResourcePage/DetailResourcePage.tsx`         | 106  |
| `useDebounce`          | Function | `src/hooks/useDebounce/index.ts`                                       | 10   |
| `ResourceListPage`     | Function | `src/pages/unauthentication/ResourceListPage/src/ResourceListPage.tsx` | 18   |
| `handleCategoryChange` | Function | `src/pages/unauthentication/ResourceListPage/src/ResourceListPage.tsx` | 148  |
| `handlePageChange`     | Function | `src/pages/unauthentication/ResourceListPage/src/ResourceListPage.tsx` | 169  |
| `RegisterPage`         | Function | `src/pages/unauthentication/RegisterPage/src/RegisterPage.tsx`         | 18   |
| `get`                  | Method   | `src/services/httpClient.ts`                                           | 74   |

## Execution Flows

| Flow                              | Type            | Steps |
| --------------------------------- | --------------- | ----- |
| `DocumentListPage → HandleError`  | cross_community | 3     |
| `ForumPage → HandleError`         | cross_community | 3     |
| `ListResourcePage → HandleError`  | cross_community | 3     |
| `MedicalSearchPage → HandleError` | cross_community | 3     |
| `PaymentResultPage → HandleError` | cross_community | 3     |
| `ResourceListPage → HandleError`  | cross_community | 3     |
| `LoginPage → HandleError`         | cross_community | 3     |
| `PostsPage → HandleError`         | cross_community | 3     |
| `BuildCommentTree → HandleError`  | cross_community | 3     |
| `RegisterPage → HandleError`      | cross_community | 3     |

## Connected Areas

| Area     | Connections |
| -------- | ----------- |
| Services | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "buildCommentTree"})` — see callers and callees
2. `gitnexus_query({query: "resourcepage"})` — find related execution flows
3. Read key files listed above for implementation details
