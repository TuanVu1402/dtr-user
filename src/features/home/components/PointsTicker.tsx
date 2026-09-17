import { useMemo } from 'react'
import { formatPoints } from '@/utils/format'
import type { AdminSubmission } from '@/types/dtr'

function SpeakerIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 6.5 6 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2l5 2.5V6.5Z" />
      <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  )
}

const FALLBACK_MESSAGES = [
  'Sàn đã booking thành công tại Vinhomes',
  'Check-in VPBH vừa được cộng 0,5 điểm',
  'Giao dịch mới vừa được duyệt +5 điểm',
]

type PointsTickerProps = {
  submissions: AdminSubmission[]
}

export default function PointsTicker({ submissions }: PointsTickerProps) {
  const messages = useMemo(() => {
    const fromSubmissions = submissions
      .filter((item) => item.status === 'approved')
      .slice(0, 12)
      .map((item) => `${item.userName} vừa được +${formatPoints(item.points)} điểm · ${item.categoryLabel}`)

    const list = fromSubmissions.length > 0 ? fromSubmissions : FALLBACK_MESSAGES
    return [...list, ...FALLBACK_MESSAGES]
  }, [submissions])

  const loop = [...messages, ...messages]

  return (
    <div className="mt-3 overflow-hidden rounded-xl bg-[linear-gradient(90deg,#f3d27a_0%,#e8b84a_50%,#f3d27a_100%)] px-3 py-2.5 lg:mt-4 lg:px-4 lg:py-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5b3b00]/15">
          <SpeakerIcon size={13} color="#5b3b00" />
        </span>
        <div
          className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18px,black_calc(100%-20px),transparent)]"
        >
          <div className="ticker-track">
            {loop.map((message, index) => (
              <span
                key={`${message}-${index}`}
                className="inline-flex shrink-0 items-center whitespace-nowrap px-4 text-[12px] font-semibold tracking-wide text-[#4a2f00]"
              >
                {message}
                <span className="mx-3 text-[#4a2f00]/40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
