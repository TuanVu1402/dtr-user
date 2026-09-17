import { CrownIcon, StarIcon } from '@/components'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { formatPoints } from '@/utils/format'

export type LeaderboardEntry = {
  name: string
  points: number
  avatarUrl?: string
  accuracy?: number
  rank?: number
}

const medalColors: Record<number, { bg: string; border: string; text: string; rankBg: string; step: string }> = {
  1: {
    bg: '#fef3c7',
    border: '#f5c542',
    text: '#92400e',
    rankBg: '#f5c542',
    step: 'linear-gradient(180deg, #ffe08a 0%, #f5c542 55%, #e0a81f 100%)',
  },
  2: {
    bg: '#f3f4f6',
    border: '#9ca3af',
    text: '#374151',
    rankBg: '#9ca3af',
    step: 'linear-gradient(180deg, #f3f4f6 0%, #d1d5db 60%, #9ca3af 100%)',
  },
  3: {
    bg: '#fed7aa',
    border: '#f97316',
    text: '#9a3412',
    rankBg: '#f97316',
    step: 'linear-gradient(180deg, #fed7aa 0%, #fb923c 60%, #ea580c 100%)',
  },
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

type LeaderboardPodiumProps = {
  podium: LeaderboardEntry[]
}

export function LeaderboardPodium({ podium }: LeaderboardPodiumProps) {
  if (podium.length === 0) return null

  const slots = [podium[1], podium[0], podium[2]]
  const slotRanks = [2, 1, 3]
  const stepHeight: Record<number, string> = {
    1: 'h-[92px] md:h-[120px]',
    2: 'h-[64px] md:h-[84px]',
    3: 'h-[52px] md:h-[68px]',
  }
  const avatarSize: Record<number, string> = {
    1: 'h-[4.5rem] w-[4.5rem] md:h-24 md:w-24 text-base',
    2: 'h-16 w-16 md:h-20 md:w-20 text-sm',
    3: 'h-14 w-14 md:h-[4.5rem] md:w-[4.5rem] text-sm',
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] px-3 pb-0 pt-5 md:px-6 md:pt-7">
      <div className="grid grid-cols-3 items-end gap-2 md:gap-5">
        {slots.map((entry, index) => {
          const rank = slotRanks[index]
          if (!entry) return <div key={`empty-${rank}`} />
          const colors = medalColors[rank]
          const isMe = entry.name === CURRENT_USER_NAME

          return (
            <div className="flex min-w-0 flex-col items-center" key={entry.name}>
              <div className="flex w-full flex-col items-center gap-1 px-0.5 pb-2">
                <div
                  className={`flex items-center justify-center rounded-full p-1.5 ${
                    rank === 1 ? 'animate-crown-blink' : ''
                  }`}
                  style={{ background: colors.bg, border: `2px solid ${colors.border}` }}
                >
                  <CrownIcon size={rank === 1 ? 20 : 13} color={colors.rankBg} filled />
                </div>

                <div className={`relative ${rank === 1 ? 'animate-[champion-glow_2.8s_ease-in-out_infinite] rounded-full' : ''}`}>
                  <div
                    className={`flex items-center justify-center overflow-hidden rounded-full font-semibold ring-[3px] ring-white ${avatarSize[rank]}`}
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {entry.avatarUrl ? (
                      <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                    ) : (
                      getInitials(entry.name)
                    )}
                  </div>
                </div>

                <span className="mt-1 w-full px-0.5 text-center text-[11px] leading-tight font-semibold break-words text-[var(--text-primary)] md:text-sm md:leading-normal">
                  {entry.name}
                </span>
                {isMe && (
                  <span className="rounded-full bg-[var(--gold)] px-2 py-px text-[10px] font-medium text-[var(--on-gold)]">
                    Bạn
                  </span>
                )}
                <span className="text-xs font-bold md:text-sm" style={{ color: colors.rankBg }}>
                  {formatPoints(entry.points)}
                </span>
                {typeof entry.accuracy === 'number' && (
                  <span className="text-[10px] font-medium md:text-xs" style={{ color: colors.text }}>
                    {entry.accuracy.toFixed(2)}%
                  </span>
                )}
              </div>

              <div
                className={`relative w-full overflow-hidden rounded-t-2xl ${stepHeight[rank]}`}
                style={{ background: colors.step }}
              >
                {rank === 1 && (
                  <span className="pointer-events-none absolute inset-0 animate-[medal-shine_3.6s_ease-in-out_infinite] bg-white/25" />
                )}
                <span className="relative flex h-full items-center justify-center text-2xl font-black text-white md:text-4xl">
                  {rank}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type LeaderboardListProps = {
  entries: LeaderboardEntry[]
  startRank?: number
}

export function LeaderboardList({ entries, startRank = 4 }: LeaderboardListProps) {
  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, index) => {
        const rank = entry.rank ?? index + startRank
        const isMe = entry.name === CURRENT_USER_NAME

        return (
          <div
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 md:px-4 md:py-3 ${
              isMe
                ? 'border-[var(--gold)]/[0.4] bg-[var(--gold)]/[0.05]'
                : 'border-[var(--hairline)] bg-[var(--surface-1)]'
            }`}
            key={entry.name}
          >
            <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-2)] px-1 text-xs font-semibold text-[var(--text-muted)] md:h-8 md:min-w-8 md:text-sm">
              #{rank}
            </span>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--gold)]/[0.15] text-xs font-semibold text-[var(--gold-bright)] md:h-11 md:w-11">
              {entry.avatarUrl ? (
                <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
              ) : (
                getInitials(entry.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-[var(--text-primary)] md:text-base">
                  {entry.name}
                </span>
                {isMe && (
                  <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-medium text-[var(--on-gold)]">
                    Bạn
                  </span>
                )}
              </div>
              {typeof entry.accuracy === 'number' && (
                <p className="text-[11px] text-[var(--text-muted)]">Chính xác: {entry.accuracy.toFixed(2)}%</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <StarIcon size={12} color="var(--gold)" />
              <span className="text-sm font-bold text-[var(--gold-bright)]">
                {formatPoints(entry.points)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
