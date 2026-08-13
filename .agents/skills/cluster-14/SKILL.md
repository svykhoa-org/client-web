---
name: cluster-14
description: 'Skill for the Cluster_14 area of svykhoa-client. 6 symbols across 3 files.'
---

# Cluster_14

6 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how cn work
- Modifying cluster_14-related functionality

## Key Files

| File                                          | Symbols                                           |
| --------------------------------------------- | ------------------------------------------------- |
| `src/components/common/Header/src/Header.tsx` | HeaderNavMenu, HeaderUserMenu, HeaderLogo, Header |
| `src/lib/utils.ts`                            | cn                                                |
| `src/components/ui/Card/src/Card.tsx`         | Card                                              |

## Entry Points

Start here when exploring this area:

- **`cn`** (Function) — `src/lib/utils.ts:3`

## Key Symbols

| Symbol           | Type     | File                                          | Line |
| ---------------- | -------- | --------------------------------------------- | ---- |
| `cn`             | Function | `src/lib/utils.ts`                            | 3    |
| `Card`           | Function | `src/components/ui/Card/src/Card.tsx`         | 7    |
| `HeaderNavMenu`  | Function | `src/components/common/Header/src/Header.tsx` | 33   |
| `HeaderUserMenu` | Function | `src/components/common/Header/src/Header.tsx` | 107  |
| `HeaderLogo`     | Function | `src/components/common/Header/src/Header.tsx` | 226  |
| `Header`         | Function | `src/components/common/Header/src/Header.tsx` | 248  |

## How to Explore

1. `gitnexus_context({name: "cn"})` — see callers and callees
2. `gitnexus_query({query: "cluster_14"})` — find related execution flows
3. Read key files listed above for implementation details
