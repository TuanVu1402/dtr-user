import { useEffect, useMemo, useRef, useState } from 'react'
import { formatMonthLabel, toMonthKey } from '@/utils/ranking'

const MONTH_LABELS = [
  'Thg 1',
  'Thg 2',
  'Thg 3',
  'Thg 4',
  'Thg 5',
  'Thg 6',
  'Thg 7',
  'Thg 8',
  'Thg 9',
  'Thg 10',
  'Thg 11',
  'Thg 12',
]

type RankingPeriodBarProps = {
  viewAll: boolean
  selectedMonth: string
  onShowAll: () => void
  onShowMonth: (monthKey: string) => void
}

function parseMonthKey(monthKey: string) {
  const [year, month] = monthKey.split('-')
  return { year: Number(year), month: Number(month) }
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function YearArrow({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.1" />
      {direction === 'prev' ? (
        <path d="M13.5 7.8 9.2 12l4.3 4.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M10.5 7.8 14.8 12l-4.3 4.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

export default function RankingPeriodBar({
  viewAll,
  selectedMonth,
  onShowAll,
  onShowMonth,
}: RankingPeriodBarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = parseMonthKey(selectedMonth)
  const [pickerYear, setPickerYear] = useState(selected.year)

  const yearBounds = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return { min: currentYear - 3, max: currentYear }
  }, [])

  useEffect(() => {
    if (open) setPickerYear(selected.year)
  }, [open, selected.year])

  useEffect(() => {
    if (!open) return

    function handlePointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const pillClass = (active: boolean) =>
    `flex h-10 cursor-pointer items-center justify-center rounded-2xl border px-2.5 text-[13px] leading-5 font-semibold transition-colors md:h-11 md:px-3 md:text-sm ${
      active
        ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--on-gold)] shadow-[0_8px_18px_rgba(37,99,235,0.22)]'
        : 'border-[var(--hairline)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--gold)]/40'
    }`

  return (
    <div className="relative mb-4" ref={rootRef}>
      <div className="flex w-full items-stretch gap-2">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-pressed={!viewAll}
          className={`min-w-0 flex-1 justify-between gap-1.5 ${pillClass(!viewAll)}`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="overflow-visible pb-px">{formatMonthLabel(selectedMonth)}</span>
          <ChevronIcon open={open} />
        </button>
        <button
          type="button"
          aria-pressed={viewAll}
          className={`flex-none overflow-visible whitespace-nowrap ${pillClass(viewAll)}`}
          onClick={() => {
            setOpen(false)
            onShowAll()
          }}
        >
          Toàn thời gian
        </button>
      </div>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-3 shadow-[0_18px_40px_var(--shadow-strong)]"
          role="dialog"
          aria-label="Chọn tháng và năm xếp hạng"
        >
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[var(--bg-2)] px-1.5 py-1">
            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-1)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={pickerYear <= yearBounds.min}
              onClick={() => setPickerYear((year) => year - 1)}
              aria-label="Năm trước"
            >
              <YearArrow direction="prev" />
            </button>
            <p className="text-sm font-bold tracking-wide text-[var(--text-primary)]">{pickerYear}</p>
            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-1)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={pickerYear >= yearBounds.max}
              onClick={() => setPickerYear((year) => year + 1)}
              aria-label="Năm sau"
            >
              <YearArrow direction="next" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {MONTH_LABELS.map((label, index) => {
              const monthNumber = index + 1
              const active = !viewAll && pickerYear === selected.year && monthNumber === selected.month
              return (
                <button
                  key={label}
                  type="button"
                  className={`cursor-pointer rounded-xl px-2 py-2 text-center text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--on-gold)] shadow-[0_6px_14px_rgba(37,99,235,0.25)]'
                      : 'bg-[var(--bg-2)] text-[var(--text-secondary)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold-deep)]'
                  }`}
                  onClick={() => {
                    onShowMonth(toMonthKey(pickerYear, index))
                    setOpen(false)
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
