import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
  ClearOutlined,
  FileSearchOutlined,
  FilterOutlined,
  HomeOutlined,
  RocketOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Input,
  Pagination,
  Rate,
  Row,
  Select,
  Skeleton,
  Spin,
  Tag,
  Typography,
} from 'antd';

import useDebounce from '@/hooks/useDebounce/index';
// import { useDebounce } from '@/hooks/useDebounce';
import { useListResource } from '@/lib/tanstack-query/hooks/useResourceQueries';
import type { Resource } from '@/models/Resource';

import { ResourceItem } from './components/ResourceItem';

const { Title, Text } = Typography;

// Filter types
interface ResourceFilters {
  search: string;
  categoryIds: string[];
  isFree?: boolean;
  minRating?: number;
  fileTypes: string[];
  priceRange: [number, number] | null;
}

type SortOption = 'newest' | 'bestselling' | 'price_asc' | 'price_desc' | 'rating';

// Mock categories - nên lấy từ API
const mockCategories = [
  { _id: '1', name: 'Y Khoa Tổng Quát', count: 45 },
  { _id: '2', name: 'Nhi Khoa', count: 32 },
  { _id: '3', name: 'Sản Phụ Khoa', count: 28 },
  { _id: '4', name: 'Tim Mạch', count: 25 },
  { _id: '5', name: 'Thần Kinh', count: 22 },
  { _id: '6', name: 'Da Liễu', count: 18 },
  { _id: '7', name: 'Mắt', count: 15 },
  { _id: '8', name: 'Tai Mũi Họng', count: 12 },
];

const mockFileTypes = [
  { value: 'PDF', label: 'PDF', count: 120 },
  { value: 'DOCX', label: 'Word (DOCX)', count: 45 },
  { value: 'PPTX', label: 'PowerPoint (PPTX)', count: 30 },
  { value: 'XLSX', label: 'Excel (XLSX)', count: 15 },
];

