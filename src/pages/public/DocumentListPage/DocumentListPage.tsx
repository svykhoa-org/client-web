import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  CaretRightOutlined,
  ControlOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Input } from 'antd'

import { DocumentSortSelect, type DocumentSortValue } from '@/components/ui/SelectVariants'
import { useList } from '@/hooks'
import { useDebounceValue } from '@/hooks/useDebounce'
import type { Document } from '@/models/Document'
import type { DocumentClassify } from '@/models/DocumentClassify'
import { type ListDocumentInput, listDocument } from '@/services/Document'
import { type ListDocumentClassifyInput, listDocumentClassify } from '@/services/DocumentClassify'

import { DocumentList } from './components/DocumentList'
import { DocumentFilterDrawer } from './components/DocumentFilterDrawer'
import {
  DEFAULT_FILTERS,
  type DocumentFilterValues,
  OLDER_THAN_YEAR,
  PAGES_MAX,
  PAGES_MIN,
  PRICE_MAX,
  PRICE_MIN,
  countActiveFilters,
} from './components/documentFilters'

interface SidebarCategoryNode {
  id: string
  name: string
  parentId: string | null
  children: SidebarCategoryNode[]
}

const PAGE_SIZE = 12
const CATEGORY_PAGE_SIZE = 1000

const INITIAL_DOCUMENT_PARAMS: ListDocumentInput = {
  page: 1,
  pageSize: PAGE_SIZE,
  sorter: {
    field: 'updatedAt',
    direction: 'desc',
  },
}

const INITIAL_CLASSIFY_PARAMS: ListDocumentClassifyInput = {
  page: 1,
  pageSize: CATEGORY_PAGE_SIZE,
  sorter: {
    field: 'name',
    direction: 'asc',
  },
}

