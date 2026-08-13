---
name: cms-best-practice-crud
description: Orchestrator skill to generate full-stack-ish CRUD modules following enterprise standards.
---

# Skill: `cms-best-practice-crud` (Orchestrator)

Bạn là một Senior Frontend Engineer. Nhiệm vụ là **điều phối toàn bộ luồng tạo module CRUD** (List, Create, Update, Delete) theo chuẩn dự án bằng cách gọi các **sub-skill chuyên biệt** theo đúng thứ tự.

**Tech stack:** Vite + React + TypeScript · React Hook Form + Zod · Axios · React Router v6 · Ant Design (via shared) · Zustand · i18next · UUID

---

## When to use this skill

- Tạo mới một tính năng quản lý (Quản lý người dùng, Quản lý sản phẩm, …).
- Refactor trang CRUD cũ sang chuẩn công ty.
- Đảm bảo tính nhất quán giữa Type, API, Schema và UI.

---

## Project Structure (Quick Reference)

```
src/
├── components/
│   ├── FormMutation/     — Form wrapper (Create/Update)
│   ├── TableList/        — Table wrapper với search, pagination
│   ├── FieldMapping/     — Input field wrapper trong form
│   ├── MutationHeader/   — Breadcrumb + action buttons
│   ├── BoxFields/        — Section container cho form fields
│   ├── ModalConfirmDelete/
│   └── Icons/            — SVG icons (không dùng thư viện ngoài)
├── constants/
│   └── RouteConfig/RouteConfig.ts  — Khai báo routes
├── hooks/useCRUD/
│   ├── useListing.ts     — Fetch list + pagination
│   ├── useDetail.ts      — Fetch 1 record
│   ├── useDelete.ts      — Delete 1 hoặc nhiều records
│   ├── useCreate.ts      — (nếu dùng standalone)
│   └── useUpdate.ts      — (nếu dùng standalone)
├── I18n/locales/en/      — i18n locale files
├── models/               — TypeScript interfaces (extends ModelBase)
├── pages/authentication/ — Pages và components theo module
├── services/
│   ├── _mock/            — Mock services (offline dev)
│   └── [ModuleName]/     — 5 CRUD service files
└── shared/
    └── ReactComponent    — Re-export từ Antd (dùng từ đây, không import Antd trực tiếp)
```

---

## Luồng làm việc (7 Steps)

### Step 1: Phân tích yêu cầu

**Hỏi / Xác định:**

- Module tên gì? (ví dụ: `ConfigOffice`, `Department`, `EmployeeLevel`)
- Có là con của module khác không? (ảnh hưởng URL path)
- Model có những field gì và kiểu dữ liệu?
- Cần có các Enum nào không? (Nếu có, kiểm tra và chuẩn bị sẵn các hàm helper: `get[EnumName]MappingToLabels(t: TFunction<FlatNamespace[]>)` và `[EnumName]MappingToColors`. Định hình sẵn key i18n theo cấu trúc `[ModuleName]Locales:[EnumName].[VALUE_IN_HOA]` để tạo i18n ở Step 3).
- API endpoint là gì? (nếu chưa biết → dùng `// FIXME:`)
- Module đã tồn tại chưa? (nếu có → hỏi có muốn refactor không)

**Quy tắc đặt tên:**

| Loại              | Format                | Ví dụ                           |
| ----------------- | --------------------- | ------------------------------- |
| Module name       | PascalCase            | `ConfigOffice`                  |
| Folder            | `[ModuleName]Page`    | `ConfigOfficePage`              |
| Route URL         | kebab-case            | `/authentication/config-office` |
| storageKey (mock) | camelCase             | `configOffice`                  |
| i18n namespace    | `[ModuleName]Locales` | `ConfigOfficeLocales`           |

---

### Step 2: Tạo Model Type + Zod Schema

> **Sub-skill:** `crud-type-schema-gen`

1. Tạo `src/models/[ModuleName].ts` — interface extends `ModelBase`
2. Tạo `src/pages/authentication/[ModuleName]Page/schemas/mutation[ModuleName]Schema.ts` — Zod schema

**Output của step này:**

- TypeScript interface với comment tiếng Việt cho từng field
- Hàm `getFormMutation[ModuleName]Schema(t)` với validation messages tiếng Việt
- Type exports: `FormMutation[ModuleName]Value`, `FormMutation[ModuleName]StateValue`

---

### Step 3: Tạo i18n Locale + Mock Service

> **Sub-skill:** `crud-mock-i18n-gen`

1. Tạo `src/I18n/locales/en/[ModuleName]Locales.ts` — nhãn tiếng Việt cho tất cả fields
2. Đăng ký vào i18n config
3. Tạo `src/services/_mock/mock[ModuleName].ts` — 5-10 records mẫu thực tế

**⚠️ Step này phải hoàn thành trước Step 4-6** vì i18n keys được dùng trong schema và component.

---

### Step 4: Tạo Services

> **Sub-skill:** `crud-api-service-gen`

Tạo **5 service files** trong `src/services/[ModuleName]/`:

| File                    | Chức năng                |
| ----------------------- | ------------------------ |
| `get[ModuleName]s.ts`   | Fetch list + pagination  |
| `get[ModuleName].ts`    | Fetch detail by `_id`    |
| `create[ModuleName].ts` | POST tạo mới             |
| `update[ModuleName].ts` | PUT cập nhật             |
| `delete[ModuleName].ts` | DELETE (loop hoặc batch) |

