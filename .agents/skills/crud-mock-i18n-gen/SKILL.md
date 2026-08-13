---
name: crud-mock-i18n-gen
description: Generates i18n locale file and mock service for a CRUD module.
---

# Skill: `crud-mock-i18n-gen`

Bạn là chuyên gia về i18n và mock data. Nhiệm vụ là tạo **i18n locale file** và đăng ký nó, đồng thời tạo **mock service** với dữ liệu mẫu thực tế cho module.

---

## When to use this skill

- Khi tạo mới một CRUD module và cần định nghĩa nhãn tiếng Việt.
- Khi cần mock data để phát triển/test UI offline.
- Được gọi trước khi tạo component (i18n keys phải tồn tại trước).

---

## Output Files

| File         | Đường dẫn                                    | Thao tác                           |
| ------------ | -------------------------------------------- | ---------------------------------- |
| i18n locale  | `src/I18n/locales/en/[ModuleName]Locales.ts` | **CREATE**                         |
| i18n index   | `src/I18n/locales/en/index.ts`               | **MODIFY** — thêm export + đăng ký |
| Mock service | `src/services/_mock/mock[ModuleName].ts`     | **CREATE**                         |

---

## Step 1: Tạo i18n Locale File

### Quy tắc

- File export 1 `const` object với tên `[ModuleName]Locales`.
- Key phải có: `[moduleName]` (tên module), `_id`, và **tất cả field** của model.
- Value là **tiếng Việt** ngắn gọn, dùng cho label, table header, breadcrumb.
- Đặt tên key bằng **đúng tên field** trong model TypeScript (camelCase).

### Template

```typescript
// src/I18n/locales/en/[ModuleName]Locales.ts
export const [ModuleName]Locales = {
  // Tên module (dùng trong breadcrumb, menu)
  [moduleName]: '[Tên module tiếng Việt]',

  // Fields (khớp chính xác tên field trong model)
  _id: 'ID',
  name: 'Tên [module]',
  description: 'Mô tả',
  isActive: 'Kích hoạt',
  order: 'Thứ tự',
  status: 'Trạng thái',
  // ...thêm các field khác

  // Foreign key labels
  // departmentId: 'Phòng ban',
  // parentId: 'Danh mục cha',
};
```

### Ví dụ thực tế (ConfigOffice)

```typescript
// src/I18n/locales/en/ConfigOfficeLocales.ts
export const ConfigOfficeLocales = {
  configOffice: 'Cấu hình văn phòng',
  _id: 'ID',
  name: 'Tên văn phòng',
  isCheckinGPS: 'Checkin GPS',
  lat: 'Vĩ độ',
  long: 'Kinh độ',
  allowCheckin: 'Cho phép checkin',
}
```

---

## Step 2: Đăng ký i18n Locale

Sau khi tạo file locale, **phải đăng ký** vào i18n configuration. Tìm file index hoặc config của i18n:

```typescript
// src/I18n/locales/en/index.ts (hoặc src/I18n/i18n.ts)
// Thêm import
import { [ModuleName]Locales } from './[ModuleName]Locales';

// Thêm vào resources object
export const enLocales = {
  // ...existing locales
  [ModuleName]Locales,
};
```

**Lưu ý:** Tìm xem project đăng ký locale kiểu nào (object spread, array, hay resources config) và làm theo đúng pattern đang dùng.

---

## Step 3: Tạo Mock Service

### Quy tắc mock data tốt

- **`storageKey`:** camelCase, unique trong toàn project. Dùng tên module viết thường, ví dụ: `configOffice`, `employeeLevel`, `documentCategory`.
- **`defaultRecords`:** Cung cấp **tối thiểu 5-10 bản ghi** với dữ liệu mẫu thực tế (tên thật, số hợp lệ, ngày hợp lệ…).
- **`_id`:** Dùng prefix gợi nhớ + số thứ tự 3 chữ số, ví dụ: `co001`, `dep001`, `emp001`.
- **`createdAt`/`updatedAt`:** Dùng ISO string, mỗi record cách nhau 1 ngày.
- **Data chất lượng:** Không dùng `Lorem ipsum` hay `Test 1`, `Test 2`. Dùng tên/dữ liệu thực tế của Việt Nam.

### Template

```typescript
// src/services/_mock/mock[ModuleName].ts
import { [ModuleName] } from '~/models/[ModuleName]';
import { CreateMockService } from '../_shared/utils/CreateMockService';

export const mock[ModuleName]Service = new CreateMockService<[ModuleName]>({
  version: '1.0',
  storageKey: '[moduleName]',  // camelCase, unique
  defaultRecords: [
    {
      _id: '[prefix]001',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      name: '[Tên mẫu thực tế 1]',
      isActive: true,
      order: 1,
      // ... tất cả field của model với giá trị hợp lệ
    },
    {
      _id: '[prefix]002',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      name: '[Tên mẫu thực tế 2]',
      isActive: true,
      order: 2,
    },
    // ... thêm 3-8 records nữa
    {
      _id: '[prefix]010',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      name: '[Tên mẫu thực tế 10]',
      isActive: false,
      order: 10,
    },
  ],
  enrichFns: {
    // Nếu model có foreign key cần populate:
    // [fieldData]: async (record) => {
    //   return someOtherMockService.getDetail(record.[fieldId]).then(r => r.data);
    // },
  },
});
```

### Ví dụ dữ liệu tốt vs xấu

```typescript
// ❌ XẤU — dữ liệu giả tạo, không thực tế
{ _id: 'id1', name: 'Test 1', isActive: true }

// ✅ TỐT — dữ liệu thực tế, có ý nghĩa
{ _id: 'dep001', name: 'Phòng Kỹ thuật Phần mềm', isActive: true, order: 1 }
{ _id: 'dep002', name: 'Phòng Kinh doanh & Marketing', isActive: true, order: 2 }
{ _id: 'dep003', name: 'Phòng Nhân sự', isActive: true, order: 3 }
```

---

## Checklist

- [ ] File locale có đủ tất cả field names từ model
- [ ] Đã đăng ký locale vào i18n config
- [ ] `storageKey` là unique (kiểm tra các file mock khác)
- [ ] Có ít nhất 5 `defaultRecords` với dữ liệu thực tế chất lượng
- [ ] Tất cả field trong `defaultRecords` khớp với model interface (TypeScript sẽ báo lỗi nếu thiếu field required)
- [ ] `enrichFns` được xử lý nếu model có foreign key relationships

---

## i18n Key Convention

| Pattern                    | Dùng trong                         |
| -------------------------- | ---------------------------------- |
| `[moduleName]` (camelCase) | Breadcrumb, menu item, modal title |
| `_id`                      | Column header ID                   |
| `fieldName` (từng field)   | Form label, column header          |

**Namespace trong component:** `'[ModuleName]Locales'` — chính xác tên key trong i18n resources.
