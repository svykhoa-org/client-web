---
name: crud-mutation-form-gen
description: Generates Mutation[ModuleName].tsx form component (shared for Create and Update) with FormMutation, FieldMapping, and MutationHeader.
---

# Skill: `crud-mutation-form-gen`

Bạn là chuyên gia về React Form. Nhiệm vụ là tạo component `Mutation[ModuleName].tsx` dùng chung cho cả **Create** và **Update**, tích hợp `FormMutation`, `FieldMapping`, `MutationHeader` và `BoxFields`.

> **Nguyên tắc cốt lõi:** Mọi field trong form **đều phải dùng `<FieldMapping>`** thay vì render trực tiếp Input/Select. `FieldMapping` là wrapper duy nhất kết nối giữa `formInstance` (React Hook Form) và các input component.

---

## When to use this skill

- Khi tạo form Create/Update cho CRUD module.
- Khi cần chuẩn hóa form theo pattern dự án (Zod + React Hook Form qua FormMutation).

---

## Output Files

| File                        | Đường dẫn                                                                       |
| --------------------------- | ------------------------------------------------------------------------------- |
| Mutation form               | `src/pages/authentication/[ModuleName]Page/components/Mutation[ModuleName].tsx` |
| Create page                 | `src/pages/authentication/[ModuleName]Page/Create[ModuleName]Page.tsx`          |
| Update page                 | `src/pages/authentication/[ModuleName]Page/Update[ModuleName]Page.tsx`          |
| SelectVariant mới (nếu cần) | `src/components/SelectVariants/Select[FieldName].tsx`                           |
| ExtraFields.ts (nếu cần)    | `src/components/FieldMapping/types/ExtraFields.ts`                              |
| FieldMapping.tsx (nếu cần)  | `src/components/FieldMapping/FieldMapping.tsx`                                  |

---

## Step 1: Phân tích Field → Xác định FieldMapping type

**Trước khi viết bất kỳ dòng code nào**, hãy đọc 2 file sau để biết những `type` nào đã có sẵn:

1. **`src/components/FieldMapping/types/NativeFields.ts`** — các input built-in (text, number, switch, date, upload…)
2. **`src/components/FieldMapping/types/ExtraFields.ts`** — tất cả SelectVariant đã đăng ký (enum selects, API selects)

Sau khi đọc xong, với **mỗi field** trong model, quyết định:

```
┌─ Đã có type phù hợp trong NativeFields.ts hoặc ExtraFields.ts?
│   YES → Dùng type đó trong <FieldMapping type="..."> — KHÔNG tạo mới
│   NO  → Xác định loại Select cần tạo:
│         ├── Enum (danh sách cố định) → Tạo theo Step 2A
│         ├── API chọn 1 (FK → _id)   → Tạo theo Step 2B
│         └── API chọn nhiều (string[]) → Tạo theo Step 2C
└─ Sau khi tạo → Đăng ký vào ExtraFields.ts + FieldMapping.tsx (Step 3)
```

> ⚠️ **Không được đoán mò tên type.** Phải đọc file trước, lấy đúng string `type` từ định nghĩa interface trong ExtraFields.ts (ví dụ `type: 'selectGender'` → dùng `type="selectGender"`).

---

## Step 2A: Tạo SelectVariant — Enum Single Select

Dùng khi field là **enum** (danh sách cố định trong code, không gọi API).

**Pattern:** `SelectSingle` + `values(EnumType).map()`