Mỗi service: `AppConfig.isLocalService` → mock / `fetchApi.request` → `ServiceException`.

---

### Step 5: Khai báo Routes + Page Files

> **Sub-skill:** `crud-route-page-gen`

1. Thêm 3 entries vào `RouteConfig.ts` (List, Create, Update)
2. Thêm 3 lazy imports vào `App.tsx`
3. Thêm 3 `<Route>` declarations vào `App.tsx`
4. Tạo 3 page boilerplate files (List, Create, Update)

---

### Step 6: Tạo Table Component (List)

> **Sub-skill:** `crud-list-table-gen`

Tạo `src/pages/authentication/[ModuleName]Page/components/Table[ModuleName].tsx`:

- `useListing` hook (search, pagination)
- `useDelete` hook (single + multi delete)
- `TableList` với đầy đủ actions: create, refresh, search, select, delete
- Columns: ID link, fields, actions (Edit/Delete cuối cùng, `fixed: 'right'`)
- `ModalConfirmDelete`

---

### Step 7: Tạo Mutation Form (Create + Update)

> **Sub-skill:** `crud-mutation-form-gen`

Tạo `src/pages/authentication/[ModuleName]Page/components/Mutation[ModuleName].tsx`:

- `useDetail` hook (fetch khi Update mode)
- `FormMutation` với Zod schema, `mutation`, `onSuccess`, `defaultValues`
- `MutationHeader` (breadcrumb + Cancel/Save buttons)
- `BoxFields` + `FieldMapping` grid layout
- 404 Result nếu không tìm thấy record

---

### Step 8: Lint & Format (bắt buộc sau khi hoàn thành tất cả file)

Chạy ESLint với flag `--fix` **chỉ trên các file đã tạo / chỉnh sửa** trong bước này (không chạy toàn bộ project).

```bash
# Thay thế danh sách file bằng đúng các file đã tạo trong module
npx eslint --fix --cache --cache-location ./node_modules/.cache/eslint \
  src/models/[ModuleName].ts \
  src/services/[ModuleName]/get[ModuleName]s.ts \
  src/services/[ModuleName]/get[ModuleName].ts \
  src/services/[ModuleName]/create[ModuleName].ts \
  src/services/[ModuleName]/update[ModuleName].ts \
  src/services/[ModuleName]/delete[ModuleName].ts \
  src/services/_mock/mock[ModuleName].ts \
  src/I18n/locales/en/[ModuleName]Locales.ts \
  src/pages/authentication/[ModuleName]Page/schemas/mutation[ModuleName]Schema.ts \
  src/pages/authentication/[ModuleName]Page/components/Table[ModuleName].tsx \
  src/pages/authentication/[ModuleName]Page/components/Mutation[ModuleName].tsx \
  src/pages/authentication/[ModuleName]Page/List[ModuleName]Page.tsx \
  src/pages/authentication/[ModuleName]Page/Create[ModuleName]Page.tsx \
  src/pages/authentication/[ModuleName]Page/Update[ModuleName]Page.tsx
```

> Nếu có tạo thêm SelectVariant mới, thêm path vào lệnh trên:
> `src/components/SelectVariants/Select[FieldName].tsx`

ESLint tự động chạy **Prettier** qua `eslint-plugin-prettier` — không cần lệnh prettier riêng.

---

### Step 9: Hoàn thiện

**Checklist cuối:**

- [ ] Lint & format đã chạy thành công (Step 8)
- [ ] Tất cả TypeScript errors đã được fix (không còn đỏ)
- [ ] `defaultValues` trong `FormMutation` khớp với Zod schema
- [ ] i18n keys tồn tại trong locale file
- [ ] Routes hoạt động (List → Create → Update → List)
- [ ] Mock service có dữ liệu mẫu thực tế
- [ ] Module xuất hiện trong navigation menu (nếu yêu cầu)
- [ ] Không có `console.log` thừa hoặc code dead

---

## Sub-Skill Map

```
cms-best-practice-crud (Orchestrator)
 ├── Step 2  → crud-type-schema-gen     (Model type + Zod schema)
 ├── Step 3  → crud-mock-i18n-gen       (i18n locale + mock service)
 ├── Step 4  → crud-api-service-gen     (5 service files)
 ├── Step 5  → crud-route-page-gen      (RouteConfig + App.tsx + page files)
 ├── Step 6  → crud-list-table-gen      (Table component)
 ├── Step 7  → crud-mutation-form-gen   (Mutation form)
 └── Step 8  → eslint --fix             (chỉ trên file đã tạo)
```

---

## Coding Conventions (Global)

- **Language:** Code = tiếng Anh. UI text & validation = tiếng Việt.
- **Imports:** Dùng `~/` alias. Không relative path dài. Không import trực tiếp từ `antd`.
- **Naming:** camelCase cho biến/hook, PascalCase cho Component/Interface/Type.
- **Components:** Không dùng `default export` — luôn dùng named export.
- **Icons:** Chỉ dùng `~/components/Icons/Icon*.tsx` SVG icons.
- **State management:** Form state do `FormMutation` quản lý. Global state dùng Zustand.
- **No-Bypass Policy:** Không sử dụng @ts-ignore, @ts-nocheck, @ts-expect-error để tránh việc lỗi. Trong trường hợp sử dụng thư viện bên thứ 3 không thể định dạng type thì có thể dùng
- **Safe Type:** Ưu tiên sử dụng chuẩn type hơn là sử dụng any hoặc unknown
