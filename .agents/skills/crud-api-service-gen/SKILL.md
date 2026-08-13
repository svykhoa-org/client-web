---
name: crud-api-service-gen
description: Generates 5 CRUD service files (getList, getDetail, create, update, delete) + mock service following project conventions.
---

# Skill: `crud-api-service-gen`

Bạn là một chuyên gia về API integration. Nhiệm vụ của bạn là tạo ra **5 service files** và **1 mock service** hoàn chỉnh cho một CRUD module, tuân thủ conventions của dự án.

---

## When to use this skill

- Khi tạo mới CRUD module và cần tầng service gọi API.
- Khi refactor service cũ sang chuẩn mới (fetchApi, ServiceException).

---

## Output Files

| File         | Đường dẫn                                         |
| ------------ | ------------------------------------------------- |
| Get list     | `src/services/[ModuleName]/get[ModuleName]s.ts`   |
| Get detail   | `src/services/[ModuleName]/get[ModuleName].ts`    |
| Create       | `src/services/[ModuleName]/create[ModuleName].ts` |
| Update       | `src/services/[ModuleName]/update[ModuleName].ts` |
| Delete       | `src/services/[ModuleName]/delete[ModuleName].ts` |
| Mock service | `src/services/_mock/mock[ModuleName].ts`          |

---

## Kiến trúc Service

Mọi service đều theo pattern:

```
1. Luôn sử dụng `bindStage` để chuẩn hóa việc gọi API.
2. Trạng thái mặc định `stage: 'MOCK'` khi chưa có API thực (sử dụng `mockFunc`).
3. Trong `mockFunc` gọi logic mock service, để tránh lỗi gọi API khi người dùng chưa cung cấp.
4. Trong `devFunc` gọi fetchApi.request<SuccessType | ResponseFailure>({ url, method, data/params }).
5. Dùng ServiceException.isAxiosResponseError(response) để kiểm tra lỗi. Throw ServiceException nếu lỗi, return data nếu thành công.
```

---

## File 1: `get[ModuleName]s.ts` — Get List

```typescript
// src/services/[ModuleName]/get[ModuleName]s.ts
import { mock[ModuleName]Service } from '../_mock/mock[ModuleName]';
import { ResponseFailure, ResponseListSuccess } from '../_shared/types/ServiceResponse';
import { Searcher, Sorter } from '../_shared/types/ServiceSearchParams';
import { bindStage } from '../_shared/utils/bindStage';
import { getSearchParams } from '../_shared/utils/getSearchParams';
import { getSortParams } from '../_shared/utils/getSortParams';
import { ServiceException } from '../_shared/utils/ServiceException';
import { [ModuleName] } from '~/models/[ModuleName]';
import { fetchApi } from '~/utils/fetchApi';

export type Get[ModuleName]sResponseData = [ModuleName];

export interface Get[ModuleName]s {
  page: number;
  pageSize: number;
  sorter: Sorter<Get[ModuleName]sResponseData>;
  searcher: Searcher<Get[ModuleName]sResponseData>;
}

export const get[ModuleName]s = bindStage<
  Get[ModuleName]s,
  ResponseListSuccess<Get[ModuleName]sResponseData>
>({
  // FIXME: Thay đổi trạng thái khi có API: 'MOCK' | 'DEV' | 'PROD'
  stage: 'MOCK',
  mockFunc: async ({
    page,
    pageSize,
    searcher,
    sorter,
  }: Get[ModuleName]s) => {
    return mock[ModuleName]Service.getList({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      ...getSortParams(sorter),
      ...getSearchParams(searcher),
    });
  },
  devFunc: async ({
    page,
    pageSize,
    searcher,
    sorter,
  }: Get[ModuleName]s) => {
    const response = await fetchApi.request<ResponseListSuccess<Get[ModuleName]sResponseData> | ResponseFailure>({
      url: '/[api-endpoint]',
      params: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        ...getSortParams(sorter),
        ...getSearchParams(searcher),
      },
    }).axiosPromise;

    if (ServiceException.isAxiosResponseError(response)) {
      throw new ServiceException(response.data);
    }
    return response.data as ResponseListSuccess<Get[ModuleName]sResponseData>;
  },
  // prodFunc
});
```

**Lưu ý `getList` response:**

```typescript
// Trong TableList component dùng response như sau:
return {
  data: response.data.hits,
  page: searchParams.page,
  pageSize: searchParams.pageSize,
  totalPages: response.data.pagination.totalPages,
  totalRecords: response.data.pagination.totalRows,
}
```

---

## File 2: `get[ModuleName].ts` — Get Detail