```tsx
// src/components/SelectVariants/Select[FieldName].tsx
import { values } from 'ramda';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { [EnumType], get[EnumType]MappingToLabels } from '~/models/CommonEnum/[EnumType]';
import { SelectSingle, SelectSingleProps } from '~/shared/ReactComponent';

export interface Select[FieldName]Props {
  [fieldName]?: [EnumType];
  onChange?: SelectSingleProps<[EnumType]>['onChange'];
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  placeholder: string;
}

export const Select[FieldName] = ({
  [fieldName],
  disabled,
  allowClear = true,
  onChange,
  className,
  placeholder,
}: Select[FieldName]Props) => {
  const { t } = useTranslation(['CommonEnumLocales']);

  const [FieldName]ToLabels = useMemo(() => {
    return get[EnumType]MappingToLabels(t);
  }, [t]);

  return (
    <SelectSingle
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      className={className}
      value={[fieldName]}
      onChange={onChange}
      options={values([EnumType]).map(item => ({
        label: [FieldName]ToLabels[item],
        searchValue: [FieldName]ToLabels[item],
        rawData: item,
        value: item,
      }))}
    />
  );
};
```

**Ví dụ thực tế (SelectGender):**

```tsx
// SelectSingle với Gender enum
// gender?: Gender → giá trị là enum string (ví dụ: 'male', 'female')
options={values(Gender).map(item => ({
  label: GenderToLabels[item],
  searchValue: GenderToLabels[item],
  rawData: item,
  value: item,
}))}
```

---

## Step 2B: Tạo SelectVariant — API Single Select (chọn 1 từ API)

Dùng khi field là **foreign key `_id`** — chọn 1 record từ danh sách API.

**Pattern:** `SelectSingleDecouplingWithCreatable` + `service={async (...) => response.data.hits}`

```tsx
// src/components/SelectVariants/Select[ModuleName].tsx
import {
  SelectSingleDecouplingWithCreatable,
  SelectSingleDecouplingWithCreatableProps,
} from '../SelectDecouplingWithCreatable';
import { [RelatedModel] } from '~/models/[RelatedModel]';
import { SearcherOperator } from '~/services/_shared/constants/SearcherOperator';
import { get[RelatedModel]s } from '~/services/[RelatedModel]/get[RelatedModel]s';

export interface Select[ModuleName]Props {
  [fieldId]?: [RelatedModel]['_id'];   // Prop nhận _id (string)
  onChange?: SelectSingleDecouplingWithCreatableProps<[RelatedModel]>['onChange'];
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  placeholder: string;
}

export const Select[ModuleName] = ({
  [fieldId],
  disabled,
  allowClear = true,
  onChange,
  className,
  placeholder,
}: Select[ModuleName]Props) => {
  return (
    <SelectSingleDecouplingWithCreatable
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      className={className}
      transformToOption={model => ({
        label: model.name,   // Field hiển thị label (thường là name, fullname, title)
        value: model._id,
        rawData: model,
      })}
      searchType="api"
      service={async ({ currentValue, search }) => {
        const response = await get[RelatedModel]s({
          page: 1,
          pageSize: 30,
          sorter: {},
          searcher: {
            name: { value: search, operator: SearcherOperator.Contains },
            _id: { value: currentValue, operator: SearcherOperator.In },
          },
        });
        return response.data.hits;
      }}
      value={[fieldId]}
      onChange={onChange}
    />
  );
};
```

**Ví dụ thực tế (SelectConfigOffice):**

```tsx
// officeId?: ConfigOffice['_id'] → single select, trả về _id string
// transformToOption: model.name → label hiển thị
// currentValue: giá trị hiện tại để pre-load khi edit
```

---

## Step 2C: Tạo SelectVariant — API Multiple Select (chọn nhiều từ API)

Dùng khi field là **mảng foreign key `string[]`** — chọn nhiều records từ API.

**Pattern:** `SelectMultipleDecouplingWithCreatable` + `value={[field] = []}` + `onChange` return `string[]`

