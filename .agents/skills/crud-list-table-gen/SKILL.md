---
name: crud-list-table-gen
description: Generates the Table[ModuleName].tsx component with full listing, searching, pagination, and delete functionality.
---

# Skill: `crud-list-table-gen`

Bạn là chuyên gia về React UI. Nhiệm vụ là tạo component `Table[ModuleName].tsx` hoàn chỉnh với đầy đủ tính năng: list, search, pagination, select rows, delete.

---

## When to use this skill

- Khi tạo trang danh sách cho CRUD module.
- Khi cần chuẩn hóa bảng dữ liệu theo pattern của dự án.

---

## Output Files

| File            | Đường dẫn                                                                    |
| --------------- | ---------------------------------------------------------------------------- |
| Table component | `src/pages/authentication/[ModuleName]Page/components/Table[ModuleName].tsx` |
| List page       | `src/pages/authentication/[ModuleName]Page/List[ModuleName]Page.tsx`         |

---

## Step 1: Xác định columns

Trước khi tạo, xác định:

1. Các field và kiểu hiển thị cho từng column (text, number, boolean checkbox, date, badge trạng thái…)
2. Field nào dùng làm link đến trang Update (thường là `_id` hoặc `name`)
3. Có filter nâng cao không (filter theo status, date range…)

---

## Template: `Table[ModuleName].tsx`

```tsx
// src/pages/authentication/[ModuleName]Page/components/Table[ModuleName].tsx
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { IconEdit2Linear } from '~/components/Icons/IconEdit2Linear';
import { IconTrashLinear } from '~/components/Icons/IconTrashLinear';
import { ModalConfirmDelete } from '~/components/ModalConfirmDelete/ModalConfirmDelete';
import { TableList } from '~/components/TableList/TableList';
import { RouteConfig } from '~/constants/RouteConfig/RouteConfig';
import { useDelete } from '~/hooks/useCRUD/useDelete';
import { useListing } from '~/hooks/useCRUD/useListing';
import { [ModuleName] } from '~/models/[ModuleName]';
import { RecordsPerPage } from '~/services/_shared/constants/RecordsPerPage';
import { SearcherOperator } from '~/services/_shared/constants/SearcherOperator';
import { BaseQuery } from '~/services/_shared/types/BaseQuery';
import { delete[ModuleName]s } from '~/services/[ModuleName]/delete[ModuleName]';
import { get[ModuleName]s } from '~/services/[ModuleName]/get[ModuleName]s';
import { Checkbox, TableActions } from '~/shared/ReactComponent';

interface FormFilterValues extends BaseQuery {
  search: string;
}

export const Table[ModuleName] = () => {
  const { t } = useTranslation(['[ModuleName]Locales', 'CommonLocales']);
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    page,
    pageSize,
    totalRecords,
    searchParams,
    setSearchParams,
    handleGetList,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useListing<FormFilterValues, [ModuleName]>({
    defaultSearchParams: {
      page: 1,
      pageSize: RecordsPerPage,
      search: '',
    },
    getListService: async searchParams => {
      const response = await get[ModuleName]s({
        page: searchParams.page,
        pageSize: searchParams.pageSize ?? RecordsPerPage,
        sorter: {},
        searcher: {
          name: [{ operator: SearcherOperator.Contains, value: searchParams.search ?? '' }],
        },
      });
      return {
        data: response.data.hits,
        page: searchParams.page,
        pageSize: searchParams.pageSize ?? RecordsPerPage,
        totalPages: response.data.pagination.totalPages,
        totalRecords: response.data.pagination.totalRows,
      };
    },
  });

  const { handleCloseModalDelete, handleDelete, handleOpenModalDelete, isDeleting, isOpenModalDelete } =
    useDelete<[ModuleName]>({
      onSuccess: handleGetList,
      deleteService: async records => {
        await delete[ModuleName]s({ _ids: records });
        return;
      },
    });

  return (
    <>
      <TableList
        createAction={{
          onCreate: () => {
            return navigate(RouteConfig.Create[ModuleName]Page.path);
          },
        }}
        refreshAction={{
          onRefresh: handleGetList,
        }}
        paginationAction={{
          currentPage: page,
          pageSize,
          totalRecords,
          onPaginationChange: ({ page, pageSize }) => {
            setSearchParams(state => {
              return { ...state, page, pageSize };
            });
          },
        }}
        searchAction={{
          searchValue: searchParams.search ?? '',
          onSearch: value => {
            setSearchParams(state => {
              return { ...state, search: value, page: 1 };
            });
          },
        }}
        selectionAction={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        deleteAction={{
          onDelete: () => {
            handleOpenModalDelete(selectedRowKeys);
          },
        }}
        loading={isLoading}
        dataSource={data}
        columns={[
          {
            title: t('[ModuleName]Locales:_id'),
            width: 100,
            render: record => {
              return (
                <Link to={RouteConfig.Update[ModuleName]Page.getPath(record._id)} className="line-clamp-1">
                  {record._id}
                </Link>
              );
            },
          },
          // --- Text column ---
          {
            title: t('[ModuleName]Locales:name'),
            width: 250,
            render: record => {
              return record.name;
            },
          },
          // --- Boolean column ---
          {
            title: t('[ModuleName]Locales:isActive'),
            width: 80,
            align: 'center',
            render: record => {
              return <Checkbox checked={record.isActive} />;
            },
          },
          // --- Number column ---
          {
            title: t('[ModuleName]Locales:order'),
            width: 80,
            render: record => {
              return record.order;
            },
          },
          // --- Date column ---
          // {
          //   title: t('[ModuleName]Locales:createdAt'),
          //   width: 140,
          //   render: record => {
          //     return dayjs(record.createdAt).format('DD/MM/YYYY HH:mm');
          //   },
          // },
          // --- Status badge column ---
          // {
          //   title: t('[ModuleName]Locales:status'),
          //   width: 100,
          //   render: record => {
          //     const isActive = record.status === 'active';
          //     return <Tag color={isActive ? 'green' : 'red'}>{record.status}</Tag>;
          //   },
          // },
          {
            title: t('CommonLocales:actions'),
            width: 84,
            align: 'center',
            fixed: 'right',
            render: record => {
              return (
                <TableActions
                  items={[
                    {
                      key: '1',
                      label: t('CommonLocales:edit'),
                      className: 'font-medium',
                      icon: <IconEdit2Linear className="!text-base" />,
                      onClick: () => {
                        navigate(RouteConfig.Update[ModuleName]Page.getPath(record._id));
                      },
                    },
                    {
                      key: '3',
                      label: t('CommonLocales:delete'),
                      className: 'font-medium',
                      icon: <IconTrashLinear className="!text-base" />,
                      onClick: () => {
                        handleOpenModalDelete([record._id]);
                      },
                      danger: true,
                    },
                  ]}
                />
              );
            },
          },
        ]}
      />
      <ModalConfirmDelete
        onCancel={handleCloseModalDelete}
        onOk={handleDelete}
        loading={isDeleting}
        open={!!isOpenModalDelete}
      />
    </>
  );
};
```

