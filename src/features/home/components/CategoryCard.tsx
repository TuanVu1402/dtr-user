import { formatPoints } from '@/utils/format'
import type { Category } from '@/types/dtr'

type CategoryCardProps = {
  category: Category
  onOpen: (category: Category, location?: string) => void
}

const RANK_PALETTE = [
  { bg: '#fecaca', text: '#b91c1c' },
  { bg: '#fed7aa', text: '#c2410c' },
  { bg: '#fde68a', text: '#a16207' },
  { bg: '#bbf7d0', text: '#15803d' },
  { bg: '#bfdbfe', text: '#1d4ed8' },
  { bg: '#f9a8d4', text: '#9d174d' },
  { bg: '#e9d5ff', text: '#6d28d9' },
  { bg: '#f3d19a', text: '#92400e' },
] as const

function ordinalSuffix(rank: number) {
  if (rank === 1) return 'st'
  if (rank === 2) return 'nd'
  if (rank === 3) return 'rd'
  return 'th'
}

function RankBadge({ rank }: { rank: number }) {
  const palette = RANK_PALETTE[Math.min(Math.max(rank, 1), RANK_PALETTE.length) - 1]
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg md:h-12 md:w-12"
      style={{ background: palette.bg, color: palette.text }}
    >
      <span className="text-[17px] font-extrabold leading-none md:text-[19px]">
        {rank}
        <sup className="ml-px text-[9px] font-extrabold leading-none md:text-[10px]">{ordinalSuffix(rank)}</sup>
      </span>
    </div>
  )
}

const ArrowRightIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.22" />
    <path
      d="M10 8.2 14.6 12 10 15.8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const QrIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3" />
    <path d="M20 14v3h-3" />
    <path d="M14 20h6" />
  </svg>
)

export default function CategoryCard({ category, onOpen }: CategoryCardProps) {
  const rank = Number.parseInt(category.number, 10) || 1
  const maxPoints = Math.max(...category.pointOptions.map((option) => option.points))
  const hasLocations = Boolean(category.locationLabels?.length)

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3 md:mb-4">
        <RankBadge rank={rank} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3
            className={`whitespace-pre-line text-sm font-semibold leading-snug text-[var(--text-primary)] md:text-base ${hasLocations ? 'min-h-[3lh]' : ''}`}
          >
            {category.title}
          </h3>
          {(category.audienceTag || category.audienceTags?.length) && (
            <div className="flex flex-wrap gap-1">
              {category.audienceTag && (
                <span className="w-fit rounded-full bg-[var(--gold)]/[0.1] px-2 py-0.5 text-[10px] font-medium text-[var(--gold-bright)] md:text-xs">
                  {category.audienceTag}
                </span>
              )}
              {category.audienceTags?.map((tag) => (
                <span
                  key={tag}
                  className="w-fit rounded-full bg-[var(--gold)]/[0.1] px-2 py-0.5 text-[10px] font-medium text-[var(--gold-bright)] md:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="text-lg font-bold text-[var(--gold-bright)] md:text-xl">
            {formatPoints(maxPoints)}
          </span>
          <span className="ml-1 text-xs text-[var(--text-muted)] md:text-sm">điểm</span>
        </div>
      </div>

      {category.description ? (
        <p className="mb-3 text-xs text-[var(--text-tertiary)] md:mb-4 md:text-sm">
          {category.description}
        </p>
      ) : null}

      <button
        className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--gold)] py-2.5 text-sm font-medium text-[var(--on-gold)] transition-colors hover:bg-[var(--gold-deep)] md:py-3 md:text-base"
        type="button"
        onClick={() => onOpen(category)}
      >
        {category.qrCheckin ? (
          <>
            Quét mã QR
            <QrIcon size={15} />
          </>
        ) : (
          <>
            Nộp minh chứng
            <ArrowRightIcon size={14} />
          </>
        )}
      </button>

      {category.locationLabels && category.locationLabels.length > 0 && (
        <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5 md:mt-4">
          {category.locationLabels.map((location) => (
            <button
              type="button"
              className="inline-flex max-w-full shrink-0 items-center rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-3)] md:px-2.5 md:py-1 md:text-xs"
              key={location}
              onClick={() => onOpen(category, location)}
            >
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
