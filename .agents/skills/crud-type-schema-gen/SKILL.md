---
name: crud-type-schema-gen
description: Generates TypeScript model types and Zod mutation schemas for CRUD operations.
---

# Skill: `crud-type-schema-gen`

Bạn là một chuyên gia về TypeScript và Zod. Nhiệm vụ của bạn là tạo ra **model type** và **mutation schema** hoàn chỉnh dựa trên danh sách field mà người dùng cung cấp.

---

## When to use this skill

- Khi tạo mới một CRUD module và cần định nghĩa kiểu dữ liệu.
- Khi muốn chuẩn hoá type và validation schema cho một entity.

---

## Output Files

| File            | Đường dẫn                                                                         |
| --------------- | --------------------------------------------------------------------------------- |
| Model type      | `src/models/[ModuleName].ts`                                                      |
| Mutation schema | `src/pages/authentication/[ModuleName]Page/schemas/mutation[ModuleName]Schema.ts` |

---

## Step 1: Phân tích Entity

Trước khi tạo file, xác định:

1. **Tên module** (PascalCase) — ví dụ: `ConfigOffice`, `Department`, `Employee`
2. **Danh sách field** và kiểu dữ liệu (`string`, `number`, `boolean`, enum, foreign key `_id` reference)
3. **Field nào bắt buộc** (required) trong form mutation
4. **Field nào chỉ có trên server** (không cần trong form) — ví dụ: `_id`, `createdAt`, `updatedAt`
5. **Field nào có giá trị default** — ví dụ: `boolean` default `false`, `number` default `0`

---

## Step 2: Tạo Model Type

### Quy tắc

- Luôn kế thừa `ModelBase` (chứa `_id`, `createdAt`, `updatedAt`, `createdBy?`, `updatedBy?`).
- Mỗi field phải có **comment tiếng Việt** giải thích ý nghĩa.
- Foreign key đặt theo quy tắc: `[entity]Id: string` + `[entity]Data?: [EntityType]` (optional, dùng khi populate).
- Enum value dùng `type` union string literal hoặc import từ `~/models/CommonEnum/`.

### Template

```typescript
// src/models/[ModuleName].ts
import { ModelBase } from './ModelBase';
// import { SomeOtherModel } from './SomeOtherModel'; // nếu có quan hệ

export interface [ModuleName] extends ModelBase {
  name: string;                    // Tên [module]
  description?: string;            // Mô tả (optional)
  status: 'active' | 'inactive';   // Trạng thái
  isActive: boolean;               // Kích hoạt → default: false
  order: number;                   // Thứ tự → default: 0
  parentId?: string;               // ID danh mục cha (optional)
  // parentData?: ParentModel;     // Populate từ parentId (optional, chỉ khai báo nếu API trả về)
}
```

### Ví dụ thực tế (ConfigOffice)

```typescript
// src/models/ConfigOffice.ts
import { ModelBase } from './ModelBase'

export interface ConfigOffice extends ModelBase {
  name: string // Tên văn phòng
  isCheckinGPS: boolean // GPS Flag → lấy tọa độ → default: false
  lat: number // Vĩ độ → default: 0
  long: number // Kinh độ → default: 0
  allowCheckin: boolean // Cho phép check-in → default: false
}
```

---

## Step 3: Tạo Mutation Schema (Zod)

### Quy tắc

- Schema chỉ bao gồm **các field cần thiết cho form** (bỏ `_id`, `createdAt`, `updatedAt`).
- Export tên hàm: `getFormMutation[ModuleName]Schema`.
- Export type: `FormMutation[ModuleName]Value` (infer từ Zod schema).
- Export type: `FormMutation[ModuleName]StateValue` (dùng `FormMutationStateValues<T>` utility).
- Mọi validation message phải **bằng tiếng Việt**, dùng helper `getRequiredMessage` và `getInvalidMessage`.
- Tham số hàm luôn là `t: TFunction<FlatNamespace[]>` để hỗ trợ i18n.

### Field Type Reference

| Zod type                          | Mô tả                | Example                                                           |
| --------------------------------- | -------------------- | ----------------------------------------------------------------- |
| `string(...)`                     | Text input           | `string({ required_error: getRequiredMessage(t, 'NS:key') })`     |
| `string().trim().min(1, ...)`     | Required string      | Tránh chuỗi rỗng sau trim                                         |
| `number(...)`                     | Number input         | `number({ invalid_type_error: getRequiredMessage(t, 'NS:key') })` |
| `boolean()`                       | Switch/Checkbox      | `boolean().default(false)`                                        |
| `boolean().default(false)`        | Switch với default   | Không cần required_error                                          |
| `z.enum([...])`                   | Select với enum      | `z.enum(['a', 'b'], { required_error: ... })`                     |
| `.optional()`                     | Field không bắt buộc | Thêm vào cuối chain                                               |
| `.nullable()`                     | Field có thể null    | Thêm vào cuối chain                                               |
| `.min(n, msg)`                    | Minimum length/value | Dùng cho string và number                                         |
| `.max(n, msg)`                    | Maximum length/value | Dùng cho string và number                                         |
| `.default(val)`                   | Giá trị mặc định     | Dùng cho boolean, number                                          |
| `.url(msg)`                       | Validate URL         | Dùng cho field URL                                                |
| `.email(msg)`                     | Validate email       | Dùng cho field email                                              |
| `z.array(z.string())`             | Mảng string          | Multi-select, tags                                                |
| `z.array(z.string()).min(1, msg)` | Mảng bắt buộc ≥1     | Multi-select required                                             |