```typescript
// src/services/[ModuleName]/get[ModuleName].ts
import { mock[ModuleName]Service } from '../_mock/mock[ModuleName]';
import { ResponseDetailSuccess, ResponseFailure } from '../_shared/types/ServiceResponse';
import { bindStage } from '../_shared/utils/bindStage';
import { ServiceException } from '../_shared/utils/ServiceException';
import { [ModuleName] } from '~/models/[ModuleName]';
import { fetchApi } from '~/utils/fetchApi';

export interface Get[ModuleName] {
  data: {
    _id: [ModuleName]['_id'];
  };
}

export type Get[ModuleName]ResponseData = [ModuleName];

export const get[ModuleName] = bindStage<
  Get[ModuleName],
  ResponseDetailSuccess<Get[ModuleName]ResponseData>
>({
  // FIXME: Thay đổi trạng thái khi có API: 'MOCK' | 'DEV' | 'PROD'
  stage: 'MOCK',
  mockFunc: async ({ data }: Get[ModuleName]) => {
    return mock[ModuleName]Service.getDetail(data._id);
  },
  devFunc: async ({ data }: Get[ModuleName]) => {
    const response = await fetchApi.request<ResponseDetailSuccess<Get[ModuleName]ResponseData> | ResponseFailure>({
      url: `/[api-endpoint]/${data._id}`,
    }).axiosPromise;

    if (ServiceException.isAxiosResponseError(response)) {
      throw new ServiceException(response.data);
    }
    return response.data as ResponseDetailSuccess<Get[ModuleName]ResponseData>;
  },
  // prodFunc
});
```

---

## File 3: `create[ModuleName].ts` — Create

```typescript
// src/services/[ModuleName]/create[ModuleName].ts
import { mock[ModuleName]Service } from '../_mock/mock[ModuleName]';
import { ResponseDetailSuccess, ResponseFailure } from '../_shared/types/ServiceResponse';
import { bindStage } from '../_shared/utils/bindStage';
import { ServiceException } from '../_shared/utils/ServiceException';
import { [ModuleName] } from '~/models/[ModuleName]';
import { fetchApi } from '~/utils/fetchApi';

export interface Create[ModuleName] {
  data: {
    // Liệt kê đầy đủ các field từ form mutation (Không bao gồm _id)
    name: string;
    isActive: boolean;
    // ...các field khác
  };
}

export type Create[ModuleName]ResponseData = [ModuleName];

export const create[ModuleName] = bindStage<
  Create[ModuleName],
  ResponseDetailSuccess<Create[ModuleName]ResponseData>
>({
  // FIXME: Thay đổi trạng thái khi có API: 'MOCK' | 'DEV' | 'PROD'
  stage: 'MOCK',
  mockFunc: async ({ data }: Create[ModuleName]) => {
    return mock[ModuleName]Service.create(data);
  },
  devFunc: async ({ data }: Create[ModuleName]) => {
    const response = await fetchApi.request<ResponseDetailSuccess<Create[ModuleName]ResponseData> | ResponseFailure>({
      url: `/[api-endpoint]`,
      method: 'POST',
      data,
    }).axiosPromise;

    if (ServiceException.isAxiosResponseError(response)) {
      throw new ServiceException(response.data);
    }
    return response.data as ResponseDetailSuccess<Create[ModuleName]ResponseData>;
  },
  // prodFunc
});
```

---

## File 4: `update[ModuleName].ts` — Update

```typescript
// src/services/[ModuleName]/update[ModuleName].ts
import { mock[ModuleName]Service } from '../_mock/mock[ModuleName]';
import { ResponseDetailSuccess, ResponseFailure } from '../_shared/types/ServiceResponse';
import { bindStage } from '../_shared/utils/bindStage';
import { ServiceException } from '../_shared/utils/ServiceException';
import { Create[ModuleName] } from './create[ModuleName]';
import { [ModuleName] } from '~/models/[ModuleName]';
import { fetchApi } from '~/utils/fetchApi';

export interface Update[ModuleName] {
  data: Create[ModuleName]['data'] & {
    _id: [ModuleName]['_id'];
  };
}

export type Update[ModuleName]ResponseData = [ModuleName];

export const update[ModuleName] = bindStage<
  Update[ModuleName],
  ResponseDetailSuccess<Update[ModuleName]ResponseData>
>({
  // FIXME: Thay đổi trạng thái khi có API: 'MOCK' | 'DEV' | 'PROD'
  stage: 'MOCK',
  mockFunc: async ({ data }: Update[ModuleName]) => {
    return mock[ModuleName]Service.update(data._id, data);
  },
  devFunc: async ({ data }: Update[ModuleName]) => {
    const response = await fetchApi.request<ResponseDetailSuccess<Update[ModuleName]ResponseData> | ResponseFailure>({
      url: `/[api-endpoint]/${data._id}`,
      method: 'PUT',
      data,
    }).axiosPromise;

    if (ServiceException.isAxiosResponseError(response)) {
      throw new ServiceException(response.data);
    }
    return response.data as ResponseDetailSuccess<Update[ModuleName]ResponseData>;
  },
  // prodFunc
});
```

