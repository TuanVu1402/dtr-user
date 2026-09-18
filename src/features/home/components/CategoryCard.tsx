import { HandshakeIcon } from '@/components'
import { formatPoints } from '@/utils/format'
import type { Category } from '@/types/dtr'

type CategoryCardProps = {
  category: Category
  onOpen: (category: Category, location?: string) => void
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
  clip: ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.6 9.2 5.2 4.8h13.6l1.6 4.4" />
      <rect x="3.2" y="9.2" width="17.6" height="11.2" rx="1.6" />
      <path d="m7 4.9 1.5 4.3" />
      <path d="m11 4.9 1.5 4.3" />
      <path d="m15 4.9 1.5 4.3" />
      <path d="m10 13.2 5 2.8-5 2.8Z" />
    </svg>
  ),
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
  const Icon = categoryIcons[category.icon]
  const colors = categoryColors[category.icon]
  const maxPoints = Math.max(...category.pointOptions.map((option) => option.points))
  const hasLocations = Boolean(category.locationLabels?.length)

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3 md:mb-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg md:h-12 md:w-12"
          style={{ background: colors.bg }}
        >
          <Icon size={20} color={colors.text} />
        </div>
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