```tsx
// src/components/SelectVariants/Select[ModuleName]s.tsx  ← Tên file thêm 's' hoặc 'Multiple'
import { ZodObject } from 'zod';
import { SelectMultipleDecouplingWithCreatable } from '../SelectDecouplingWithCreatable';
import { get[RelatedModel]s } from '~/services/[RelatedModel]/get[RelatedModel]s';
import { SelectMultipleProps } from '~/shared/ReactComponent';
import { [RelatedModel] } from '~/models/[RelatedModel]';
import { SearcherOperator } from '~/services/_shared/constants/SearcherOperator';

export interface Select[ModuleName]sProps {
  [fieldIds]?: string[];   // Mảng _id strings
  onChange?: SelectMultipleProps<string>['onChange'];
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  placeholder: string;
}

export const Select[ModuleName]s = ({
  [fieldIds] = [],
  disabled,
  allowClear = true,
  onChange,
  className,
  placeholder,
}: Select[ModuleName]sProps) => {
  return (
    <SelectMultipleDecouplingWithCreatable<[RelatedModel], ZodObject<any>>
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      className={className}
      transformToOption={model => ({
        label: model.name,
        value: model._id,
        rawData: model,
      })}
      searchType="api"
      service={async ({ search }) => {
        const response = await get[RelatedModel]s({
          page: 1,
          pageSize: 30,
          sorter: {},
          searcher: {
            name: { value: search || undefined, operator: SearcherOperator.Contains },
          },
        });
        return response.data.hits;
      }}
      value={[fieldIds]}
      onChange={(newValues, options) => {
        if (onChange) {
          onChange(newValues, options);
        }
      }}
    />
  );
};
```

---

## Step 3: Đăng ký SelectVariant mới vào FieldMapping

Sau khi tạo component mới, phải đăng ký vào **3 chỗ**:

### 3.1 Thêm vào `ExtraFields.ts`

```typescript
// src/components/FieldMapping/types/ExtraFields.ts

// Thêm import
import { Select[ModuleName]Props } from '~/components/SelectVariants/Select[ModuleName]';

// Thêm interface
export interface Select[ModuleName]Field extends Pick<Select[ModuleName]Props, 'onChange'> {
  type: 'select[ModuleName]';
  value?: Select[ModuleName]Props['[fieldId]'];  // Tên prop nhận giá trị trong component
  InputProps?: Omit<Select[ModuleName]Props, 'onChange' | 'disabled' | '[fieldId]'>;
}

// Thêm vào union type ExtraFields (cuối file)
export type ExtraFields =
  | ...existing_fields...
  | Select[ModuleName]Field;  // ← THÊM VÀO ĐÂY
```

### 3.2 Thêm vào `FieldMapping.tsx`

```tsx
// src/components/FieldMapping/FieldMapping.tsx

// 1. Thêm import ở đầu file
import { Select[ModuleName] } from '../SelectVariants/Select[ModuleName]';

// 2. Thêm case vào extraFieldsMapping object
const extraFieldsMapping: Record<ExtraFields['type'], () => ReactNode> = useMemo(() => {
  return {
    // ...existing cases...
    select[ModuleName]: () => {
      return (
        <Select[ModuleName]
          {...InputProps}
          {...props}
          placeholder={label}
          [fieldId]={mergedValue}         // Tên prop đúng của component
          onChange={mergedOnChange}
        />
      );
    },
  };
}, [label, name, props]);
```

---

## Step 4: Template `Mutation[ModuleName].tsx`

