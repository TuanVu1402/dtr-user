import { CrownIcon } from '@/components'
import { formatPoints } from '@/utils/format'

type PointsProgressProps = {
  totalPoints: number
  nextTierAt: number
  tierName: string
}

export default function PointsProgress({ totalPoints, nextTierAt, tierName }: PointsProgressProps) {
  const progressPercent = Math.min(100, Math.round((totalPoints / nextTierAt) * 100))
  const pointsToNextTier = nextTierAt - totalPoints

  return (
    <section className="pt-6 pb-2 md:px-0 md:pt-8 md:pb-6 lg:px-0 lg:pt-8 lg:pb-6">
      <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:p-6 lg:p-8">
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

        <div className="mt-4 md:mt-6">
          <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--text-muted)] md:text-sm">
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
    </section>
  )
}
