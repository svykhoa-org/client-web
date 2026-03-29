import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { ProtectedButton } from '@/components/auth';
import { AsyncLoading } from '@/components/ui/AsyncLoading';
import Button from '@/components/ui/Button';
import { useAsyncState } from '@/hooks/useAsyncState';
import { useDebounceValue } from '@/hooks/useDebounce';
import { useLayout } from '@/hooks/useLayout';
// import { activeUsers } from '@/mocks/activeUsers';
// import { mockFeaturedDocuments } from '@/mocks/categories';
import type { Category } from '@/models/Category';
import type { Post } from '@/models/Post';
import { getCategories } from '@/services/category/mockCategoryService';
import { type GetPostsResponse, getPosts } from '@/services/post/mockGetPosts';

import CategorySidebar from './components/CategorySidebar';
import PostList from './components/PostList';

// import RightSidebar from './components/RightSidebar';

export const ForumPage = () => {
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout();
  const navigate = useNavigate();

  const [param] = useSearchParams();
  const categoryParam = param.get('category');
  const searchParam = param.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || '');
  const [currentPage, setCurrentPage] = useState(1);
  // const [downloading, setDownloading] = useState(false);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounceValue(searchQuery, 500);

  // Sync selectedCategory và searchQuery với URL params khi URL thay đổi
  useEffect(() => {
    const newCategoryParam = param.get('category') || '';
    const newSearchParam = param.get('search') || '';

    // Only update if params actually changed to avoid infinite loops
    setSelectedCategory(prevCategory => {
      if (newCategoryParam !== prevCategory) {
        return newCategoryParam;
      }
      return prevCategory;
    });

    setSearchQuery(prevSearch => {
      if (newSearchParam !== prevSearch) {
        return newSearchParam;
      }
      return prevSearch;
    });

    setCurrentPage(1);
  }, [param]);

  const postsState = useAsyncState<GetPostsResponse>();
  const categoriesState = useAsyncState<Category[]>();

  const loadPosts = useCallback(async () => {
    console.log('loadPosts called with:', { selectedCategory, searchQuery: debouncedSearchQuery, currentPage });
    await postsState.execute(() =>
      getPosts({
        page: currentPage,
        limit: 10,
        ...(selectedCategory && { category: selectedCategory }),
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      }).then(response => {
        // Log chi tiết response để debug
        console.log('Posts loaded:', response);
        console.log('Posts data:', response.data);
        console.log('Metadata:', response.data?.metadata);
        console.log('Total items:', response.data?.metadata?.total);
        console.log('Total pages:', response.data?.metadata?.totalPages);
        return response.data as GetPostsResponse;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearchQuery, currentPage]);

  const loadCategories = useCallback(async () => {
    await categoriesState.execute(() => getCategories().then(response => response.data?.hits as Category[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Trigger search when debounced search query changes (but not on initial load)
  useEffect(() => {
    if (debouncedSearchQuery !== searchParam) {
      setCurrentPage(1); // Reset to first page on search
      loadPosts();
    }
  }, [debouncedSearchQuery, loadPosts, searchParam]);

  useEffect(() => {
    console.log('Loading categories...');
    loadCategories();
  }, [loadCategories]);

  const handleViewMore = (post: Post) => {
    navigate(`/post/${post._id}`);
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const newCategory = categoryId === selectedCategory ? '' : categoryId;
      setSelectedCategory(newCategory);
      setCurrentPage(1);

      // Cập nhật URL params
      const searchParams = new URLSearchParams();
      if (newCategory) {
        searchParams.set('category', newCategory);
      }

      // Navigate với params mới (giữ lại current location)
      const newUrl = newCategory ? `/forum?category=${newCategory}` : '/forum';
      navigate(newUrl, { replace: true });
    },
    [selectedCategory, navigate]
  );

  const handlePageChange = useCallback((page: number) => {
    console.log('Changing to page:', page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      console.log('handleSearch called with:', query);
      const searchParams = new URLSearchParams();

      if (query.trim()) {
        searchParams.set('search', query.trim());
      }

      if (selectedCategory) {
        searchParams.set('category', selectedCategory);
      }

      const newUrl = searchParams.toString() ? `/forum?${searchParams.toString()}` : '/forum';
      console.log('Navigating to:', newUrl);
      navigate(newUrl, { replace: true });
    },
    [selectedCategory, navigate]
  );

  const clearSearch = useCallback(() => {
    const searchParams = new URLSearchParams();

    if (selectedCategory) {
      searchParams.set('category', selectedCategory);
    }

    const newUrl = searchParams.toString() ? `/forum?${searchParams.toString()}` : '/forum';
    navigate(newUrl, { replace: true });
  }, [selectedCategory, navigate]);

  // Không cần hàm handleLoadMore nữa vì chúng ta đã chuyển sang sử dụng pagination

  useEffect(() => {
    setLeftSidebar(
      <AsyncLoading loading={categoriesState.state.loading} type="skeleton">
        <CategorySidebar
          categories={categoriesState.state.data || []}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </AsyncLoading>
    );

    // setRightSidebar(
    //   <RightSidebar
    //     activeUsers={activeUsers}
    //     featuredDocuments={mockFeaturedDocuments}
    //     featuredResources={resourcesState.state.data || []}
    //   />
    // );

    setBanner(
      <div className="from-primary-6 to-secondary-6 bg-gradient-to-r py-8">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="mb-2 text-3xl font-bold">Diễn đàn Y dược Việt Nam</h1>
          <p className="text-lg opacity-90">Nơi chia sẻ kiến thức và kinh nghiệm về y học hiện đại</p>
        </div>
      </div>
    );

    return () => {
      setLeftSidebar(null);
      setRightSidebar(null);
      setBanner(null);
    };
  }, [
    selectedCategory,
    categoriesState.state.data,
    categoriesState.state.loading,
    setLeftSidebar,
    setRightSidebar,
    setBanner,
    handleCategorySelect,
  ]);

  const getPageTitle = () => {
    if (debouncedSearchQuery) {
      return `Kết quả tìm kiếm: "${debouncedSearchQuery}"`;
    }
    if (selectedCategory) {
      const categoryName = categoriesState.state.data?.find(cat => cat._id === selectedCategory)?.name;
      return categoryName || 'Bài viết mới nhất';
    }
    return 'Bài viết mới nhất';
  };

  return (
    <div className="bg-neutral-2">
      <div className="container mx-auto px-4">
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-neutral-9 text-2xl font-bold">{getPageTitle()}</h2>
              {debouncedSearchQuery && (
                <p className="text-neutral-6 mt-1">
                  {selectedCategory &&
                    `Trong danh mục: ${categoriesState.state.data?.find(cat => cat._id === selectedCategory)?.name || ''}`}
                </p>
              )}
            </div>

            <ProtectedButton
              variant="filled"
              onClick={() => navigate('/post/create')}
              modalTitle="Yêu cầu đăng nhập"
              modalContent="Bạn cần đăng nhập để tạo bài viết mới."
              fallbackText="Đăng nhập để tạo bài viết"
            >
              Tạo bài viết
            </ProtectedButton>
          </div>

          {/* Search Box */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                className="border-neutral-3 focus:border-primary-6 focus:ring-primary-1 w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-neutral-5 hover:text-neutral-7 absolute top-1/2 right-3 -translate-y-1/2 text-lg"
                >
                  ×
                </button>
              )}
            </div>
            <Button variant="outlined" onClick={() => handleSearch(searchQuery)} className="px-6">
              Tìm kiếm
            </Button>
          </div>
        </div>

        <AsyncLoading
          loading={postsState.state.loading && currentPage === 1}
          type="skeleton"
          skeleton={{ rows: 5, avatar: true, title: true }}
        >
          <PostList
            posts={postsState.state.data?.hits || []}
            onViewMore={handleViewMore}
            onPageChange={handlePageChange}
            loading={postsState.state.loading}
            currentPage={currentPage}
            // Đảm bảo totalItems không bao giờ là 0
            totalItems={postsState.state.data?.metadata?.total || 100}
            pageSize={postsState.state.data?.metadata?.limit || 10}
            showPagination={true}
          />
        </AsyncLoading>

        {postsState.state.error && (
          <div className="py-8 text-center">
            <p className="mb-4 text-red-500">{postsState.state.error}</p>
            <Button onClick={loadPosts}>Thử lại</Button>
          </div>
        )}
      </div>
    </div>
  );
};