```tsx
// src/pages/authentication/[ModuleName]Page/components/Mutation[ModuleName].tsx
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useDetail } from '~/hooks/useCRUD/useDetail';
import { [ModuleName] } from '~/models/[ModuleName]';
import { get[ModuleName] } from '~/services/[ModuleName]/get[ModuleName]';
import { v4 } from 'uuid';
import { Button, Result, Spin } from '~/shared/ReactComponent';
import { RouteConfig } from '~/constants/RouteConfig/RouteConfig';
import { FormMutation } from '~/components/FormMutation/FormMutation';
import { getFormMutation[ModuleName]Schema } from '../schemas/mutation[ModuleName]Schema';
import { update[ModuleName] } from '~/services/[ModuleName]/update[ModuleName]';
import { create[ModuleName] } from '~/services/[ModuleName]/create[ModuleName]';
import { MutationHeader } from '~/components/MutationHeader/MutationHeader';
import { BoxFields } from '~/components/BoxFields/BoxFields';
import { FieldMapping } from '~/components/FieldMapping/FieldMapping';

interface Props {
  _id: [ModuleName]['_id'] | undefined;
}

export const Mutation[ModuleName]: FC<Props> = ({ _id }) => {
  const { t } = useTranslation(['[ModuleName]Locales', 'CommonLocales']);
  const navigate = useNavigate();

  const { isFetchingDetail, handleGetDetail, recordState } = useDetail<[ModuleName]>({
    getDetail: !_id
      ? undefined
      : async () => {
          const response = await get[ModuleName]({ data: { _id } });
          return response.data;
        },
  });

  useEffect(() => {
    if (_id) {
      handleGetDetail(_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const formUid = useMemo(() => v4(), []);

  if (_id && !isFetchingDetail && !recordState) {
    return (
      <Result
        status="404"
        title={t('CommonLocales:not_found_record')}
        extra={
          <Button color="primary" onClick={() => navigate(RouteConfig.List[ModuleName]Page.path)}>
            {t('CommonLocales:back_to_list')}
          </Button>
        }
      />
    );
  }

  return (
    <Spin spinning={!!_id && isFetchingDetail}>
      <FormMutation
        uid={formUid}
        zodSchema={getFormMutation[ModuleName]Schema(t)}
        mutation={async formValues => {
          if (_id) {
            const response = await update[ModuleName]({ data: { ...formValues, _id } });
            return response.data;
          }
          const response = await create[ModuleName]({ data: formValues });
          return response?.data;
        }}
        onSuccess={() => navigate(RouteConfig.List[ModuleName]Page.path)}
        defaultValues={{
          // Bind từng field: recordState?.[field] ?? [defaultValue]
          name: recordState?.name ?? undefined,
          isActive: recordState?.isActive ?? false,
          // ...các field khác
        }}
      >
        {({ disabled, formInstance, isSubmitting }) => (
          <div>
            <div className="mb-4">
              <MutationHeader
                title={undefined}
                loading={isSubmitting}
                breadcrumbItems={[
                  {
                    title: (
                      <Link to={RouteConfig.List[ModuleName]Page.path}>
                        {t('[ModuleName]Locales:[moduleName]')}
                      </Link>
                    )
                  },
                  {
                    title: t(_id ? 'CommonLocales:update_title' : 'CommonLocales:create_title', {
                      name: t('[ModuleName]Locales:[moduleName]').toLowerCase(),
                    }),
                  },
                ]}
                cancelButtonProps={{ onClick: () => navigate(RouteConfig.List[ModuleName]Page.path) }}
                okButtonProps={{
                  children: _id ? undefined : t('CommonLocales:create'),
                  htmlType: 'submit',
                  form: formUid,
                }}
              />
            </div>
            <BoxFields>
              <div className="mb-4 grid grid-cols-1 gap-4 desktop:grid-cols-3">
                {/* Thêm FieldMapping cho từng field theo type đã phân tích ở Step 1 */}
              </div>
            </BoxFields>
          </div>
        )}
      </FormMutation>
    </Spin>
  );
};
```

---

## Step 5: Kiểm tra FieldMapping types hiện có

> Đây là bước **bắt buộc** trước khi dùng hoặc tạo bất kỳ SelectVariant nào.

**Đọc 2 file sau và kiểm tra toàn bộ danh sách `type` đã có:**

```
src/components/FieldMapping/types/NativeFields.ts   — built-in inputs
src/components/FieldMapping/types/ExtraFields.ts    — tất cả SelectVariants đã đăng ký
```

Lấy **chính xác** string `type` từ định nghĩa interface (trường `type: '...'`), rồi dùng trong `<FieldMapping type="...">`. Không đoán, không tự đặt tên.

---

## Step 6: Cú pháp FieldMapping đầy đủ

