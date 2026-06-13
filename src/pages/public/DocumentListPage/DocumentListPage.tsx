import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CaretRightOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'

import { DocumentSortSelect, type DocumentSortValue } from '@/components/ui/SelectVariants'
import { useInfiniteList, useList } from '@/hooks'
import { useDebounceValue } from '@/hooks/useDebounce'
import type { Document } from '@/models/Document'
import type { DocumentClassify } from '@/models/DocumentClassify'
import { type ListDocumentInput, listDocument } from '@/services/Document'
import { type ListDocumentClassifyInput, listDocumentClassify } from '@/services/DocumentClassify'

import { DocumentInfiniteList } from './components/DocumentInfiniteList'

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

  const debouncedSearchKeyword = useDebounceValue(searchKeyword, 400)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const {
    items: documents,
    page,
    totalItems,
    hasNextPage,
    isLoadingInitial: loadingInitial,
    isLoadingMore: loadingMore,
    error,
    setParams: setDocumentParams,
    loadMore,
    refresh,
  } = useInfiniteList<Document, ListDocumentInput>(listDocument, {
    initialParams: INITIAL_DOCUMENT_PARAMS,
  })

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
    [categoryFilter, debouncedSearchKeyword, sortValue],
  )

  useEffect(() => {
    setDocumentParams(buildListInput(1))
  }, [buildListInput, setDocumentParams])

  useEffect(() => {
    if (!hasNextPage) return
    if (loadingInitial || loadingMore) return

    const sentinelElement = sentinelRef.current
    if (!sentinelElement) return

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return
        loadMore()
      },
      {
        root: null,
        rootMargin: '180px',
        threshold: 0,
      },
    )

    observer.observe(sentinelElement)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, loadMore, loadingInitial, loadingMore, page])

  const handleRetry = useCallback(() => {
    if (documents.length === 0) {
      refresh()
      return
    }

    loadMore()
  }, [documents.length, loadMore, refresh])

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
              className={`flex-1 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                isSelected
                  ? 'bg-primary-1 text-primary-9 font-semibold'
                  : 'hover:bg-neutral-1 text-neutral-7 hover:text-neutral-9'
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
            <div className="mt-1 ml-3 space-y-1 border-l border-neutral-2 pl-3">
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
      <aside className="sticky top-20 hidden w-60 shrink-0 self-start rounded-xl border border-neutral-3 bg-white p-4 lg:block">
        <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-neutral-5">
          Danh mục tài liệu
        </h2>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCategoryFilter('')}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              categoryFilter === ''
                ? 'bg-primary-1 text-primary-9 font-semibold'
                : 'hover:bg-neutral-1 text-neutral-7 hover:text-neutral-9'
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
                <h1 className="text-xl font-bold tracking-tight text-neutral-10">
                  Thư viện tài liệu
                </h1>
                <p className="mt-0.5 text-sm text-neutral-6">
                  Tài liệu y khoa chọn lọc, tải về dạng PDF
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

          <div className="flex flex-col gap-3 border-t border-neutral-2 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <Input
              value={searchKeyword}
              onChange={event => setSearchKeyword(event.target.value)}
              prefix={<SearchOutlined className="text-neutral-5" />}
              placeholder="Tìm kiếm tài liệu theo tên..."
              className="rounded-lg sm:flex-1"
              size="large"
              allowClear
            />
            <div className="flex items-center gap-2">
              <span className="hidden shrink-0 text-sm text-neutral-6 sm:inline">Sắp xếp</span>
              <DocumentSortSelect
                className="w-full sm:w-44"
                value={sortValue}
                onChange={setSortValue}
              />
            </div>
          </div>
        </header>

        <DocumentInfiniteList
          documents={documents}
          loadingInitial={loadingInitial}
          loadingMore={loadingMore}
          hasNextPage={hasNextPage}
          errorMessage={errorMessage}
          searchKeyword={debouncedSearchKeyword}
          sentinelRef={sentinelRef}
          onRetry={handleRetry}
        />
      </main>
    </div>
  )
}
