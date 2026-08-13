---
name: order
description: 'Skill for the Order area of svykhoa-client. 4 symbols across 4 files.'
---

# Order

4 symbols | 4 files | Cohesion: 86%

## When to Use

- Working with code in `src/`
- Understanding how checkoutResource, checkoutCourse, submitFeedback work
- Modifying order-related functionality

## Key Files

| File                                                 | Symbols          |
| ---------------------------------------------------- | ---------------- |
| `src/services/httpClient.ts`                         | post             |
| `src/services/medicalSearch/MedicalSearchService.ts` | submitFeedback   |
| `src/services/Order/checkoutResource.ts`             | checkoutResource |
| `src/services/Order/checkoutCourse.ts`               | checkoutCourse   |

## Entry Points

Start here when exploring this area:

- **`checkoutResource`** (Function) — `src/services/Order/checkoutResource.ts:8`
- **`checkoutCourse`** (Function) — `src/services/Order/checkoutCourse.ts:26`
- **`submitFeedback`** (Method) — `src/services/medicalSearch/MedicalSearchService.ts:211`

## Key Symbols

| Symbol             | Type     | File                                                 | Line |
| ------------------ | -------- | ---------------------------------------------------- | ---- |
| `checkoutResource` | Function | `src/services/Order/checkoutResource.ts`             | 8    |
| `checkoutCourse`   | Function | `src/services/Order/checkoutCourse.ts`               | 26   |
| `submitFeedback`   | Method   | `src/services/medicalSearch/MedicalSearchService.ts` | 211  |
| `post`             | Method   | `src/services/httpClient.ts`                         | 90   |

## Execution Flows

| Flow                             | Type            | Steps |
| -------------------------------- | --------------- | ----- |
| `SubmitFeedback → HandleError`   | cross_community | 3     |
| `CheckoutResource → HandleError` | cross_community | 3     |
| `CheckoutCourse → HandleError`   | cross_community | 3     |

## Connected Areas

| Area     | Connections |
| -------- | ----------- |
| Services | 1 calls     |

## How to Explore

1. `gitnexus_context({name: "checkoutResource"})` — see callers and callees
2. `gitnexus_query({query: "order"})` — find related execution flows
3. Read key files listed above for implementation details