```tsx
{/* Native field - text */}
<FieldMapping
  withRequiredMark     {/* Hiển thị dấu * nếu field required */}
  type="input"
  name="name"          {/* Phải khớp với key trong Zod schema */}
  label={t('[NS]:name')}
  formInstance={formInstance}
  disabled={disabled}
/>

{/* Native field - number với InputProps */}
<FieldMapping
  withRequiredMark
  type="inputNumber"
  name="amount"
  label={t('[NS]:amount')}
  formInstance={formInstance}
  disabled={disabled}
  InputProps={{ min: 0, precision: 2 }}
/>

{/* Extra field - enum select */}
<FieldMapping
  withRequiredMark
  type="selectGender"
  name="gender"
  label={t('[NS]:gender')}
  formInstance={formInstance}
  disabled={disabled}
/>

{/* Extra field - API single select */}
<FieldMapping
  withRequiredMark
  type="selectConfigOffice"
  name="officeId"
  label={t('[NS]:officeId')}
  formInstance={formInstance}
  disabled={disabled}
/>

{/* Extra field - API multi select */}
<FieldMapping
  type="selectEmployees"
  name="employeeIds"
  label={t('[NS]:employeeIds')}
  formInstance={formInstance}
  disabled={disabled}
/>

{/* Upload media */}
<FieldMapping
  type="uploadSingleMedia"
  name="avatarId"
  label={t('[NS]:avatar')}
  formInstance={formInstance}
  disabled={disabled}
/>
```

---

## Step 7: `defaultValues` Mapping Guide

`defaultValues` phải khớp **chính xác** với Zod schema fields:

```tsx
defaultValues={{
  name: recordState?.name ?? undefined,          // string required → ?? undefined
  description: recordState?.description ?? '',   // string optional → ?? ''
  amount: recordState?.amount ?? 0,              // number → ?? 0
  isActive: recordState?.isActive ?? false,      // boolean → ?? false
  officeId: recordState?.officeId ?? undefined,  // foreign key _id → ?? undefined
  employeeIds: recordState?.employeeIds ?? [],   // string[] → ?? []
  startDate: recordState?.startDate ?? undefined, // date string → ?? undefined
  gender: recordState?.gender ?? undefined,      // enum → ?? undefined
  avatarId: recordState?.avatarId ?? undefined,  // media id → ?? undefined
}}
```

---

## Template: `Create[ModuleName]Page.tsx`

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

## Template: `Update[ModuleName]Page.tsx`

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

## Pattern: Form nhiều Step (Multi-Step Form)

Dùng khi form có > 5 field và có thể nhóm thành các nhóm logic rõ ràng (thông tin cơ bản / chi tiết / cài đặt…).

### Tổng quan kiến trúc

```
Mutation[ModuleName].tsx
  └── FormMutation (zodSchema = nested step schema)
        ├── MutationHeader (Cancel / Save — luôn hiển thị)
        ├── Tabs<[ModuleName]FormStep>  (controlled-state, không bị reset khi chuyển tab)
        │     ├── Step1: BoxFields + FieldMapping...
        │     ├── Step2: BoxFields + FieldMapping...
        │     └── Step3: BoxFields + FieldMapping...
        └── Logic validate → auto redirect về step lỗi
```

---

### 1. Định nghĩa enum Step

Tạo enum trong cùng file `Mutation[ModuleName].tsx` hoặc tách ra `[ModuleName]FormStep.ts`:

```tsx
// Enum step — dùng làm `key` của Tabs
export enum [ModuleName]FormStep {
  Step1 = 'step1',
  Step2 = 'step2',
  Step3 = 'step3',
}
```

---

### 2. Zod Schema dạng nested step

Mỗi step là 1 object lồng trong schema gốc. Agent **phải nhóm field theo logic nghiệp vụ**:

