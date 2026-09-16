import { formatPoints } from '@/utils/format'
import { profileFieldStyles } from './profileStyles'

const { statCardClass } = profileFieldStyles

type ProfileStatsProps = {
  totalPoints: number
  approvedCount: number
  pendingCount: number
  approvalRate: number
}

export default function ProfileStats({ totalPoints, approvedCount, pendingCount, approvalRate }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 max-[720px]:grid-cols-2">
      <div className={statCardClass}>
        <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--gold-bright)">
          {formatPoints(totalPoints)}
        </div>
        <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Tổng điểm DTR</div>
      </div>
      <div className={statCardClass}>
        <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--positive)">
          {approvedCount}
        </div>
        <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Minh chứng đã duyệt</div>
      </div>
      <div className={statCardClass}>
        <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--gold-bright)">
          {pendingCount}
        </div>
        <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Đang chờ duyệt</div>
      </div>
      <div className={statCardClass}>
        <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--text-primary)">
          {approvalRate}%
        </div>
        <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Tỷ lệ được duyệt</div>
      </div>
    </div>
  )
}
