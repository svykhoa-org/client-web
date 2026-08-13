---
name: crud-route-page-gen
description: Generates Route declarations in RouteConfig.ts, App.tsx lazy imports, and the 3 boilerplate page files (List, Create, Update).
---

# Skill: `crud-route-page-gen`

Bạn là chuyên gia về React Router và cấu trúc dự án. Nhiệm vụ là khai báo đầy đủ **routes**, **lazy imports** và **page wrapper files** cho một CRUD module mới theo chuẩn dự án.

---

## When to use this skill

- Khi tạo mới một CRUD module và cần cài đặt routing.
- Khi cần đăng ký module vào App.tsx và RouteConfig.

---

## Output Files

| File         | Đường dẫn                                                              | Thao tác                                  |
| ------------ | ---------------------------------------------------------------------- | ----------------------------------------- |
| Route config | `src/constants/RouteConfig/RouteConfig.ts`                             | **MODIFY** — thêm entries                 |
| App router   | `src/App.tsx`                                                          | **MODIFY** — thêm lazy import + `<Route>` |
| List page    | `src/pages/authentication/[ModuleName]Page/List[ModuleName]Page.tsx`   | **CREATE**                                |
| Create page  | `src/pages/authentication/[ModuleName]Page/Create[ModuleName]Page.tsx` | **CREATE**                                |
| Update page  | `src/pages/authentication/[ModuleName]Page/Update[ModuleName]Page.tsx` | **CREATE**                                |

---

## Step 1: Khai báo Route trong `RouteConfig.ts`

Mở file `src/constants/RouteConfig/RouteConfig.ts` và thêm 3 route entries vào đúng section.

### Pattern của 1 entry đầy đủ

```typescript
// Thêm vào object RouteConfig
List[ModuleName]Page: {
  path: '/[section]/[module-name]',              // kebab-case URL path
  title: '[Tên trang - tiếng Việt]',
},
Create[ModuleName]Page: {
  path: '/[section]/[module-name]/create',
  title: 'Tạo [tên module]',
},
Update[ModuleName]Page: {
  path: '/[section]/[module-name]/:id',          // dynamic segment
  paramKey: 'id',                                // khớp với tên param trong path
  title: 'Cập nhật [tên module]',
  getPath: (id: string) => `/[section]/[module-name]/${id}`,
},
```

### Ví dụ thực tế (ConfigOffice)

```typescript
ListConfigOfficePage: {
  path: '/authentication/config-office',
  title: 'Cấu hình văn phòng',
},
CreateConfigOfficePage: {
  path: '/authentication/config-office/create',
  title: 'Tạo văn phòng',
},
UpdateConfigOfficePage: {
  path: '/authentication/config-office/:id',
  paramKey: 'id',
  title: 'Cập nhật văn phòng',
  getPath: (id: string) => `/authentication/config-office/${id}`,
},
```

**Quy tắc:**

- URL path dùng **kebab-case** (ví dụ: `config-office`, `employee-level`)
- Section thường là `authentication` cho các trang sau khi đăng nhập
- `paramKey` phải khớp **chính xác** với tên dynamic segment trong `path`

---

## Step 2: Thêm Lazy Import + Route vào `App.tsx`

### Thêm lazy import (đặt cùng nhóm với module liên quan)

```typescript
// Tìm section phù hợp trong App.tsx và thêm 3 lazy imports
const List[ModuleName]Page = lazy(() =>
  import('~/pages/authentication/[ModuleName]Page/List[ModuleName]Page').then(module => ({
    default: module.List[ModuleName]Page,
  })),
);
const Create[ModuleName]Page = lazy(() =>
  import('~/pages/authentication/[ModuleName]Page/Create[ModuleName]Page').then(module => ({
    default: module.Create[ModuleName]Page,
  })),
);
const Update[ModuleName]Page = lazy(() =>
  import('~/pages/authentication/[ModuleName]Page/Update[ModuleName]Page').then(module => ({
    default: module.Update[ModuleName]Page,
  })),
);
```

### Thêm Route declarations (đặt trong đúng Route group)

```tsx
{/* [ModuleName] */}
<Route path={RouteConfig.List[ModuleName]Page.path} element={<List[ModuleName]Page />} />
<Route path={RouteConfig.Create[ModuleName]Page.path} element={<Create[ModuleName]Page />} />
<Route path={RouteConfig.Update[ModuleName]Page.path} element={<Update[ModuleName]Page />} />
```

---

## Step 3: Tạo 3 Page Files

> Xem skill `crud-mutation-form-gen` để có template đầy đủ cho 3 file này.

### `List[ModuleName]Page.tsx` (minimal — wrap Table component)

```tsx
import { Table[ModuleName] } from './components/Table[ModuleName]';

export const List[ModuleName]Page = () => {
  return <Table[ModuleName] />;
};
```

### `Create[ModuleName]Page.tsx` (truyền `_id={undefined}`)

```tsx
import { Mutation[ModuleName] } from './components/Mutation[ModuleName]';

export const Create[ModuleName]Page = () => {
  return (
    <div>
      <Mutation[ModuleName] _id={undefined} />
    </div>
  );
};
```

### `Update[ModuleName]Page.tsx` (lấy id từ params)

```tsx
import { Navigate, useParams } from 'react-router-dom';
import { Mutation[ModuleName] } from './components/Mutation[ModuleName]';
import { RouteConfig } from '~/constants/RouteConfig/RouteConfig';

export const Update[ModuleName]Page = () => {
  const params = useParams();
  const id = params[RouteConfig.Update[ModuleName]Page.paramKey];

  if (!id) {
    return <Navigate to={RouteConfig.NotFoundPage.path} />;
  }

  return (
    <div>
      <Mutation[ModuleName] _id={id} />
    </div>
  );
};
```

---

## Step 4: Thêm vào Navigation Menu (tuỳ chọn)

Nếu module cần xuất hiện trên sidebar, tìm hook/helper `useGetNavData` (hoặc tương đương) và thêm entry:

```typescript
{
  key: RouteConfig.List[ModuleName]Page.path,
  label: t('[ModuleName]Locales:[moduleName]'),
  icon: <SomeIcon />,
  path: RouteConfig.List[ModuleName]Page.path,
},
```

---

## Checklist

- [ ] 3 Route entries đã thêm vào `RouteConfig.ts`
- [ ] `paramKey` khớp với dynamic segment trong path
- [ ] `getPath()` arrow function trả về đúng URL
- [ ] 3 lazy imports đã thêm vào `App.tsx`
- [ ] 3 `<Route>` đã thêm vào đúng Route group trong `App.tsx`
- [ ] 3 page files đã tạo trong đúng folder

---

## Coding Conventions

- **URL:** kebab-case, ví dụ `/authentication/config-office/:id`
- **Lazy import:** Luôn dùng `.then(module => ({ default: module.[ComponentName] }))` pattern
- **Route ordering:** List → Create → Update (order quan trọng: các route cụ thể hơn phải đặt trước nếu có conflict)
