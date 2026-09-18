import { profileFieldStyles } from './profileStyles'

const { statCardClass } = profileFieldStyles

type ProfileStatsProps = {
  approvedCount: number
  pendingCount: number
  approvalRate: number
}

export default function ProfileStats({ approvedCount, pendingCount, approvalRate }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6">
      <div className={statCardClass}>
        <div className="text-[22px] leading-none font-extrabold text-[var(--positive)] md:text-[32px] lg:text-[36px]">
          {approvedCount}
        </div>
        <div className="mt-1.5 text-[11px] leading-tight text-[var(--text-tertiary)] md:mt-1 md:text-sm">
          <span className="md:hidden">Đã duyệt</span>
          <span className="hidden md:inline">Minh chứng đã duyệt</span>
        </div>
      </div>
      <div className={statCardClass}>
        <div className="text-[22px] leading-none font-extrabold text-[var(--gold-bright)] md:text-[32px] lg:text-[36px]">
          {pendingCount}
        </div>
        <div className="mt-1.5 text-[11px] leading-tight text-[var(--text-tertiary)] md:mt-1 md:text-sm">
          <span className="md:hidden">Chờ duyệt</span>
          <span className="hidden md:inline">Đang chờ duyệt</span>
        </div>
      </div>
      <div className={statCardClass}>
        <div className="text-[22px] leading-none font-extrabold text-[var(--text-primary)] md:text-[32px] lg:text-[36px]">
          {approvalRate}%
        </div>
        <div className="mt-1.5 text-[11px] leading-tight text-[var(--text-tertiary)] md:mt-1 md:text-sm">
          <span className="md:hidden">Tỷ lệ duyệt</span>
          <span className="hidden md:inline">Tỷ lệ được duyệt</span>
        </div>
      </div>
    </div>
  )
}
