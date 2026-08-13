---
name: createpostpage
description: 'Skill for the CreatePostPage area of svykhoa-client. 5 symbols across 2 files.'
---

# CreatePostPage

5 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how FormRegistration work
- Modifying createpostpage-related functionality

## Key Files

| File                                                                 | Symbols                                                        |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| `src/pages/authentication/CreatePostPage/index.tsx`                  | CreatePostPage, fetchCategories, handleRemoveTag, handleSubmit |
| `src/pages/unauthentication/JobPage/components/FormRegistration.tsx` | FormRegistration                                               |

## Entry Points

Start here when exploring this area:

- **`FormRegistration`** (Function) — `src/pages/unauthentication/JobPage/components/FormRegistration.tsx:19`

## Key Symbols

| Symbol             | Type     | File                                                                 | Line |
| ------------------ | -------- | -------------------------------------------------------------------- | ---- |
| `FormRegistration` | Function | `src/pages/unauthentication/JobPage/components/FormRegistration.tsx` | 19   |
| `CreatePostPage`   | Function | `src/pages/authentication/CreatePostPage/index.tsx`                  | 32   |
| `fetchCategories`  | Function | `src/pages/authentication/CreatePostPage/index.tsx`                  | 44   |
| `handleRemoveTag`  | Function | `src/pages/authentication/CreatePostPage/index.tsx`                  | 76   |
| `handleSubmit`     | Function | `src/pages/authentication/CreatePostPage/index.tsx`                  | 96   |

## How to Explore

1. `gitnexus_context({name: "FormRegistration"})` — see callers and callees
2. `gitnexus_query({query: "createpostpage"})` — find related execution flows
3. Read key files listed above for implementation details