export const DocumentListPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([])
  const [sortValue, setSortValue] = useState<DocumentSortValue>('updatedAt:desc')
  const [filterValues, setFilterValues] = useState<DocumentFilterValues>(DEFAULT_FILTERS)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFilterCount = countActiveFilters(filterValues)
  const debouncedSearchKeyword = useDebounceValue(searchKeyword, 400)

  const {
    items: documents,
    data: documentData,
    isLoading: loadingDocuments,
    error,
    params: documentParams,
    setParams: setDocumentParams,
    setParam: setDocumentParam,
    refresh,
  } = useList<Document, ListDocumentInput>(listDocument, {
    initialParams: INITIAL_DOCUMENT_PARAMS,
  })

  const totalItems = documentData?.pagination.totalItems ?? 0
  const currentPage = documentParams.page ?? 1

  const { items: categories } = useList<DocumentClassify, ListDocumentClassifyInput>(
    listDocumentClassify,
    {
      initialParams: INITIAL_CLASSIFY_PARAMS,
    },
  )

  const errorMessage = useMemo(() => {
    if (!error) return null
    return error instanceof Error ? error.message : 'Không thể tải danh sách tài liệu.'
  }, [error])

  const categoryTree = useMemo<SidebarCategoryNode[]>(() => {
    const nodesById = new Map<string, SidebarCategoryNode>()

    categories.forEach(category => {
      nodesById.set(category.id, {
        id: category.id,
        name: category.name,
        parentId: category.parentId ?? null,
        children: [],
      })
    })

    const roots: SidebarCategoryNode[] = []

    nodesById.forEach(node => {
      if (node.parentId && nodesById.has(node.parentId)) {
        nodesById.get(node.parentId)?.children.push(node)
        return
      }

      roots.push(node)
    })

    const sortNodes = (nodes: SidebarCategoryNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
      nodes.forEach(child => sortNodes(child.children))
    }

    sortNodes(roots)
    return roots
  }, [categories])

  const categoryParentMap = useMemo(() => {
    const parentMap = new Map<string, string | null>()

    const traverse = (nodes: SidebarCategoryNode[]) => {
      nodes.forEach(node => {
        parentMap.set(node.id, node.parentId)
        if (node.children.length) {
          traverse(node.children)
        }
      })
    }

    traverse(categoryTree)
    return parentMap
  }, [categoryTree])

  const buildListInput = useCallback(
    (nextPage: number): ListDocumentInput => {
      const searcher: NonNullable<ListDocumentInput['searcher']> = {}

      if (debouncedSearchKeyword.trim()) {
        searcher.title = {
          operator: 'ilike',
          value: debouncedSearchKeyword.trim(),
        }
      }

      if (categoryFilter) {
        searcher.categoryId = {
          operator: 'eq',
          value: categoryFilter,
        }
      }

      // Giá: freeOnly (price=0) đè lên range; ngược lại chỉ gửi khi range khác mặc định.
      if (filterValues.freeOnly) {
        searcher.price = { operator: 'eq', value: 0 }
      } else if (filterValues.priceRange[0] > PRICE_MIN || filterValues.priceRange[1] < PRICE_MAX) {
        searcher.price = { operator: 'between', value: filterValues.priceRange }
      }

      // Số trang: chỉ gửi khi range khác mặc định.
      if (filterValues.pagesRange[0] > PAGES_MIN || filterValues.pagesRange[1] < PAGES_MAX) {
        searcher.totalPages = { operator: 'between', value: filterValues.pagesRange }
      }

      // Năm phát hành: pseudo-field server dịch sang EXTRACT(YEAR) IN / < (xem list.ts).
      if (filterValues.years.length) {
        searcher.releaseYear = { operator: 'in', value: filterValues.years }
      }
      if (filterValues.olderThan) {
        searcher.releaseYearBefore = { operator: 'eq', value: OLDER_THAN_YEAR }
      }

      const [field, direction] = sortValue.split(':') as [
        NonNullable<ListDocumentInput['sorter']> extends { field: infer F } | Array<infer _>
          ? Extract<F, string>
          : string,
        'asc' | 'desc',
      ]

      return {
        page: nextPage,
        pageSize: PAGE_SIZE,
        searcher: Object.keys(searcher).length ? searcher : undefined,
        sorter: {
          field,
          direction,
        },
      }
    },
    [categoryFilter, debouncedSearchKeyword, filterValues, sortValue],
  )

  useEffect(() => {
    setDocumentParams(buildListInput(1))
  }, [buildListInput, setDocumentParams])

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setDocumentParam('page', nextPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setDocumentParam],
  )

  const handleRetry = useCallback(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!categoryTree.length) {
      setExpandedCategoryIds(previous => (previous.length ? [] : previous))
      return
    }

    setExpandedCategoryIds(prevExpanded => {
      const validNodeIds = new Set<string>()
      const collectIds = (nodes: SidebarCategoryNode[]) => {
        nodes.forEach(node => {
          validNodeIds.add(node.id)
          collectIds(node.children)
        })
      }

      collectIds(categoryTree)

      const kept = prevExpanded.filter(id => validNodeIds.has(id))
      if (kept.length) return kept

      return categoryTree.filter(node => node.children.length > 0).map(node => node.id)
    })
  }, [categoryTree])

  useEffect(() => {
    if (!categoryFilter) return

    const ancestors: string[] = []
    let currentParent = categoryParentMap.get(categoryFilter) ?? null

    while (currentParent) {
      ancestors.push(currentParent)
      currentParent = categoryParentMap.get(currentParent) ?? null
    }

    if (!ancestors.length) return

    setExpandedCategoryIds(prevExpanded => Array.from(new Set([...prevExpanded, ...ancestors])))
  }, [categoryFilter, categoryParentMap])

  const toggleCategoryExpanded = useCallback((categoryId: string) => {
    setExpandedCategoryIds(prevExpanded => {
      if (prevExpanded.includes(categoryId)) {
        return prevExpanded.filter(id => id !== categoryId)
      }

      return [...prevExpanded, categoryId]
    })
  }, [])

  const renderCategoryNode = useCallback(
    (node: SidebarCategoryNode) => {
      const hasChildren = node.children.length > 0
      const isExpanded = expandedCategoryIds.includes(node.id)
      const isSelected = categoryFilter === node.id

      return (
        <div key={node.id}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCategoryFilter(node.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isSelected
                  ? 'bg-primary-1 text-primary-8 font-semibold'
                  : 'hover:bg-neutral-1 text-neutral-7 font-medium hover:text-neutral-9'
              }`}
            >
              {node.name}
            </button>

            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleCategoryExpanded(node.id)}
                className="hover:bg-neutral-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-5 transition-colors hover:text-neutral-8"
                aria-label={isExpanded ? 'Thu gọn danh mục' : 'Mở rộng danh mục'}
              >
                <CaretRightOutlined
                  className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
            ) : null}
          </div>

          {hasChildren && isExpanded ? (
            <div className="mt-0.5 ml-3 space-y-0.5 border-l border-neutral-2 pl-3">
              {node.children.map(child => renderCategoryNode(child))}
            </div>
          ) : null}
        </div>
      )
    },
    [categoryFilter, expandedCategoryIds, toggleCategoryExpanded],
  )

  return (
    <div className="flex w-full gap-6">
      <aside className="sticky top-20 hidden w-64 shrink-0 self-start rounded-xl border border-neutral-3 bg-white p-3 lg:block">
        <h2 className="mb-2 px-3 pt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-4">
          Danh mục tài liệu
        </h2>

        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              categoryFilter === ''
                ? 'bg-primary-1 text-primary-8 font-semibold'
                : 'hover:bg-neutral-1 text-neutral-7 font-medium hover:text-neutral-9'
            }`}
          >
            Tất cả danh mục
          </button>

          {categoryTree.map(node => renderCategoryNode(node))}

          {!categoryTree.length ? (
            <p className="px-3 py-2 text-xs text-neutral-5">
              Danh mục sẽ hiện khi có dữ liệu tài liệu.
            </p>
          ) : null}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {/* Header + search toolbar */}
        <header className="mb-4 overflow-hidden rounded-xl border border-neutral-3 bg-white">
          <div className="from-primary-1 flex items-start justify-between gap-4 bg-gradient-to-br to-white px-5 pb-4 pt-5 sm:px-6">
            <div className="flex items-start gap-3.5">
              <span className="bg-primary-9 shadow-primary-10/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm">
                <FileTextOutlined />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-10">Tàng kinh các</h1>
                <p className="mt-0.5 text-sm text-neutral-6">
                  Tài liệu y khoa chọn lọc, tải về dễ dàng
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-primary-9 text-2xl font-bold leading-none tabular-nums">
                {totalItems}
              </div>
              <div className="mt-1 text-xs text-neutral-5">tài liệu</div>
            </div>
          </div>

          <div className="border-t border-neutral-2 px-5 py-4 sm:px-6">
            <Input
              value={searchKeyword}
              onChange={event => setSearchKeyword(event.target.value)}
              prefix={<SearchOutlined className="text-neutral-5" />}
              placeholder="Tìm kiếm tài liệu theo tên..."
              className="doc-search rounded-lg"
              size="large"
              allowClear
              suffix={
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  aria-label="Bộ lọc tài liệu"
                  className="hover:text-primary-7 -mr-1 flex items-center gap-1.5 border-l border-neutral-3 pl-2.5 text-lg text-neutral-6 transition-colors"
                >
                  <ControlOutlined />
                  {activeFilterCount > 0 ? (
                    <span className="bg-primary-6 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white tabular-nums">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
              }
            />
          </div>
        </header>

        {/* Toolbar: sort đứng đầu list, không nhãn */}
        <div className="mb-4 flex justify-end">
          <DocumentSortSelect className="w-40" value={sortValue} onChange={setSortValue} />
        </div>

        <DocumentList
          documents={documents}
          loading={loadingDocuments}
          errorMessage={errorMessage}
          searchKeyword={debouncedSearchKeyword}
          page={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onRetry={handleRetry}
        />
      </main>

      <DocumentFilterDrawer
        open={isFilterOpen}
        value={filterValues}
        onClose={() => setIsFilterOpen(false)}
        onApply={next => {
          setFilterValues(next)
          setIsFilterOpen(false)
        }}
        onReset={() => setFilterValues(DEFAULT_FILTERS)}
      />
    </div>
  )
}
