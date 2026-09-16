import { CrownIcon } from '@/components'
import { formatPoints } from '@/utils/format'
import type { Category } from '@/types/dtr'

type PointsProgressProps = {
  totalPoints: number
  nextTierAt: number
  tierName: string
  categories: Category[]
  pointBreakdown: { label: string; count: number }[]
}

const categoryIcons: Record<Category['icon'], React.ComponentType<{ size?: number; color?: string }>> = {
  booking: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5 4 10l3-3 3.5 3.5" />
      <path d="m11 12 2.5 2.5a1.5 1.5 0 0 0 2-2.24L12 8.5" />
      <path d="M15.5 9.5 20 14l-3 3-3.5-3.5" />
      <path d="M9 11 6.5 8.5" />
    </svg>
  ),
  training: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M8 10h5" />
      <path d="M8 13h3" />
    </svg>
  ),
  clip: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-3v10l-6-3" />
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
      <path d="M4 21V6l7-3 7 3v15" />
      <path d="M4 21h16" />
      <path d="M9 21v-5h4v5" />
      <path d="M9 10h.01M13.99 10h.01M9 14h.01M13.99 14h.01" />
    </svg>
  ),
}

const categoryColors: Record<Category['icon'], { bg: string; text: string }> = {
  booking: { bg: '#dbeafe', text: '#2563eb' },
  training: { bg: '#ede9fe', text: '#7c3aed' },
  clip: { bg: '#fce7f3', text: '#db2777' },
  checkin: { bg: '#dcfce7', text: '#16a34a' },
  office: { bg: '#fef3c7', text: '#d97706' },
}

export default function PointsProgress({ totalPoints, nextTierAt, tierName, categories, pointBreakdown }: PointsProgressProps) {
  const progressPercent = Math.min(100, Math.round((totalPoints / nextTierAt) * 100))
  const pointsToNextTier = nextTierAt - totalPoints

  return (
    <section className="pt-6 pb-2 md:px-0 md:pt-8 md:pb-6 lg:px-0 lg:pt-8 lg:pb-6">
      {/* Main Card */}
      <div className="mb-4 rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:mb-6 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs text-[var(--text-muted)] md:text-sm">Tổng điểm DTR</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[var(--gold-bright)] md:text-4xl lg:text-5xl">
                {formatPoints(totalPoints)}
              </span>
              <span className="text-sm text-[var(--text-muted)] md:text-base">/ {nextTierAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[var(--gold)]/[0.1] px-3 py-1.5 md:px-4 md:py-2">
            <CrownIcon size={14} color="var(--gold-bright)" />
            <span className="text-xs font-medium text-[var(--gold-bright)] md:text-sm">{tierName}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 md:mt-6">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5 md:text-sm">
            <span>{tierName}</span>
            <span>Hạng Vương Miện</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-2)] md:h-3">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs md:text-sm">
            <span className="text-[var(--text-muted)]">
              Còn <b className="text-[var(--gold-bright)]">{pointsToNextTier} điểm</b> để lên hạng
            </span>
            <span className="font-medium text-[var(--gold-bright)]">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Point Breakdown - Responsive grid */}
      <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 md:p-6 lg:p-8">
        <h3 className="mb-3 text-sm font-medium text-[var(--text-secondary)] md:text-base md:mb-4">
          Chi tiết điểm đã ghi nhận
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {pointBreakdown.map((item, index) => {
            const iconKey = categories[index]?.icon ?? 'office'
            const Icon = categoryIcons[iconKey]
            const colors = categoryColors[iconKey]
            return (
              <div
                className="flex items-center gap-3 rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] p-3 md:p-4"
                key={item.label}
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
                  <div className="text-xs text-[var(--text-muted)] truncate md:text-sm">
                    {item.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
