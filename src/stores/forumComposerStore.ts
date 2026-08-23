import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const AUTOSAVE_DELAY_MS = 500

let pendingWrite: { key: string; value: string } | null = null
let pendingWriteTimer: ReturnType<typeof setTimeout> | null = null

const flushPendingWrite = () => {
  if (!pendingWrite) return
  localStorage.setItem(pendingWrite.key, pendingWrite.value)
  pendingWrite = null
  pendingWriteTimer = null
}

const draftStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => {
    pendingWrite = { key, value }
    if (pendingWriteTimer) clearTimeout(pendingWriteTimer)
    pendingWriteTimer = setTimeout(flushPendingWrite, AUTOSAVE_DELAY_MS)
  },
  removeItem: (key: string) => {
    if (pendingWrite?.key === key) {
      pendingWrite = null
      if (pendingWriteTimer) clearTimeout(pendingWriteTimer)
      pendingWriteTimer = null
    }
    localStorage.removeItem(key)
  },
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushPendingWrite)
}

export interface ForumDraft {
  id: string
  title: string
  subCategoryId: string
  prefixTagId: string | null
  contentHtml: string
  updatedAt: number
}

interface ComposerState {
  // Persisted (localStorage): the user's saved drafts.
  drafts: ForumDraft[]
  // Ephemeral UI state (not persisted).
  isOpen: boolean
  collapsed: boolean
  activeDraftId: string | null
}

interface ComposerActions {
  openNew: (prefillSubCategoryId?: string) => void
  openDraft: (id: string) => void
  close: () => void
  toggleCollapse: () => void
  saveActive: (patch: Partial<Omit<ForumDraft, 'id' | 'updatedAt'>>) => void
  removeDraft: (id: string) => void
  getActive: () => ForumDraft | null
}

const newDraft = (subCategoryId = ''): ForumDraft => ({
  id:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: '',
  subCategoryId,
  prefixTagId: null,
  contentHtml: '',
  updatedAt: Date.now(),
})

export const useForumComposerStore = create<ComposerState & ComposerActions>()(
  persist(
    (set, get) => ({
      drafts: [],
      isOpen: false,
      collapsed: false,
      activeDraftId: null,

      openNew: prefillSubCategoryId => {
        const draft = newDraft(prefillSubCategoryId)
        set(s => ({
          drafts: [draft, ...s.drafts],
          activeDraftId: draft.id,
          isOpen: true,
          collapsed: false,
        }))
      },

      openDraft: id => set({ activeDraftId: id, isOpen: true, collapsed: false }),

      close: () => set({ isOpen: false, collapsed: false }),

      toggleCollapse: () => set(s => ({ collapsed: !s.collapsed })),

      saveActive: patch =>
        set(s => ({
          drafts: s.drafts.map(d =>
            d.id === s.activeDraftId ? { ...d, ...patch, updatedAt: Date.now() } : d,
          ),
        })),

      removeDraft: id =>
        set(s => ({
          drafts: s.drafts.filter(d => d.id !== id),
          activeDraftId: s.activeDraftId === id ? null : s.activeDraftId,
          isOpen: s.activeDraftId === id ? false : s.isOpen,
        })),

      getActive: () => {
        const { drafts, activeDraftId } = get()
        return drafts.find(d => d.id === activeDraftId) ?? null
      },
    }),
    {
      name: 'forum:drafts',
      storage: createJSONStorage(() => draftStorage),
      // Only persist the drafts themselves — never the open/collapsed UI state.
      partialize: s => ({ drafts: s.drafts }),
    },
  ),
)
