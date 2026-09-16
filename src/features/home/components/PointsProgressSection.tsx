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

const breakdownAccents: Record<Category['icon'], { fg: string; bg: string; border: string }> = {
  booking: { fg: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.28)' },
  training: { fg: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.28)' },
  clip: { fg: '#db2777', bg: 'rgba(219, 39, 119, 0.12)', border: 'rgba(219, 39, 119, 0.28)' },
  checkin: { fg: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.28)' },
  office: { fg: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.28)' },
}

export default function PointsProgress({ totalPoints, nextTierAt, tierName, categories, pointBreakdown }: PointsProgressProps) {
  const progressPercent = Math.min(100, Math.round((totalPoints / nextTierAt) * 100))
  const pointsToNextTier = nextTierAt - totalPoints

  return (
    <section className="flex px-11 pt-11 pb-2 max-[640px]:px-5">
      <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-[rgba(212,175,106,0.4)] bg-(--surface-1) px-10 py-9 shadow-[0_16px_36px_var(--shadow)] before:absolute before:-top-[120px] before:-right-[100px] before:h-[280px] before:w-[280px] before:rounded-full before:bg-[radial-gradient(circle,rgba(212,175,106,0.22),transparent_70%)] before:pointer-events-none before:content-[''] dark:bg-[linear-gradient(135deg,rgba(212,175,106,0.1),color-mix(in_srgb,var(--surface-1)_40%,transparent))] max-[640px]:gap-5 max-[640px]:px-5 max-[640px]:py-6">
        <div className="relative z-[1] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold tracking-[1.5px] text-(--text-tertiary) uppercase">
              Tổng điểm DTR hiện tại
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] bg-clip-text font-['Open_Sans',sans-serif] text-[64px] leading-none font-extrabold text-transparent max-[640px]:text-[48px]">
                {formatPoints(totalPoints)}
              </span>
              <span className="font-['Open_Sans',sans-serif] text-[20px] font-bold text-(--text-tertiary)">
                / {nextTierAt} điểm
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-full bg-[linear-gradient(90deg,#c79a43,#f3d98b)] py-2.5 pr-4.5 pl-3 text-[13px] font-bold whitespace-nowrap text-[#4a3610] shadow-[0_8px_18px_rgba(199,154,67,0.35)]">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.45)]">
              <CrownIcon size={13} color="#4a3610" />
            </span>
            {tierName}
          </div>
        </div>

        <div className="relative z-[1] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 text-[11px] font-extrabold tracking-[0.8px] text-(--text-muted) uppercase">
            <span>{tierName}</span>
            <span>Hạng Vương Miện</span>
          </div>

          <div className="relative">
            <div className="h-3 overflow-hidden rounded-full bg-(--hairline)">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#c79a43,#f3d98b)] transition-[width] duration-[400ms] ease-in-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span
              className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-(--surface-1) bg-[#e0a92e] shadow-[0_2px_10px_rgba(199,154,67,0.7)] transition-[left] duration-[400ms] ease-in-out"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] text-(--text-secondary)">
              Còn <b className="text-[#8a6a1f] dark:text-[#f3d98b]">{pointsToNextTier} điểm</b> nữa để lên
              hạng tiếp theo
            </div>
            <div className="shrink-0 font-['Open_Sans',sans-serif] text-[15px] font-extrabold text-[#8a6a1f] dark:text-[#f3d98b]">
              {progressPercent}%
            </div>
          </div>
        </div>

        <div className="relative z-[1] flex flex-col gap-3 border-t border-(--hairline) pt-5">
          <div className="text-xs font-extrabold tracking-[0.6px] text-(--text-tertiary) uppercase">
            Chi tiết điểm đã ghi nhận
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 max-[640px]:grid-cols-2 max-[640px]:gap-2.5">
            {pointBreakdown.map((item, index) => {
              const iconKey = categories[index]?.icon ?? 'office'
              const Icon = categoryIcons[iconKey]
              const accent = breakdownAccents[iconKey]
              return (
                <div
                  className={`group relative flex min-w-0 flex-col gap-2.5 overflow-hidden rounded-lg border border-(--hairline) bg-(--surface-tint) px-4 pt-4 pb-3.5 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_var(--shadow)] max-[640px]:px-3 max-[640px]:pt-3.5 max-[640px]:pb-3 ${
                    item.count === 0 ? 'opacity-55' : ''
                  }`}
                  key={item.label}
                  style={{ borderColor: item.count === 0 ? undefined : accent.border }}
                >
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: accent.fg }}
                  />

                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border transition-transform duration-150 group-hover:scale-[1.08] max-[640px]:h-[30px] max-[640px]:w-[30px]"
                      style={{ background: accent.bg, borderColor: accent.border }}
                    >
                      <Icon size={16} color={accent.fg} />
                    </div>
                    <span className="font-['Open_Sans',sans-serif] text-[26px] leading-none font-extrabold text-(--text-primary) max-[640px]:text-[22px]">
                      {item.count}
                    </span>
                  </div>

                  <div className="text-[11.5px] leading-[1.3] font-semibold break-words text-(--text-tertiary) max-[640px]:text-[10.5px]">
                    {item.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
