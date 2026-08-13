---
name: request
description: 'Skill for the Request area of svykhoa-client. 5 symbols across 5 files.'
---

# Request

5 symbols | 5 files | Cohesion: 80%

## When to Use

- Working with code in `src/`
- Understanding how useUpdate, useRequest, useDelete work
- Modifying request-related functionality

## Key Files

| File                                                       | Symbols     |
| ---------------------------------------------------------- | ----------- |
| `src/hooks/request/useUpdate.ts`                           | useUpdate   |
| `src/hooks/request/useRequest.ts`                          | useRequest  |
| `src/hooks/request/useDelete.ts`                           | useDelete   |
| `src/hooks/request/useCreate.ts`                           | useCreate   |
| `src/pages/authentication/ProfilePage/src/ProfilePage.tsx` | ProfilePage |

## Entry Points

Start here when exploring this area:

- **`useUpdate`** (Function) — `src/hooks/request/useUpdate.ts:6`
- **`useRequest`** (Function) — `src/hooks/request/useRequest.ts:8`
- **`useDelete`** (Function) — `src/hooks/request/useDelete.ts:15`
- **`useCreate`** (Function) — `src/hooks/request/useCreate.ts:6`

## Key Symbols

| Symbol        | Type     | File                                                       | Line |
| ------------- | -------- | ---------------------------------------------------------- | ---- |
| `useUpdate`   | Function | `src/hooks/request/useUpdate.ts`                           | 6    |
| `useRequest`  | Function | `src/hooks/request/useRequest.ts`                          | 8    |
| `useDelete`   | Function | `src/hooks/request/useDelete.ts`                           | 15   |
| `useCreate`   | Function | `src/hooks/request/useCreate.ts`                           | 6    |
| `ProfilePage` | Function | `src/pages/authentication/ProfilePage/src/ProfilePage.tsx` | 55   |

## Execution Flows

| Flow                              | Type            | Steps |
| --------------------------------- | --------------- | ----- |
| `DocumentDetailPage → UseRequest` | cross_community | 3     |

## How to Explore

1. `gitnexus_context({name: "useUpdate"})` — see callers and callees
2. `gitnexus_query({query: "request"})` — find related execution flows
3. Read key files listed above for implementation details
