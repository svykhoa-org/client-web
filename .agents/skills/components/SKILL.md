---
name: components
description: 'Skill for the Components area of svykhoa-client. 33 symbols across 8 files.'
---

# Components

33 symbols | 8 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how ResourceItem, handleAction, formatPrice work
- Modifying components-related functionality

## Key Files

| File                                                                              | Symbols                                                                             |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | CommentSection, loadComments, handleLogin, handleRegister, handleSubmitComment (+3) |
| `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | ResourceItem, handleAction, formatPrice, formatFileSize, getCategoryColor (+2)      |
| `src/components/ui/ChatBot/src/components/ChatWindow.tsx`                         | ChatWindow, scrollToBottom, handleMessageClick, handleSend, handleQuestionClick     |
| `src/pages/unauthentication/PostDetailPage/src/components/CommentItem.tsx`        | CommentItem, formatDate, getIndentClass, getBorderClass                             |
| `src/pages/public/DocumentDetailPage/components/DocumentCheckoutModalContent.tsx` | toInputValue, formatCurrency, DocumentCheckoutModalContent                          |
| `src/pages/unauthentication/ForumPage/components/RightSidebar.tsx`                | RightSidebar, formatNumber                                                          |
| `src/pages/authentication/HomePage/components/ListBulletins.tsx`                  | ListBulletins, handleBulletinClick                                                  |
| `src/pages/authentication/CoursePage/components/PaymentRedirectionForm.tsx`       | PaymentRedirectionForm, formatCurrency                                              |

## Entry Points

Start here when exploring this area:

- **`ResourceItem`** (Function) — `src/pages/authentication/ResourcePage/components/ResourceItem.tsx:25`
- **`handleAction`** (Function) — `src/pages/authentication/ResourcePage/components/ResourceItem.tsx:30`
- **`formatPrice`** (Function) — `src/pages/authentication/ResourcePage/components/ResourceItem.tsx:34`
- **`formatFileSize`** (Function) — `src/pages/authentication/ResourcePage/components/ResourceItem.tsx:39`
- **`getCategoryColor`** (Function) — `src/pages/authentication/ResourcePage/components/ResourceItem.tsx:46`

## Key Symbols

| Symbol                         | Type     | File                                                                              | Line |
| ------------------------------ | -------- | --------------------------------------------------------------------------------- | ---- |
| `ResourceItem`                 | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 25   |
| `handleAction`                 | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 30   |
| `formatPrice`                  | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 34   |
| `formatFileSize`               | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 39   |
| `getCategoryColor`             | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 46   |
| `handleQuickBuy`               | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 77   |
| `renderBadges`                 | Function | `src/pages/authentication/ResourcePage/components/ResourceItem.tsx`               | 97   |
| `DocumentCheckoutModalContent` | Function | `src/pages/public/DocumentDetailPage/components/DocumentCheckoutModalContent.tsx` | 30   |
| `ListBulletins`                | Function | `src/pages/authentication/HomePage/components/ListBulletins.tsx`                  | 10   |
| `handleBulletinClick`          | Function | `src/pages/authentication/HomePage/components/ListBulletins.tsx`                  | 34   |
| `PaymentRedirectionForm`       | Function | `src/pages/authentication/CoursePage/components/PaymentRedirectionForm.tsx`       | 12   |
| `formatCurrency`               | Function | `src/pages/authentication/CoursePage/components/PaymentRedirectionForm.tsx`       | 22   |
| `CommentSection`               | Function | `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | 18   |
| `loadComments`                 | Function | `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | 29   |
| `handleLogin`                  | Function | `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | 78   |
| `handleRegister`               | Function | `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | 82   |
| `handleSubmitComment`          | Function | `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | 86   |
| `handleKeyDown`                | Function | `src/pages/unauthentication/PostDetailPage/src/components/CommentSection.tsx`     | 120  |
| `ChatWindow`                   | Function | `src/components/ui/ChatBot/src/components/ChatWindow.tsx`                         | 23   |
| `scrollToBottom`               | Function | `src/components/ui/ChatBot/src/components/ChatWindow.tsx`                         | 36   |

## How to Explore

1. `gitnexus_context({name: "ResourceItem"})` — see callers and callees
2. `gitnexus_query({query: "components"})` — find related execution flows
3. Read key files listed above for implementation details