### Template

```typescript
// src/pages/authentication/[ModuleName]Page/schemas/mutation[ModuleName]Schema.ts
import { FlatNamespace, TFunction } from 'i18next';
import { boolean, number, object, string, TypeOf, z } from 'zod';
import { FormMutationStateValues } from '~/shared/TypescriptUtilities';
import { getInvalidMessage } from '~/utils/functions/getInvalidMessage';
import { getRequiredMessage } from '~/utils/functions/getRequiredMessage';

export const getFormMutation[ModuleName]Schema = (t: TFunction<FlatNamespace[]>) => {
  return object({
    // --- Required string ---
    name: string({ required_error: getRequiredMessage(t, '[ModuleName]Locales:name') })
      .trim()
      .min(1, getRequiredMessage(t, '[ModuleName]Locales:name')),

    // --- Optional string ---
    description: string().trim().optional(),

    // --- Required number ---
    order: number({ invalid_type_error: getRequiredMessage(t, '[ModuleName]Locales:order') })
      .min(0, getInvalidMessage(t, '[ModuleName]Locales:order'))
      .default(0),

    // --- Boolean (switch) ---
    isActive: boolean().default(false),

    // --- Enum/Select ---
    status: z.enum(['active', 'inactive'], {
      required_error: getRequiredMessage(t, '[ModuleName]Locales:status'),
    }),

    // --- Foreign key (select box) ---
    parentId: string({ required_error: getRequiredMessage(t, '[ModuleName]Locales:parentId') })
      .min(1, getRequiredMessage(t, '[ModuleName]Locales:parentId')),

    // --- Optional foreign key ---
    // parentId: string().optional(),

    // --- URL ---
    // website: string().url(getInvalidMessage(t, '[ModuleName]Locales:website')).optional(),

    // --- Email ---
    // email: string().email(getInvalidMessage(t, '[ModuleName]Locales:email')).optional(),

    // --- Array of IDs (multi-select) ---
    // tagIds: z.array(z.string()).min(1, getRequiredMessage(t, '[ModuleName]Locales:tagIds')),
  });
};

export type FormMutation[ModuleName]Value = TypeOf<ReturnType<typeof getFormMutation[ModuleName]Schema>>;
export type FormMutation[ModuleName]StateValue = FormMutationStateValues<FormMutation[ModuleName]Value>;
```

### Ví dụ thực tế (ConfigOffice)

```typescript
// src/pages/authentication/ConfigOffice/schemas/mutationConfigOfficeSchema.ts
import { FlatNamespace, TFunction } from 'i18next'
import { boolean, number, object, string, TypeOf } from 'zod'
import { FormMutationStateValues } from '~/shared/TypescriptUtilities'
import { getInvalidMessage } from '~/utils/functions/getInvalidMessage'
import { getRequiredMessage } from '~/utils/functions/getRequiredMessage'

export const getFormMutationConfigOfficeSchema = (t: TFunction<FlatNamespace[]>) => {
  return object({
    name: string({ required_error: getRequiredMessage(t, 'ConfigOfficeLocales:name') })
      .trim()
      .min(1, getRequiredMessage(t, 'ConfigOfficeLocales:name')),
    isCheckinGPS: boolean().default(false),
    lat: number({ invalid_type_error: getRequiredMessage(t, 'ConfigOfficeLocales:lat') })
      .min(-90, getInvalidMessage(t, 'ConfigOfficeLocales:lat'))
      .max(90, getInvalidMessage(t, 'ConfigOfficeLocales:lat'))
      .default(0),
    long: number({ invalid_type_error: getRequiredMessage(t, 'ConfigOfficeLocales:long') })
      .min(-180, getInvalidMessage(t, 'ConfigOfficeLocales:long'))
      .max(180, getInvalidMessage(t, 'ConfigOfficeLocales:long'))
      .default(0),
    allowCheckin: boolean().default(false),
  })
}

export type FormMutationConfigOfficeValue = TypeOf<
  ReturnType<typeof getFormMutationConfigOfficeSchema>
>
export type FormMutationConfigOfficeStateValue =
  FormMutationStateValues<FormMutationConfigOfficeValue>
```

---

## Coding Conventions

- **Naming:** camelCase cho biến/field, PascalCase cho interface/type.
- **Language:** Code bằng tiếng Anh. UI text, validation messages bằng tiếng Việt.
- **i18n namespace:** Luôn dùng `[ModuleName]Locales:fieldKey` format.
- **Không** đưa `_id`, `createdAt`, `updatedAt` vào mutation schema.
- **Field optional** trong model không nhất thiết optional trong schema (tuỳ logic nghiệp vụ).
