import { formatPoints } from '@/utils/format'
import { profileFieldStyles } from './profileStyles'

const { statCardClass } = profileFieldStyles

type ProfileStatsProps = {
  approvedCount: number
  pendingCount: number
  approvalRate: number
}

export default function ProfileStats({ approvedCount, pendingCount, approvalRate }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
      <div className={statCardClass}>
        <div className="text-[24px] font-extrabold text-[var(--positive)] md:text-[32px] lg:text-[36px]">
          {approvedCount}
        </div>
        <div className="mt-1 text-[13px] text-[var(--text-tertiary)] md:text-sm">
          Minh chứng đã duyệt
        </div>
      </div>
      <div className={statCardClass}>
        <div className="text-[24px] font-extrabold text-[var(--gold-bright)] md:text-[32px] lg:text-[36px]">
          {pendingCount}
        </div>
        <div className="mt-1 text-[13px] text-[var(--text-tertiary)] md:text-sm">
          Đang chờ duyệt
        </div>
      </div>
      <div className={statCardClass}>
        <div className="text-[24px] font-extrabold text-[var(--text-primary)] md:text-[32px] lg:text-[36px]">
          {approvalRate}%
        </div>
        <div className="mt-1 text-[13px] text-[var(--text-tertiary)] md:text-sm">
          Tỷ lệ được duyệt
        </div>
      </div>
    </div>
  )
}
