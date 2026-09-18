import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarIcon } from '@/components/icons'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function toIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function parseIso(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

function formatDisplay(iso: string) {
  if (!iso) return ''
  return parseIso(iso).toLocaleDateString('vi-VN')
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - mondayOffset)
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
  const lastInMonth = cells.findLastIndex((date) => date.getMonth() === month)
  return cells.slice(0, Math.ceil((lastInMonth + 1) / 7) * 7)
}

type DateFieldProps = {
  id: string
  value: string
  onChange: (iso: string) => void
  invalid?: boolean
}

export default function DateField({ id, value, onChange, invalid }: DateFieldProps) {
  const initial = value ? parseIso(value) : new Date()
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() })
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const todayIso = toIso(new Date())

  useEffect(() => {
    if (!open) return
    const current = value ? parseIso(value) : new Date()
    setCursor({ year: current.getFullYear(), month: current.getMonth() })
  }, [open, value])

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }

    function placePanel() {
      const button = buttonRef.current
      const panel = panelRef.current
      if (!button) return
      const rect = button.getBoundingClientRect()
      const panelHeight = panel?.offsetHeight ?? 300
      const gap = 8
      const spaceBelow = window.innerHeight - rect.bottom - gap
      const top =
        spaceBelow >= Math.min(panelHeight, 160) || spaceBelow >= rect.top
          ? rect.bottom + gap
          : Math.max(8, rect.top - panelHeight - gap)
      setCoords({ top, left: rect.left, width: rect.width })
    }

    placePanel()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', placePanel)
    window.addEventListener('scroll', placePanel, true)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', placePanel)
      window.removeEventListener('scroll', placePanel, true)
    }
  }, [open, cursor.year, cursor.month])

  const cells = monthCells(cursor.year, cursor.month)
  const title = `Tháng ${cursor.month + 1}/${cursor.year}`

  return (
    <div className="relative min-w-0" ref={rootRef}>
      <button
        id={id}
        ref={buttonRef}
        type="button"
        className={`flex w-full items-center justify-between rounded-lg border bg-[var(--bg-2)] px-3 py-2 text-left text-base text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none md:text-sm ${
          invalid ? 'border-[var(--negative)]' : 'border-[var(--hairline)]'
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{formatDisplay(value)}</span>
        <span className="text-[var(--text-muted)]" aria-hidden>
          <CalendarIcon size={16} />
        </span>
      </button>

      {open
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label="Chọn ngày"
              className="fixed z-[80] rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-3 shadow-[0_8px_24px_var(--shadow)]"
              style={{
                top: coords?.top ?? 0,
                left: coords?.left ?? 0,
                width: coords?.width ?? 0,
                visibility: coords ? 'visible' : 'hidden',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
                  aria-label="Tháng trước"
                  onClick={() =>
                    setCursor((prev) => {
                      const date = new Date(prev.year, prev.month - 1, 1)
                      return { year: date.getFullYear(), month: date.getMonth() }
                    })
                  }
                >
                  ‹
                </button>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
                  aria-label="Tháng sau"
                  onClick={() =>
                    setCursor((prev) => {
                      const date = new Date(prev.year, prev.month + 1, 1)
                      return { year: date.getFullYear(), month: date.getMonth() }
                    })
                  }
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-1 text-center text-[11px] font-medium text-[var(--text-muted)]"
                  >
                    {day}
                  </div>
                ))}
                {cells.map((date) => {
                  const iso = toIso(date)
                  const inMonth = date.getMonth() === cursor.month
                  const isSelected = iso === value
                  const isToday = iso === todayIso
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                        isSelected
                          ? 'bg-[var(--gold)] font-semibold text-[var(--on-gold)]'
                          : isToday
                            ? 'font-semibold text-[var(--gold)] ring-1 ring-[var(--gold)]'
                            : inMonth
                              ? 'text-[var(--text-primary)]'
                              : 'text-[var(--text-muted)]'
                      }`}
                      onClick={() => {
                        onChange(iso)
                        setOpen(false)
                      }}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                className="mt-2 w-full rounded-lg py-1.5 text-sm font-medium text-[var(--gold)]"
                onClick={() => {
                  onChange(todayIso)
                  setOpen(false)
                }}
              >
                Hôm nay
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
