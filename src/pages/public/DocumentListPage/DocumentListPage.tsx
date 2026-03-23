import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CaretRightOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input } from 'antd'

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
                  ? 'bg-sky-50 font-semibold text-sky-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {node.name}
            </button>

            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleCategoryExpanded(node.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label={isExpanded ? 'Thu gọn danh mục' : 'Mở rộng danh mục'}
              >
                <CaretRightOutlined
                  className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
            ) : null}
          </div>

          {hasChildren && isExpanded ? (
            <div className="mt-1 ml-3 space-y-1 border-l border-slate-200 pl-3">
              {node.children.map(child => renderCategoryNode(child))}
            </div>
          ) : null}
        </div>
      )
    },
    [categoryFilter, expandedCategoryIds, toggleCategoryExpanded],
  )

  return (
    <div className="flex w-full">
      <aside className="sticky top-20 bg-white rounded-md hidden shrink-0 self-start px-4 py-6 lg:block">
        <div>
          <h3 className="mb-4 text-base font-bold tracking-wide text-primary-5 uppercase">
            Danh mục tài liệu
          </h3>

          <div className="space-y-2">
            <Button
              block
              type={categoryFilter === '' ? 'primary' : 'default'}
              onClick={() => setCategoryFilter('')}
            >
              Tất cả danh mục
            </Button>

            {categoryTree.map(node => renderCategoryNode(node))}

            {!categoryTree.length ? (
              <p className="px-3 py-2 text-xs text-slate-400">
                Danh mục sẽ hiện khi có dữ liệu tài liệu.
              </p>
            ) : null}
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pl-0 lg:pl-6">
        <div className="">
          <Card className="mb-4! shadow-none!">
            <label className="mb-4 block">
              <Input
                value={searchKeyword}
                onChange={event => setSearchKeyword(event.target.value)}
                prefix={<SearchOutlined className="text-slate-400" />}
                placeholder="Tìm kiếm bài báo, tác giả, DOI..."
              />
            </label>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span>Lọc theo:</span>
                <DocumentSortSelect
                  className="min-w-40"
                  value={sortValue}
                  onChange={setSortValue}
                />
              </div>
              <div className="ml-auto flex min-w-55 items-center justify-end gap-3 text-sm text-slate-500">
                <span>
                  Hiển thị <span className="font-bold text-slate-900">{totalItems}</span> kết quả{' '}
                  {debouncedSearchKeyword && `cho từ khóa "${debouncedSearchKeyword}"`}
                </span>
              </div>
            </div>
          </Card>

          {debouncedSearchKeyword ? (
            <Alert
              type="info"
              showIcon
              message={`Kết quả đang lọc theo từ khóa: ${debouncedSearchKeyword}`}
              className="mb-4!"
            />
          ) : null}

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
        </div>
      </main>
    </div>
  )
}
