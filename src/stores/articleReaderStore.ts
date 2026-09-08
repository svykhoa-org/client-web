import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Reading-preference store (Readwise-style). Client-only — persisted to
// localStorage so a reader's typeface/size/spacing/width carries across articles.
// Scoped to the `.article-reader` container via CSS variables; never touches the
// app-wide font.

export type TypefaceKind = 'serif' | 'sans'

export interface ReaderTypeface {
  id: string
  label: string
  stack: string
  kind: TypefaceKind
}

// Curated to fonts with a Vietnamese subset on Google Fonts (OpenDyslexic /
// Atkinson Hyperlegible dropped — they break Vietnamese diacritics).
export const READER_TYPEFACES: ReaderTypeface[] = [
  { id: 'literata', label: 'Literata', stack: "'Literata', Georgia, serif", kind: 'serif' },
  {
    id: 'source-serif',
    label: 'Source Serif 4',
    stack: "'Source Serif 4', Georgia, serif",
    kind: 'serif',
  },
  { id: 'piazzolla', label: 'Piazzolla', stack: "'Piazzolla', Georgia, serif", kind: 'serif' },
  {
    id: 'be-vietnam',
    label: 'Be Vietnam Pro',
    stack: "'Be Vietnam Pro', sans-serif",
    kind: 'sans',
  },
  { id: 'inter', label: 'Inter', stack: "'Inter', sans-serif", kind: 'sans' },
  { id: 'ibm-plex', label: 'IBM Plex Sans', stack: "'IBM Plex Sans', sans-serif", kind: 'sans' },
]

export type LineWidth = 'narrow' | 'medium' | 'wide'

export const LINE_WIDTH_PX: Record<LineWidth, number> = {
  narrow: 600,
  medium: 680,
  wide: 760,
}

const LINE_WIDTH_ORDER: LineWidth[] = ['narrow', 'medium', 'wide']

const FONT_SIZE_MIN = 16
const FONT_SIZE_MAX = 26
const LINE_HEIGHT_MIN = 1.4
const LINE_HEIGHT_MAX = 2.1

interface ReaderState {
  typefaceId: string
  fontSize: number
  lineHeight: number
  lineWidth: LineWidth
  setTypeface: (id: string) => void
  incFontSize: (delta: number) => void
  incLineHeight: (delta: number) => void
  incLineWidth: (delta: number) => void
  reset: () => void
}

const DEFAULTS = {
  typefaceId: 'literata',
  fontSize: 20,
  lineHeight: 1.7,
  lineWidth: 'medium' as LineWidth,
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const useArticleReaderStore = create<ReaderState>()(
  persist(
    set => ({
      ...DEFAULTS,
      setTypeface: id => set({ typefaceId: id }),
      incFontSize: delta =>
        set(s => ({ fontSize: clamp(s.fontSize + delta, FONT_SIZE_MIN, FONT_SIZE_MAX) })),
      incLineHeight: delta =>
        set(s => ({
          lineHeight: clamp(
            Math.round((s.lineHeight + delta) * 10) / 10,
            LINE_HEIGHT_MIN,
            LINE_HEIGHT_MAX,
          ),
        })),
      incLineWidth: delta =>
        set(s => {
          const idx = LINE_WIDTH_ORDER.indexOf(s.lineWidth)
          const next = clamp(idx + delta, 0, LINE_WIDTH_ORDER.length - 1)
          return { lineWidth: LINE_WIDTH_ORDER[next] }
        }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'article-reader-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export const getTypefaceStack = (id: string): string =>
  (READER_TYPEFACES.find(t => t.id === id) ?? READER_TYPEFACES[0]).stack
