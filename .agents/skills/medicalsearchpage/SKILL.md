---
name: medicalsearchpage
description: 'Skill for the MedicalSearchPage area of svykhoa-client. 8 symbols across 4 files.'
---

# MedicalSearchPage

8 symbols | 4 files | Cohesion: 88%

## When to Use

- Working with code in `src/`
- Understanding how setSearchQuery, MedicalSearchPage, renderContent work
- Modifying medicalsearchpage-related functionality

## Key Files

| File                                                               | Symbols                                                                |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `src/pages/authentication/MedicalSearchPage/index.tsx`             | MedicalSearchPage, performSearch, getSpecialtyIcon, getConfidenceColor |
| `src/pages/authentication/MedicalSearchPage/MedicalSearchPage.tsx` | MedicalSearchPage, renderContent                                       |
| `src/pages/unauthentication/PostsPage/src/PostsPage.tsx`           | handleSearch                                                           |
| `src/pages/authentication/MedicalSearchPage/hooks/useSearching.ts` | setSearchQuery                                                         |

## Entry Points

Start here when exploring this area:

- **`setSearchQuery`** (Function) — `src/pages/authentication/MedicalSearchPage/hooks/useSearching.ts:51`
- **`MedicalSearchPage`** (Function) — `src/pages/authentication/MedicalSearchPage/MedicalSearchPage.tsx:11`
- **`renderContent`** (Function) — `src/pages/authentication/MedicalSearchPage/MedicalSearchPage.tsx:23`

## Key Symbols

| Symbol               | Type     | File                                                               | Line |
| -------------------- | -------- | ------------------------------------------------------------------ | ---- |
| `setSearchQuery`     | Function | `src/pages/authentication/MedicalSearchPage/hooks/useSearching.ts` | 51   |
| `MedicalSearchPage`  | Function | `src/pages/authentication/MedicalSearchPage/MedicalSearchPage.tsx` | 11   |
| `renderContent`      | Function | `src/pages/authentication/MedicalSearchPage/MedicalSearchPage.tsx` | 23   |
| `MedicalSearchPage`  | Function | `src/pages/authentication/MedicalSearchPage/index.tsx`             | 64   |
| `performSearch`      | Function | `src/pages/authentication/MedicalSearchPage/index.tsx`             | 87   |
| `getSpecialtyIcon`   | Function | `src/pages/authentication/MedicalSearchPage/index.tsx`             | 199  |
| `getConfidenceColor` | Function | `src/pages/authentication/MedicalSearchPage/index.tsx`             | 210  |
| `handleSearch`       | Function | `src/pages/unauthentication/PostsPage/src/PostsPage.tsx`           | 98   |

## Execution Flows

| Flow                              | Type            | Steps |
| --------------------------------- | --------------- | ----- |
| `MedicalSearchPage → HandleError` | cross_community | 3     |

## Connected Areas

| Area         | Connections |
| ------------ | ----------- |
| ResourcePage | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "setSearchQuery"})` — see callers and callees
2. `gitnexus_query({query: "medicalsearchpage"})` — find related execution flows
3. Read key files listed above for implementation details
