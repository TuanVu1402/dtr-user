import { useMemo, useState } from 'react'
import { CloseIcon, HandshakeIcon, ClipIcon, StatusBadge } from '@/components'
import { formatPoints } from '@/utils/format'
import type { AdminSubmission, Category } from '@/types/dtr'

type PointsBreakdownProps = {
  categories: Category[]
  pointBreakdown: { label: string; count: number }[]
  entries?: AdminSubmission[]
}

const categoryIcons: Record<Category['icon'], React.ComponentType<{ size?: number; color?: string }>> = {
  booking: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h4" />
    </svg>
  ),
  deal: HandshakeIcon,
  training: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M8 10h5" />
      <path d="M8 13h3" />
    </svg>
  ),
  clip: ClipIcon,
  megaphone: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 10h3.4L16 6v12l-8.1-4H4.5a1.5 1.5 0 0 1-1.5-1.5v-1A1.5 1.5 0 0 1 4.5 10Z" />
      <path d="M18.4 9.1a3.4 3.4 0 0 1 0 5.8" />
      <path d="M8.4 16.4 7.3 20h3.4" />
    </svg>
  ),
  checkin: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
      <path d="M17.5 9.5 19 11l3-3" />
    </svg>
  ),
  office: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  ),
  pin: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
      <path d="M19 6.2V4.8" />
    </svg>
  ),
}

const categoryColors: Record<Category['icon'], { bg: string; text: string }> = {
  booking: { bg: '#dbeafe', text: '#2563eb' },
  deal: { bg: '#ccfbf1', text: '#0f766e' },
  training: { bg: '#ede9fe', text: '#7c3aed' },
  clip: { bg: '#fce7f3', text: '#db2777' },
  megaphone: { bg: '#ffedd5', text: '#ea580c' },
  checkin: { bg: '#dcfce7', text: '#16a34a' },
  office: { bg: '#fef3c7', text: '#d97706' },
  pin: { bg: '#e0f2fe', text: '#0284c7' },
}

const breakdownMatchers: ((label: string) => boolean)[] = [
  (label) => label.includes('training') || label.includes('kick'),
  (label) => label.includes('sự kiện'),
  (label) => label.includes('booking'),
  (label) => label.includes('giao dịch'),
  (label) => label.includes('dtlo') || label.includes('clip chất'),
  (label) =>
    (label.includes('gđkd') || label.includes('gđda') || label.includes('clip')) &&
    !label.includes('dtlo') &&
    !label.includes('clip chất'),
  (label) =>
    label.includes('vpbh') &&
    (label.includes('tphcm') ||
      label.includes('đặc biệt') ||
      label.includes('vin') ||
      label.includes('cần giờ') ||
      label.includes('hóc môn') ||
      label.includes('green city')),
  (label) =>
    label.includes('vpbh') &&
    (label.includes('0,5') ||
      label.includes('đà nẵng') ||
      label.includes('nha trang') ||
      label.includes('vũng tàu') ||
      label.includes('hải vân') ||
      label.includes('blanca') ||
      label.includes('maia') ||
      label.includes('charmora') ||
      label.includes('pearl')),
]

function entriesForBreakdown(index: number, entries: AdminSubmission[]) {
  const matches = breakdownMatchers[index]
  if (!matches) return []
  return entries.filter((entry) => matches(entry.categoryLabel.toLowerCase()))
}

export default function PointsBreakdown({
  categories,
  pointBreakdown,
  entries = [],
}: PointsBreakdownProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const selected = useMemo(() => {
    if (selectedIndex === null) return null
    const item = pointBreakdown[selectedIndex]
    if (!item) return null
    const category = categories[selectedIndex]
    return {
      item,
      category,
      related: entriesForBreakdown(selectedIndex, entries),
    }
  }, [selectedIndex, pointBreakdown, categories, entries])

  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 md:p-6 lg:p-8">
      <h3 className="mb-3 text-sm font-medium text-[var(--text-secondary)] md:mb-4 md:text-base">
        Chi tiết điểm đã ghi nhận
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {pointBreakdown.map((item, index) => {
          const iconKey = categories[index]?.icon ?? 'office'
          const Icon = categoryIcons[iconKey]
          const colors = categoryColors[iconKey]
          return (
            <button
              type="button"
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] p-3 text-left transition-colors hover:border-[var(--gold)] md:items-center md:gap-3 md:p-4"
              key={item.label}
              onClick={() => setSelectedIndex(index)}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg md:h-10 md:w-10"
                style={{ background: colors.bg }}
              >
                <Icon size={14} color={colors.text} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold text-[var(--text-primary)] md:text-xl">
                  {item.count}
                </div>
                <div className="text-[11px] leading-snug break-words text-[var(--text-muted)] md:text-sm">
                  {item.label}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--scrim)] p-0 md:items-center md:p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="flex max-h-[92svh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:rounded-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-labelledby="points-detail-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                {selected.category ? (
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: categoryColors[selected.category.icon].bg }}
                  >
                    {(() => {
                      const Icon = categoryIcons[selected.category.icon]
                      return (
                        <Icon size={18} color={categoryColors[selected.category.icon].text} />
                      )
                    })()}
                  </div>
                ) : null}
                <div className="min-w-0">
                  <h4
                    id="points-detail-title"
                    className="m-0 text-base font-semibold text-[var(--text-primary)]"
                  >
                    {selected.item.label}
                  </h4>
                  <p className="mt-1 m-0 text-sm text-[var(--text-secondary)]">
                    Đã ghi nhận {selected.item.count} lần
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
                aria-label="Đóng"
                onClick={() => setSelectedIndex(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {selected.category ? (
              <>
                <p className="m-0 text-sm font-medium text-[var(--text-primary)]">
                  {selected.category.title}
                </p>
                {selected.category.description ? (
                  <p className="m-0 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {selected.category.description}
                  </p>
                ) : null}
                {selected.category.locationLabels?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selected.category.locationLabels.map((location) => (
                      <span
                        key={location}
                        className="rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] px-2.5 py-1 text-xs text-[var(--text-secondary)]"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="m-0 text-right text-base font-bold text-[var(--gold-bright)]">
                  +{formatPoints(selected.category.pointOptions[0]?.points ?? 0)} điểm / lần
                </p>
              </>
            ) : null}

            {selected.related.length > 0 ? (
              <div>
                <p className="mb-2 m-0 text-xs font-semibold text-[var(--text-secondary)]">
                  Minh chứng đã nộp
                </p>
                <ul className="m-0 flex list-none flex-col divide-y divide-[var(--hairline)] rounded-lg border border-[var(--hairline)] p-0">
                  {selected.related.map((entry) => (
                    <li className="flex items-start justify-between gap-3 px-3 py-2.5" key={entry.id}>
                      <div className="min-w-0">
                        <p className="m-0 text-sm font-medium text-[var(--text-primary)]">
                          {entry.categoryLabel}
                        </p>
                        <p className="mt-0.5 m-0 text-xs text-[var(--text-tertiary)]">
                          {entry.description}
                        </p>
                        <p className="mt-1 m-0 text-[11px] text-[var(--text-muted)]">{entry.date}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusBadge status={entry.status} />
                        <span
                          className={`text-sm font-bold ${
                            entry.status === 'approved'
                              ? 'text-[var(--gold-bright)]'
                              : entry.status === 'rejected'
                                ? 'text-[var(--negative)]'
                                : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {entry.status === 'approved' ? '+' : ''}
                          {formatPoints(entry.points)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="m-0 text-sm text-[var(--text-tertiary)]">
                Chưa có minh chứng chi tiết cho hạng mục này.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