```ts
// src/pages/authentication/[ModuleName]Page/schemas/mutation[ModuleName]Schema.ts
import { z } from 'zod';

export const getFormMutation[ModuleName]Schema = (t: TFunction) =>
  z.object({
    [ModuleName]FormStep.Step1: z.object({
      name: z.string().min(1, t('[NS]:required_name')),
      code: z.string().min(1, t('[NS]:required_code')),
    }),
    [ModuleName]FormStep.Step2: z.object({
      officeId: z.string().min(1, t('[NS]:required_office')),
      departmentId: z.string().optional(),
    }),
    [ModuleName]FormStep.Step3: z.object({
      isActive: z.boolean(),
      note: z.string().optional(),
    }),
  });

// Types derived from schema
export type FormMutation[ModuleName]Value =
  z.infer<ReturnType<typeof getFormMutation[ModuleName]Schema>>;
```

> **Quy ước:** Key của object phải trùng với giá trị enum (`'step1'`, `'step2'`, `'step3'`).
> **FieldMapping `name`** khi dùng nested schema: `name="[ModuleName]FormStep.Step1.fieldName"` — RHF tự resolve path dạng dot notation.

---

### 3. Template `Mutation[ModuleName].tsx` (Multi-Step)

```tsx
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { Button, Result, Spin, Tabs } from '~/shared/ReactComponent';
import { useDetail } from '~/hooks/useCRUD/useDetail';
import { [ModuleName] } from '~/models/[ModuleName]';
import { get[ModuleName] } from '~/services/[ModuleName]/get[ModuleName]';
import { create[ModuleName] } from '~/services/[ModuleName]/create[ModuleName]';
import { update[ModuleName] } from '~/services/[ModuleName]/update[ModuleName]';
import { RouteConfig } from '~/constants/RouteConfig/RouteConfig';
import { FormMutation } from '~/components/FormMutation/FormMutation';
import { MutationHeader } from '~/components/MutationHeader/MutationHeader';
import { BoxFields } from '~/components/BoxFields/BoxFields';
import { FieldMapping } from '~/components/FieldMapping/FieldMapping';
import { getFormMutation[ModuleName]Schema } from '../schemas/mutation[ModuleName]Schema';

// ─── Step enum ────────────────────────────────────────────────────────────────
export enum [ModuleName]FormStep {
  Step1 = 'step1',
  Step2 = 'step2',
  Step3 = 'step3',
}

// ─── Step label map ───────────────────────────────────────────────────────────
const STEP_LABELS: Record<[ModuleName]FormStep, string> = {
  [[ModuleName]FormStep.Step1]: 'Thông tin cơ bản',
  [[ModuleName]FormStep.Step2]: 'Thông tin chi tiết',
  [[ModuleName]FormStep.Step3]: 'Cài đặt',
};

// ─── Helper: tìm step đầu tiên có lỗi ────────────────────────────────────────
const getFirstStepWithError = (
  errors: Record<string, unknown>,
): [ModuleName]FormStep | undefined => {
  const stepOrder: [ModuleName]FormStep[] = [
    [ModuleName]FormStep.Step1,
    [ModuleName]FormStep.Step2,
    [ModuleName]FormStep.Step3,
  ];
  return stepOrder.find(step => !!errors[step]);
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  _id: [ModuleName]['_id'] | undefined;
}

export const Mutation[ModuleName]: FC<Props> = ({ _id }) => {
  const { t } = useTranslation(['[ModuleName]Locales', 'CommonLocales']);
  const navigate = useNavigate();
  const formUid = useMemo(() => v4(), []);

  // Active tab — controlled state
  const [activeStep, setActiveStep] = useState<[ModuleName]FormStep>([ModuleName]FormStep.Step1);

  // Fetch detail for Update mode
  const { isFetchingDetail, handleGetDetail, recordState } = useDetail<[ModuleName]>({
    getDetail: !_id
      ? undefined
      : async () => {
          const response = await get[ModuleName]({ data: { _id } });
          return response.data;
        },
  });

  useEffect(() => {
    if (_id) {
      handleGetDetail(_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  // 404 guard
  if (_id && !isFetchingDetail && !recordState) {
    return (
      <Result
        status="404"
        title={t('CommonLocales:not_found_record')}
        extra={
          <Button color="primary" onClick={() => navigate(RouteConfig.List[ModuleName]Page.path)}>
            {t('CommonLocales:back_to_list')}
          </Button>
        }
      />
    );
  }

  return (
    <Spin spinning={!!_id && isFetchingDetail}>
      <FormMutation
        uid={formUid}
        zodSchema={getFormMutation[ModuleName]Schema(t)}
        defaultValues={{
          [[ModuleName]FormStep.Step1]: {
            name: recordState?.name ?? undefined,
            code: recordState?.code ?? undefined,
          },
          [[ModuleName]FormStep.Step2]: {
            officeId: recordState?.officeId ?? undefined,
          },
          [[ModuleName]FormStep.Step3]: {
            isActive: recordState?.isActive ?? false,
            note: recordState?.note ?? '',
          },
        }}
        mutation={async formValues => {
          // Flatten nested step values trước khi gửi API
          const payload = {
            ...formValues[[ModuleName]FormStep.Step1],
            ...formValues[[ModuleName]FormStep.Step2],
            ...formValues[[ModuleName]FormStep.Step3],
          };
          if (_id) {
            const response = await update[ModuleName]({ data: { ...payload, _id } });
            return response.data;
          }
          const response = await create[ModuleName]({ data: payload });
          return response?.data;
        }}
        onSuccess={() => navigate(RouteConfig.List[ModuleName]Page.path)}
        // ── Validate errors → redirect về step có lỗi ──────────────────────
        onInvalidSubmit={errors => {
          const firstErrorStep = getFirstStepWithError(errors as Record<string, unknown>);
          if (firstErrorStep && firstErrorStep !== activeStep) {
            setActiveStep(firstErrorStep);
          }
        }}
      >
        {({ disabled, formInstance, isSubmitting }) => (
          <div>
            {/* Header: luôn hiển thị, gắn form uid để submit */}
            <div className="mb-4">
              <MutationHeader
                title={undefined}
                loading={isSubmitting}
                breadcrumbItems={[
                  {
                    title: (
                      <Link to={RouteConfig.List[ModuleName]Page.path}>
                        {t('[ModuleName]Locales:[moduleName]')}
                      </Link>
                    )
                  },
                  {
                    title: t(_id ? 'CommonLocales:update_title' : 'CommonLocales:create_title', {
                      name: t('[ModuleName]Locales:[moduleName]').toLowerCase(),
                    }),
                  },
                ]}
                cancelButtonProps={{ onClick: () => navigate(RouteConfig.List[ModuleName]Page.path) }}
                okButtonProps={{
                  children: _id ? undefined : t('CommonLocales:create'),
                  htmlType: 'submit',
                  form: formUid,
                }}
              />
            </div>

            {/* Tabs — controlled-state để không bị reset khi chuyển tab */}
            <Tabs<[ModuleName]FormStep>
              valueVariant="controlled-state"
              tabActive={activeStep}
              onChange={setActiveStep}
              tabs={[
                {
                  key: [ModuleName]FormStep.Step1,
                  label: STEP_LABELS[[ModuleName]FormStep.Step1],
                  children: (
                    <BoxFields>
                      <div className="mb-4 grid grid-cols-1 gap-4 desktop:grid-cols-3">
                        <FieldMapping
                          withRequiredMark
                          type="input"
                          name={`${[ModuleName]FormStep.Step1}.name`}
                          label={t('[ModuleName]Locales:name')}
                          formInstance={formInstance}
                          disabled={disabled}
                        />
                        {/* ...thêm FieldMapping cho các field của Step 1 */}
                      </div>
                    </BoxFields>
                  ),
                },
                {
                  key: [ModuleName]FormStep.Step2,
                  label: STEP_LABELS[[ModuleName]FormStep.Step2],
                  children: (
                    <BoxFields>
                      <div className="mb-4 grid grid-cols-1 gap-4 desktop:grid-cols-3">
                        <FieldMapping
                          withRequiredMark
                          type="selectConfigOffice"
                          name={`${[ModuleName]FormStep.Step2}.officeId`}
                          label={t('[ModuleName]Locales:officeId')}
                          formInstance={formInstance}
                          disabled={disabled}
                        />
                        {/* ...thêm FieldMapping cho các field của Step 2 */}
                      </div>
                    </BoxFields>
                  ),
                },
                {
                  key: [ModuleName]FormStep.Step3,
                  label: STEP_LABELS[[ModuleName]FormStep.Step3],
                  children: (
                    <BoxFields>
                      <div className="mb-4 grid grid-cols-1 gap-4 desktop:grid-cols-3">
                        <FieldMapping
                          type="switch"
                          name={`${[ModuleName]FormStep.Step3}.isActive`}
                          label={t('[ModuleName]Locales:isActive')}
                          formInstance={formInstance}
                          disabled={disabled}
                        />
                        {/* ...thêm FieldMapping cho các field của Step 3 */}
                      </div>
                    </BoxFields>
                  ),
                },
              ]}
            />
          </div>
        )}
      </FormMutation>
    </Spin>
  );
};
```

