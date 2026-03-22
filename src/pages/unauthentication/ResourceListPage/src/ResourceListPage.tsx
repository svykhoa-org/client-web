import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { FilterOutlined } from '@ant-design/icons';
import { Button, Divider, Radio, Space, message } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';

import PaymentModal from '@/components/resource/PaymentModal';
import ResourceCard from '@/components/resource/ResourceCard';
import { AsyncLoading } from '@/components/ui/AsyncLoading';
import { useAsyncState } from '@/hooks/useAsyncState';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import type { Category } from '@/models/Category';
import type { Resource } from '@/models/Resource';
import { getCategories } from '@/services/category';
import { type GetResourcesResponse, downloadResource, getResources } from '@/services/resource';

const ResourceListPage = () => {
  const navigate = useNavigate();
  const { setBanner } = useLayout();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [priceFilter, setPriceFilter] = useState<string>(searchParams.get('price') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const resourcesState = useAsyncState<GetResourcesResponse>();
  const categoriesState = useAsyncState<Category[]>();

  // Use refs to track whether we need to reload resources
  const shouldReloadRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Debounced loading function to prevent excessive API calls
  const debouncedLoadResources = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      // Only reload if needed
      if (shouldReloadRef.current) {
        const params = {} as {
          page: number;
          limit: number;
          categoryId?: string;
          isFree?: boolean;
        };

        // Always include these parameters
        params.page = currentPage;
        params.limit = 12;

        // Only add categoryId if selected
        if (selectedCategory) {
          params.categoryId = selectedCategory;
        }

        // Only add isFree if filter is not "all"
        if (priceFilter === 'free') {
          params.isFree = true;
        } else if (priceFilter === 'paid') {
          params.isFree = false;
        }

        // Log the params before sending the request
        console.log('Sending resource request with params:', params);

        resourcesState.execute(() => {
          return getResources(params).then(response => {
            console.log('Resource response:', response);
            return response.data as GetResourcesResponse;
          });
        });

        // Reset the flag
        shouldReloadRef.current = false;
      }
    }, 300); // 300ms debounce
  }, [currentPage, selectedCategory, priceFilter, resourcesState]);

  const loadCategories = useCallback(async () => {
    // Only load categories once
    if (categories.length === 0) {
      await categoriesState.execute(() =>
        getCategories().then(response => {
          const categoriesData = response.data?.hits as Category[];
          setCategories(categoriesData);
          return categoriesData;
        })
      );
    }
  }, [categories.length]);

  // Initial load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load resources when component mounts and when filters change, with debouncing
  useEffect(() => {
    // On first load, immediately fetch resources
    if (shouldReloadRef.current) {
      debouncedLoadResources();
    }

    // Cleanup function to clear timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedLoadResources]);

  // Update URL params when filters change
  useEffect(() => {
    // We use this technique to avoid updating URL params unnecessarily
    const newParams = new URLSearchParams();
    if (selectedCategory) newParams.set('category', selectedCategory);
    if (priceFilter !== 'all') newParams.set('price', priceFilter);
    if (currentPage > 1) newParams.set('page', currentPage.toString());

    // Compare current URL params with new params
    const currentParams = new URLSearchParams(searchParams);
    let paramsChanged = false;

    // Check if params have actually changed
    if (
      currentParams.get('category') !== newParams.get('category') ||
      currentParams.get('price') !== newParams.get('price') ||
      currentParams.get('page') !== newParams.get('page')
    ) {
      paramsChanged = true;
    }

    // Only update URL if params have changed
    if (paramsChanged) {
      setSearchParams(newParams);
    }
  }, [selectedCategory, priceFilter, currentPage, searchParams, setSearchParams]);

  const handleCategoryChange = (categoryId: string) => {
    // Only update if the category has actually changed
    if (selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
      setCurrentPage(1);
      // Flag that we need to reload
      shouldReloadRef.current = true;
    }
  };

  const handlePriceFilterChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value;
    // Only update if the price filter has actually changed
    if (priceFilter !== newValue) {
      setPriceFilter(newValue);
      setCurrentPage(1);
      // Flag that we need to reload
      shouldReloadRef.current = true;
    }
  };

  const handlePageChange = (page: number) => {
    // Only update if the page has actually changed
    if (currentPage !== page) {
      setCurrentPage(page);
      // Flag that we need to reload
      shouldReloadRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle resource download
  const handleResourceDownload = async (resource: Resource) => {
    // For free resources, download directly
    if (resource.price === 0) {
      await handleDownload(resource?._id || '');
    } else {
      // For paid resources, show payment modal or navigate to detail page
      if (isAuthenticated) {
        setSelectedResource(resource);
        setShowPaymentModal(true);
      } else {
        // If not authenticated, redirect to login
        message.info('Vui lòng đăng nhập để mua tài liệu này');
        navigate(`/auth/login?redirect=/resource/${resource._id}`);
      }
    }
  };

  // Handle actual download
  const handleDownload = async (resourceId: string) => {
    try {
      setDownloading(true);
      const response = await downloadResource(resourceId);

      if (response.data && 'downloadUrl' in response.data) {
        // Open the download URL in a new tab
        window.open(response.data.downloadUrl, '_blank');

        // Show success message
        message.success('Đang tải tài liệu...');
      } else {
        message.error('Không thể tải tài liệu. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Download error:', error);
      message.error('Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.');
    } finally {
      setDownloading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (downloadUrl: string) => {
    // Close the payment modal
    setShowPaymentModal(false);

    // Reset selected resource
    setSelectedResource(null);

    // Show success notification
    message.success('Thanh toán thành công! Đang tải tài liệu...');

    // Download the file if URL is provided
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  useEffect(() => {
    setBanner(
      <div className="from-primary-6 to-secondary-6 bg-gradient-to-r py-8">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="mb-2 text-3xl font-bold">Tài liệu y khoa</h1>
          <p className="text-lg opacity-90">Khám phá và tải các tài liệu y khoa chất lượng cao</p>
        </div>
      </div>
    );

    return () => {
      setBanner(null);
    };
  }, [setBanner]);

  return (
    <div className="bg-neutral-2 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filters */}
          <div className="w-full flex-shrink-0 lg:w-64">
            <div className="bg-neutral-1 sticky top-24 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-neutral-9 text-lg font-medium">Bộ lọc</h3>
                <FilterOutlined />
              </div>

              <Divider className="my-3" />

              <div className="mb-6">
                <h4 className="text-neutral-8 mb-2 text-sm font-medium">Danh mục</h4>
                <div className="space-y-2">
                  <Radio.Group
                    value={selectedCategory}
                    onChange={e => handleCategoryChange(e.target.value)}
                    disabled={downloading}
                    className="flex flex-col gap-2"
                  >
                    <Radio value="">Tất cả danh mục</Radio>
                    <AsyncLoading loading={categoriesState.state.loading} type="skeleton" skeleton={{ rows: 5 }}>
                      {categories.map(category => (
                        <Radio key={category._id} value={category._id}>
                          {category.name}
                        </Radio>
                      ))}
                    </AsyncLoading>
                  </Radio.Group>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-neutral-8 mb-2 text-sm font-medium">Giá</h4>
                <Radio.Group value={priceFilter} onChange={handlePriceFilterChange} disabled={downloading}>
                  <Space direction="vertical">
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="free">Miễn phí</Radio>
                    <Radio value="paid">Trả phí</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-neutral-9 text-xl font-medium">
                {resourcesState.state.data?.hits.length
                  ? `Tìm thấy ${resourcesState.state.data?.metadata.total} tài liệu`
                  : 'Tài liệu'}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-neutral-6 text-sm">Sắp xếp theo:</span>
                <select className="rounded border border-gray-300 bg-white px-3 py-1 text-sm">
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            <AsyncLoading
              loading={resourcesState.state.loading && currentPage === 1}
              type="skeleton"
              skeleton={{ rows: 4, avatar: true }}
            >
              <div
                className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${downloading ? 'pointer-events-none opacity-60' : ''}`}
              >
                {resourcesState.state.data?.hits.map(resource => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    onDownloadClick={handleResourceDownload}
                    disabled={downloading}
                  />
                ))}
              </div>

              {resourcesState.state.data?.hits.length === 0 && !resourcesState.state.loading && (
                <div className="mt-8 text-center">
                  <p className="text-neutral-6 mb-2 text-lg">Không tìm thấy tài liệu nào</p>
                  <p className="text-neutral-5 mb-4">Hãy thử thay đổi bộ lọc của bạn</p>
                  <Button
                    disabled={downloading}
                    onClick={() => {
                      setSelectedCategory('');
                      setPriceFilter('all');
                      setCurrentPage(1);
                      shouldReloadRef.current = true;
                      debouncedLoadResources();
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {(resourcesState.state.data?.metadata?.totalPages || 0) > 1 && (
                <div className={`mt-8 flex justify-center ${downloading ? 'pointer-events-none opacity-60' : ''}`}>
                  <ul className="flex">
                    {Array.from(
                      {
                        length: resourcesState.state.data?.metadata?.totalPages || 1,
                      },
                      (_, i) => i + 1
                    ).map(page => (
                      <li key={page}>
                        <button
                          onClick={() => handlePageChange(page)}
                          disabled={downloading}
                          className={`mx-1 h-10 w-10 rounded-full ${
                            currentPage === page ? 'bg-primary-500 text-white' : 'bg-neutral-1 hover:bg-neutral-3'
                          }`}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AsyncLoading>

            {/* Payment Modal */}
            {selectedResource && (
              <PaymentModal
                resource={selectedResource}
                visible={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
              />
            )}

            {resourcesState.state.error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-center text-red-500">
                <p>{resourcesState.state.error}</p>
                <Button
                  className="mt-2"
                  disabled={downloading}
                  onClick={() => {
                    shouldReloadRef.current = true;
                    debouncedLoadResources();
                  }}
                >
                  Thử lại
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceListPage;