export const ListResourcePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortParam = (searchParams.get('sort') as SortOption) || 'newest';

  // Filter states
  const [filters, setFilters] = useState<ResourceFilters>({
    search: searchParams.get('q') || '',
    categoryIds: [],
    isFree: undefined,
    minRating: undefined,
    fileTypes: [],
    priceRange: null,
  });

  const [sort, setSort] = useState<SortOption>(sortParam);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500);

  // API params
  const pageSize = 12;

  const { data, isLoading, isFetching } = useListResource({
    page,
    pageSize,
    search: debouncedSearch,
    categoryId: filters.categoryIds[0],
    isFree: filters.isFree,
    sort,
  });

  const { resources = [], pagination } = data || {};

  // Featured resources (top 3 bestselling) - mock data
  const featuredResources: Resource[] = resources.slice(0, 3);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryIds: [],
      isFree: undefined,
      minRating: undefined,
      fileTypes: [],
      priceRange: null,
    });
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    params.delete('category');
    params.delete('free');
    params.set('page', '1');
    setSearchParams(params);
  };

  const hasActiveFilters = useCallback(() => {
    return (
      filters.search ||
      filters.categoryIds.length > 0 ||
      filters.isFree !== undefined ||
      filters.minRating !== undefined ||
      filters.fileTypes.length > 0
    );
  }, [filters]);

  // Render filter panel
  const renderFilterPanel = () => (
    <Card
      size="small"
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FilterOutlined /> Bộ lọc
          </span>
          {hasActiveFilters() && (
            <Button type="link" size="small" onClick={handleClearFilters} icon={<ClearOutlined />}>
              Xóa tất cả
            </Button>
          )}
        </div>
      }
      bordered={false}
      className="shadow-sm"
    >
      {/* Free/Paid Filter */}
      <div className="mb-6">
        <Text strong className="mb-2 block text-sm">
          Loại tài liệu
        </Text>
        <Checkbox.Group
          value={filters.isFree !== undefined ? [filters.isFree ? 'free' : 'paid'] : []}
          onChange={values => {
            const isFree = values.includes('free') ? true : values.includes('paid') ? false : undefined;
            setFilters(prev => ({ ...prev, isFree }));
          }}
        >
          <div className="flex flex-col gap-2">
            <Checkbox value="free">
              <span className="flex items-center gap-2">
                Miễn phí{' '}
                <Tag color="green" className="m-0">
                  Free
                </Tag>
              </span>
            </Checkbox>
            <Checkbox value="paid">
              <span className="flex items-center gap-2">
                Có phí{' '}
                <Tag color="blue" className="m-0">
                  Premium
                </Tag>
              </span>
            </Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <Text strong className="mb-2 block text-sm">
          Đánh giá
        </Text>
        <div className="space-y-2">
          {[4, 3, 2].map(rating => (
            <div
              key={rating}
              className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors ${
                filters.minRating === rating ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  minRating: prev.minRating === rating ? undefined : rating,
                }))
              }
            >
              <Rate
                disabled
                defaultValue={rating}
                className="text-xs"
                character={({ value }) =>
                  value && value <= (filters.minRating || 0) ? (
                    <StarFilled className="text-yellow-400" />
                  ) : (
                    <StarFilled className="text-gray-300" />
                  )
                }
              />
              <Text className="text-sm text-gray-500">{rating === 4 ? '4+ sao' : `${rating}+ sao`}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* File Type Filter */}
      <div className="mb-6">
        <Text strong className="mb-2 block text-sm">
          Định dạng file
        </Text>
        <Checkbox.Group
          value={filters.fileTypes}
          onChange={values => setFilters(prev => ({ ...prev, fileTypes: values as string[] }))}
        >
          <div className="flex flex-col gap-2">
            {mockFileTypes.map(type => (
              <Checkbox key={type.value} value={type.value}>
                <span className="flex items-center justify-between">
                  <span>{type.label}</span>
                  <Text className="text-xs text-gray-400">({type.count})</Text>
                </span>
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>

      {/* Categories */}
      <div>
        <Text strong className="mb-2 block text-sm">
          Chuyên khoa
        </Text>
        <Checkbox.Group
          value={filters.categoryIds}
          onChange={values => setFilters(prev => ({ ...prev, categoryIds: values as string[] }))}
        >
          <div className="flex flex-col gap-2">
            {mockCategories.map(cat => (
              <Checkbox key={cat._id} value={cat._id}>
                <span className="flex items-center justify-between">
                  <span>{cat.name}</span>
                  <Text className="text-xs text-gray-400">({cat.count})</Text>
                </span>
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </Card>
  );

  if (isLoading && !resources.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" tip="Đang tải tài liệu..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <HomeOutlined className="cursor-pointer hover:text-blue-600" />
          <span className="text-gray-300">/</span>
          <span className="cursor-pointer hover:text-blue-600">Trang chủ</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600">Kho tài liệu</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="mb-2 flex items-center gap-3 !text-blue-600">
            <FileSearchOutlined />
            Kho Tài Liệu Y Khoa
          </Title>
          <Text className="text-gray-500">
            Khám phá hàng ngàn tài liệu y khoa chất lượng cao từ các chuyên gia hàng đầu
          </Text>
        </div>

        {/* Featured Section - Only show when no filters */}
        {!hasActiveFilters() && featuredResources.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <RocketOutlined className="text-orange-500" />
              <Title level={4} className="!m-0">
                Tài liệu nổi bật
              </Title>
            </div>
            <Row gutter={[16, 16]}>
              {featuredResources.map(resource => (
                <Col xs={24} sm={12} md={8} lg={6} key={resource._id || resource.id}>
                  <ResourceItem resource={resource} isFeatured />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Search & Filter Bar */}
        <Card bordered={false} className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Input
                placeholder="Tìm kiếm tài liệu y khoa..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={filters.search}
                onChange={handleSearchChange}
                allowClear
                size="large"
                className="rounded-lg"
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                value={sort}
                onChange={handleSortChange}
                size="large"
                className="w-full rounded-lg"
                suffixIcon={<SortAscendingOutlined />}
              >
                <Select.Option value="newest">🕐 Mới nhất</Select.Option>
                <Select.Option value="bestselling">🔥 Bán chạy</Select.Option>
                <Select.Option value="price_asc">💰 Giá thấp → cao</Select.Option>
                <Select.Option value="price_desc">💎 Giá cao → thấp</Select.Option>
                <Select.Option value="rating">⭐ Đánh giá cao</Select.Option>
              </Select>
            </Col>
            <Col xs={12} md={6}>
              <Button
                icon={<FilterOutlined />}
                size="large"
                block
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-lg ${showFilters ? 'bg-blue-100 text-blue-600' : ''}`}
              >
                {showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc'}
              </Button>
            </Col>
          </Row>

          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.search && (
                <Tag closable onClose={() => setFilters(prev => ({ ...prev, search: '' }))}>
                  Tìm kiếm: {filters.search}
                </Tag>
              )}
              {filters.isFree !== undefined && (
                <Tag closable onClose={() => setFilters(prev => ({ ...prev, isFree: undefined }))}>
                  {filters.isFree ? 'Miễn phí' : 'Có phí'}
                </Tag>
              )}
              {filters.minRating && (
                <Tag closable onClose={() => setFilters(prev => ({ ...prev, minRating: undefined }))}>
                  {filters.minRating}+ sao
                </Tag>
              )}
              {filters.fileTypes.map(type => (
                <Tag
                  key={type}
                  closable
                  onClose={() =>
                    setFilters(prev => ({
                      ...prev,
                      fileTypes: prev.fileTypes.filter(t => t !== type),
                    }))
                  }
                >
                  {type}
                </Tag>
              ))}
              {filters.categoryIds.map(catId => {
                const cat = mockCategories.find(c => c._id === catId);
                return (
                  <Tag
                    key={catId}
                    closable
                    onClose={() =>
                      setFilters(prev => ({
                        ...prev,
                        categoryIds: prev.categoryIds.filter(id => id !== catId),
                      }))
                    }
                  >
                    {cat?.name}
                  </Tag>
                );
              })}
            </div>
          )}
        </Card>

        {/* Filter Panel - Collapsible */}
        {showFilters && (
          <div className="mb-6">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={6}>
                {renderFilterPanel()}
              </Col>
              <Col xs={24} lg={18}>
                {/* Results count */}
                <div className="mb-4 flex items-center justify-between">
                  <Text className="text-gray-500">
                    {isFetching ? (
                      <span className="flex items-center gap-2">
                        <Spin size="small" /> Đang tìm kiếm...
                      </span>
                    ) : (
                      <>
                        Tìm thấy <Text strong>{pagination?.total || 0}</Text> tài liệu
                        {debouncedSearch && ` cho "${debouncedSearch}"`}
                      </>
                    )}
                  </Text>
                </div>

                {/* Resource Grid */}
                {isLoading && !resources.length ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i} className="overflow-hidden rounded-lg shadow-sm">
                        <Skeleton active paragraph={{ rows: 4 }} />
                      </Card>
                    ))}
                  </div>
                ) : resources.length > 0 ? (
                  <Row gutter={[16, 16]}>
                    {resources.map(resource => (
                      <Col xs={24} sm={12} md={8} lg={6} key={resource._id || resource.id}>
                        <ResourceItem resource={resource} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty
                    description={
                      <div className="py-8">
                        <Text className="text-lg text-gray-500">Không tìm thấy tài liệu nào</Text>
                        <br />
                        <Text className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
                      </div>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={handleClearFilters}>
                      Xóa bộ lọc
                    </Button>
                  </Empty>
                )}
              </Col>
            </Row>
          </div>
        )}

        {/* Default view - Show filters on the side */}
        {!showFilters && (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              {renderFilterPanel()}
            </Col>
            <Col xs={24} lg={18}>
              {/* Results count */}
              <div className="mb-4 flex items-center justify-between">
                <Text className="text-gray-500">
                  {isFetching ? (
                    <span className="flex items-center gap-2">
                      <Spin size="small" /> Đang tìm kiếm...
                    </span>
                  ) : (
                    <>
                      Tìm thấy <Text strong>{pagination?.total || 0}</Text> tài liệu
                    </>
                  )}
                </Text>
              </div>

              {/* Resource Grid */}
              {isLoading && !resources.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden rounded-lg shadow-sm">
                      <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                  ))}
                </div>
              ) : resources.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {resources.map(resource => (
                    <Col xs={24} sm={12} md={8} lg={6} key={resource._id || resource.id}>
                      <ResourceItem resource={resource} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  description={
                    <div className="py-8">
                      <Text className="text-lg text-gray-500">Không tìm thấy tài liệu nào</Text>
                      <br />
                      <Text className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={handleClearFilters}>
                    Xóa bộ lọc
                  </Button>
                </Empty>
              )}
            </Col>
          </Row>
        )}

        {/* Pagination */}
        {pagination && pagination.total > pageSize && (
          <div className="mt-8 flex justify-center">
            <Pagination
              current={page}
              total={pagination.total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={total => `Tổng ${total} tài liệu`}
              className="resource-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
};