---

## Template: `List[ModuleName]Page.tsx`

```tsx
// src/pages/authentication/[ModuleName]Page/List[ModuleName]Page.tsx
import { Table[ModuleName] } from './components/Table[ModuleName]';

export const List[ModuleName]Page = () => {
  return <Table[ModuleName] />;
};
```

---

## Column Type Reference

| Dữ liệu              | Cách render                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| ID (link đến detail) | `<Link to={RouteConfig.Update[X]Page.getPath(record._id)}>{record._id}</Link>` |
| Text thường          | `record.fieldName`                                                             |
| Boolean              | `<Checkbox checked={record.fieldName} />`                                      |
| Number               | `record.fieldName`                                                             |
| Date                 | `dayjs(record.fieldName).format('DD/MM/YYYY HH:mm')`                           |
| Enum/Status          | `<Tag color={...}>{record.status}</Tag>`                                       |
| Tiền tệ              | `record.amount.toLocaleString('vi-VN') + ' ₫'`                                 |
| Ảnh/Avatar           | `<Avatar src={record.imageUrl} />`                                             |
| Actions              | `<TableActions items={[...]} />` (luôn đặt cuối, `fixed: 'right'`)             |

---

## Searcher operator reference

```typescript
// Các operator tìm kiếm phổ biến
searcher: {
  name: [{ operator: SearcherOperator.Contains, value: searchParams.search ?? '' }],
  status: [{ operator: SearcherOperator.Equal, value: searchParams.status }],
  createdAt: [
    { operator: SearcherOperator.Gte, value: searchParams.fromDate },
    { operator: SearcherOperator.Lte, value: searchParams.toDate },
  ],
}
```

---

## Checklist trước khi hoàn thành

- [ ] Columns khớp với model type và i18n keys
- [ ] `RouteConfig.Create[ModuleName]Page.path` và `RouteConfig.Update[ModuleName]Page.getPath()` đã được khai báo
- [ ] `searcher` đang tìm kiếm đúng field (thường là `name` hoặc field tên)
- [ ] Actions column luôn `fixed: 'right'`
- [ ] Search reset `page: 1` khi user search (`setSearchParams` phải có `page: 1`)

---

## Coding Conventions

- **Không** import trực tiếp từ AntD, luôn dùng `~/shared/ReactComponent`.
- **Icons:** Dùng `~/components/Icons/Icon*.tsx` SVG icons, không dùng thư viện icon ngoài.
- **i18n:** Luôn dùng namespace: `['[ModuleName]Locales', 'CommonLocales']`.
