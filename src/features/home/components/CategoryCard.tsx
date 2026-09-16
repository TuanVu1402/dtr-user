import { formatPoints } from '@/utils/format'
import type { Category } from '@/types/dtr'

type CategoryCardProps = {
  category: Category
  onOpen: (category: Category) => void
}

const categoryColors: Record<Category['icon'], { bg: string; text: string }> = {
  booking: { bg: '#dbeafe', text: '#2563eb' },
  training: { bg: '#ede9fe', text: '#7c3aed' },
  clip: { bg: '#fce7f3', text: '#db2777' },
  checkin: { bg: '#dcfce7', text: '#16a34a' },
  office: { bg: '#fef3c7', text: '#d97706' },
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

const ArrowRightIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export default function CategoryCard({ category, onOpen }: CategoryCardProps) {
  const Icon = categoryIcons[category.icon]
  const colors = categoryColors[category.icon]
  const maxPoints = Math.max(...category.pointOptions.map((option) => option.points))

  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3 md:mb-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg md:h-12 md:w-12"
          style={{ background: colors.bg }}
        >
          <Icon size={20} color={colors.text} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] md:text-base">
            {category.title}
          </h3>
          {category.audienceTag && (
            <span className="w-fit rounded-full bg-[var(--gold)]/[0.1] px-2 py-0.5 text-[10px] font-medium text-[var(--gold-bright)] md:text-xs">
              {category.audienceTag}
            </span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="text-lg font-bold text-[var(--gold-bright)] md:text-xl">
            {formatPoints(maxPoints)}
          </span>
          <span className="ml-1 text-xs text-[var(--text-muted)] md:text-sm">điểm</span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs text-[var(--text-tertiary)] line-clamp-2 md:mb-4 md:text-sm">
        {category.description}
      </p>

      {/* Location Labels */}
      {category.locationLabels && category.locationLabels.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2 md:mb-4">
          {category.locationLabels.map((location) => (
            <button
              type="button"
              className="rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-3)] md:text-sm md:px-3 md:py-1.5"
              key={location}
              onClick={() => onOpen(category)}
            >
              {location}
            </button>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--gold)] py-2.5 text-sm font-medium text-[var(--on-gold)] transition-colors hover:bg-[var(--gold-deep)] md:py-3 md:text-base"
        type="button"
        onClick={() => onOpen(category)}
      >
        {category.id === 'training-kickoff' ? 'Nộp thủ công' : 'Nộp minh chứng'}
        <ArrowRightIcon size={14} />
      </button>
    </div>
  )
}