---

### 4. Giải thích các điểm quan trọng

| Điểm                                           | Giải thích                                                                                                                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `valueVariant="controlled-state"`              | Tab **không tự reset** khi `tabActive` thay đổi từ bên ngoài (ví dụ khi redirect về step lỗi). Bắt buộc dùng với pattern này.                                           |
| `destroyInactiveTabPane` (mặc định trong Tabs) | Tab không active **vẫn mount** nhưng ẩn — RHF vẫn giữ giá trị form.                                                                                                     |
| `onInvalidSubmit`                              | Callback của `FormMutation` khi submit thất bại — nhận `errors` object từ RHF. Dùng `getFirstStepWithError()` để xác định step nào có lỗi đầu tiên rồi `setActiveStep`. |
| `name` với nested path                         | Dùng template literal: `` `${[ModuleName]FormStep.Step1}.fieldName` `` → đảm bảo type-safe với Zod schema.                                                              |
| Flatten payload trong `mutation`               | Spread tất cả step objects trước khi gửi API: `{ ...step1, ...step2, ...step3 }`.                                                                                       |
| `getFirstStepWithError`                        | Helper function kiểm tra `errors[step]` theo thứ tự — chuyển tab về **step đầu tiên** có lỗi, không phải step cuối.                                                     |

---

