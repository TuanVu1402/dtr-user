import { StarIcon } from '@/components'
import { formatPoints } from '@/utils/format'
import type { Category } from '@/types/dtr'

type CategoryCardProps = {
  category: Category
  onOpen: (category: Category) => void
  onOpenQrScanner: () => void
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

const breakdownAccents: Record<Category['icon'], { fg: string; bg: string; border: string }> = {
  booking: { fg: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.28)' },
  training: { fg: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.28)' },
  clip: { fg: '#db2777', bg: 'rgba(219, 39, 119, 0.12)', border: 'rgba(219, 39, 119, 0.28)' },
  checkin: { fg: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.28)' },
  office: { fg: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.28)' },
}

const ArrowRightIcon = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export default function CategoryCard({ category, onOpen, onOpenQrScanner }: CategoryCardProps) {
  const Icon = categoryIcons[category.icon]
  const accent = breakdownAccents[category.icon]
  const maxPoints = Math.max(...category.pointOptions.map((option) => option.points))

  return (
    <div className="group relative flex flex-col gap-4.5 overflow-hidden rounded-xl border border-(--hairline) bg-(--surface-1) p-6.5 shadow-[0_10px_28px_var(--shadow)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_var(--shadow-strong)] max-[480px]:p-5">
      <span
        className="pointer-events-none absolute -top-[90px] -right-[70px] h-[220px] w-[220px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${accent.bg}, transparent 70%)` }}
      />

      <div className="relative z-[1] flex flex-col gap-3">
        <span className="text-[11px] font-extrabold tracking-[1.2px] text-(--text-muted) uppercase">
          Hạng mục {category.number}
        </span>

        <div className="flex items-start gap-4 max-[480px]:gap-3">
          <div
            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[10px] border transition-transform duration-200 group-hover:scale-105"
            style={{ background: accent.bg, borderColor: accent.border }}
          >
            <Icon size={24} color={accent.fg} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <h3 className="m-0 font-['Open_Sans',sans-serif] text-[18px] leading-[1.35] font-extrabold text-(--text-primary)">
              {category.title}
            </h3>
            {category.audienceTag && (
              <span className="w-fit rounded-full border border-[rgba(37,99,235,0.35)] bg-[rgba(37,99,235,0.14)] px-2.5 py-1 text-[11px] font-bold tracking-[0.4px] text-(--gold-bright)">
                {category.audienceTag}
              </span>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end max-[480px]:hidden">
            <span className="font-['Open_Sans',sans-serif] text-[22px] leading-none font-extrabold text-(--gold-bright)">
              {formatPoints(maxPoints)}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.8px] text-(--text-muted) uppercase">
              {category.pointOptions.length > 1 ? 'điểm tối đa' : 'điểm'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-[1] flex flex-col gap-2.5">
        <p className="m-0 text-[13.5px] leading-[1.6] text-(--text-tertiary)">{category.description}</p>
        {category.locationLabels && category.locationLabels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {category.locationLabels.map((location) => (
              <button
                type="button"
                className="cursor-pointer rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.1)] px-3 py-1 font-inherit text-xs font-bold text-(--gold-bright) transition-[background,border-color] duration-150 hover:border-[rgba(37,99,235,0.5)] hover:bg-[rgba(37,99,235,0.18)]"
                key={location}
                onClick={() => onOpen(category)}
              >
                {location}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-[1] flex flex-wrap gap-2 border-t border-(--hairline) pt-4">
        {category.pointOptions.map((option) => (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.08)] px-3.5 py-2 text-xs font-bold whitespace-nowrap text-(--gold-bright)"
            key={option.label}
          >
            <StarIcon size={12} color={accent.fg} />
            {option.label === 'Điểm'
              ? `${formatPoints(option.points)} điểm`
              : `${option.label} · ${formatPoints(option.points)} điểm`}
          </span>
        ))}
        {category.id === 'training-kickoff' && (
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[rgba(76,175,130,0.4)] bg-[rgba(76,175,130,0.12)] px-3.5 py-2 font-inherit text-xs font-bold whitespace-nowrap text-(--positive) transition-[background,border-color] duration-150 hover:border-[rgba(76,175,130,0.6)] hover:bg-[rgba(76,175,130,0.22)]"
            onClick={onOpenQrScanner}
          >
            Quét QR tự động
          </button>
        )}
      </div>

      <button
        className="relative z-[1] flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-4 py-3 font-['Open_Sans',sans-serif] text-sm font-bold whitespace-nowrap text-(--on-gold) shadow-[0_8px_20px_rgba(37,99,235,0.28)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_12px_26px_rgba(37,99,235,0.4)]"
        type="button"
        onClick={() => onOpen(category)}
      >
        {category.id === 'training-kickoff' ? 'Nộp thủ công' : 'Nộp minh chứng'}
        <span className="inline-flex transition-transform duration-200 group-hover:translate-x-1">
          <ArrowRightIcon color="#ffffff" />
        </span>
      </button>
    </div>
  )
}
