---
name: forumpage
description: 'Skill for the ForumPage area of svykhoa-client. 5 symbols across 4 files.'
---

# ForumPage

5 symbols | 4 files | Cohesion: 67%

## When to Use

- Working with code in `src/`
- Understanding how useDebounceValue, getFeaturedResources, ForumPage work
- Modifying forumpage-related functionality

## Key Files

| File                                                     | Symbols                 |
| -------------------------------------------------------- | ----------------------- |
| `src/pages/unauthentication/ForumPage/index.tsx`         | ForumPage, getPageTitle |
| `src/hooks/useDebounce.ts`                               | useDebounceValue        |
| `src/services/resource/resourceService.ts`               | getFeaturedResources    |
| `src/pages/unauthentication/PostsPage/src/PostsPage.tsx` | PostsPage               |

## Entry Points

Start here when exploring this area:

- **`useDebounceValue`** (Function) — `src/hooks/useDebounce.ts:2`
- **`getFeaturedResources`** (Function) — `src/services/resource/resourceService.ts:87`
- **`ForumPage`** (Function) — `src/pages/unauthentication/ForumPage/index.tsx:23`
- **`getPageTitle`** (Function) — `src/pages/unauthentication/ForumPage/index.tsx:230`

## Key Symbols

| Symbol                 | Type     | File                                                     | Line |
| ---------------------- | -------- | -------------------------------------------------------- | ---- |
| `useDebounceValue`     | Function | `src/hooks/useDebounce.ts`                               | 2    |
| `getFeaturedResources` | Function | `src/services/resource/resourceService.ts`               | 87   |
| `ForumPage`            | Function | `src/pages/unauthentication/ForumPage/index.tsx`         | 23   |
| `getPageTitle`         | Function | `src/pages/unauthentication/ForumPage/index.tsx`         | 230  |
| `PostsPage`            | Function | `src/pages/unauthentication/PostsPage/src/PostsPage.tsx` | 20   |

## Execution Flows

| Flow                      | Type            | Steps |
| ------------------------- | --------------- | ----- |
| `ForumPage → HandleError` | cross_community | 3     |
| `PostsPage → HandleError` | cross_community | 3     |

## Connected Areas

| Area              | Connections |
| ----------------- | ----------- |
| ResourcePage      | 2 calls     |
| MedicalSearchPage | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "useDebounceValue"})` — see callers and callees
2. `gitnexus_query({query: "forumpage"})` — find related execution flows
3. Read key files listed above for implementation details