### 5. Checklist bổ sung cho Multi-Step Form

- [ ] Enum step key khớp với key trong Zod schema object
- [ ] `name` của mỗi `FieldMapping` dùng template literal với enum (không hard-code string)
- [ ] `valueVariant="controlled-state"` được set trên `<Tabs>`
- [ ] `onInvalidSubmit` redirect về **step đầu tiên** có lỗi (không phải step cuối)
- [ ] `defaultValues` có đầy đủ nested step keys
- [ ] Payload flatten đúng trước khi gọi service

---

## Checklist trước khi hoàn thành

- [ ] Mọi field đều dùng `<FieldMapping>` (không render Input/Select thủ công)
- [ ] Đã kiểm tra ExtraFields.ts trước khi tạo SelectVariant mới
- [ ] SelectVariant mới đã được đăng ký vào ExtraFields.ts và FieldMapping.tsx
- [ ] `withRequiredMark` có trên tất cả field required trong Zod schema
- [ ] `defaultValues` khớp chính xác với Zod schema
- [ ] `formUid` pass sang `MutationHeader.okButtonProps.form`
- [ ] 404 Result có nút back_to_list
- [ ] ESLint comment sau useEffect deps array
- [ ] Không có TypeScript error (đỏ)

---

## Coding Conventions

- **1 component** `Mutation[ModuleName]` cho cả Create + Update.
- **Không** dùng `useState` cho form values — `FormMutation` + RHF quản lý.
- **Không** import trực tiếp từ `antd` — dùng `~/shared/ReactComponent`.
- Named export, không default export.