**Lưu ý:** `Update[ModuleName]` tái sử dụng `Create[ModuleName]['data']` để đảm bảo consistency, không cần viết lại toàn bộ fields.

---

## File 5: `delete[ModuleName].ts` — Delete

```typescript
// src/services/[ModuleName]/delete[ModuleName].ts
import { mock[ModuleName]Service } from '../_mock/mock[ModuleName]';
import { ResponseDetailSuccess, ResponseFailure } from '../_shared/types/ServiceResponse';
import { bindStage } from '../_shared/utils/bindStage';
import { ServiceException } from '../_shared/utils/ServiceException';
import { [ModuleName] } from '~/models/[ModuleName]';
import { fetchApi } from '~/utils/fetchApi';

export interface Delete[ModuleName]ResponseData {}

export interface Delete[ModuleName] {
  _ids: Array<[ModuleName]['_id']>;
}

export const delete[ModuleName]s = bindStage<
  Delete[ModuleName],
  ResponseDetailSuccess<{}>
>({
  // FIXME: Thay đổi trạng thái khi có API: 'MOCK' | 'DEV' | 'PROD'
  stage: 'MOCK',
  mockFunc: async (data: Delete[ModuleName]) => {
    return mock[ModuleName]Service.deleteMultiple(data._ids);
  },
  devFunc: async (data: Delete[ModuleName]) => {
    // Pattern: loop delete từng record (vì API thường chỉ hỗ trợ xóa 1)
    for (const _id of data._ids) {
      const response = await fetchApi.request<ResponseDetailSuccess<Delete[ModuleName]ResponseData> | ResponseFailure>({
        url: `/[api-endpoint]/${_id}`,
        method: 'DELETE',
      }).axiosPromise;

      if (ServiceException.isAxiosResponseError(response)) {
        throw new ServiceException(response.data);
      }
    }

    return {
      errorCode: 0,
      data: {},
    };
  },
  // prodFunc
});
```

**Lưu ý:** Nếu API hỗ trợ xóa nhiều cùng lúc (batch delete), thay loop bằng 1 request duy nhất với body `{ ids: data._ids }`.

---

## File 6: Mock Service

```typescript
// src/services/_mock/mock[ModuleName].ts
import { [ModuleName] } from '~/models/[ModuleName]';
import { CreateMockService } from '../_shared/utils/CreateMockService';

export const mock[ModuleName]Service = new CreateMockService<[ModuleName]>({
  version: '1.0',
  storageKey: '[moduleName]',  // camelCase, unique per module
  defaultRecords: [
    {
      _id: '[prefix]001',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      name: 'Tên mẫu 1',
      isActive: true,
      // ...các field khác với giá trị mẫu thực tế
    },
    {
      _id: '[prefix]002',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      name: 'Tên mẫu 2',
      isActive: false,
    },
    // Thêm 3-5 record mẫu để table có dữ liệu kiểm tra
  ],
  enrichFns: {
    // Nếu cần populate foreign key, thêm hàm ở đây
    // Ví dụ: parentData: async (record) => getParentById(record.parentId)
  },
});
```

**Quy tắc `storageKey`:** Viết camelCase, unique, ví dụ `configOffice`, `department`, `employeeLevel`.

---

## Checklist trước khi hoàn thành

- [ ] `[api-endpoint]` đã được thay bằng URL thực tế (hỏi user nếu chưa biết, dùng `# FIXME:` nếu chưa xác nhận)
- [ ] Tất cả field trong `Create[ModuleName].data` khớp với Zod schema đã tạo
- [ ] `storageKey` trong mock service là unique so với các mock khác
- [ ] Có đủ 3-5 `defaultRecords` với dữ liệu mẫu hợp lệ
- [ ] Import paths dùng `~/` alias thay vì relative path dài

---

## Coding Conventions

- **Naming:** `get[ModuleName]s` (list), `get[ModuleName]` (detail), `create[ModuleName]`, `update[ModuleName]`, `delete[ModuleName]s`.
- **URL format:** Hỏi user nếu không biết → dùng `// FIXME: Kiểm tra lại URL endpoint`.
- **Error handling:** Luôn wrap bằng `ServiceException.isAxiosResponseError` + `throw new ServiceException`.
- **Mock integration:** Mọi service đều phải bọc qua `bindStage`, sử dụng `stage: 'MOCK'` làm mặc định.
