import { useState } from 'react'
import { CrownIcon, StarIcon } from '@/components'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { formatPoints } from '@/utils/format'

export type LeaderboardEntry = {
  name: string
  points: number
  avatarUrl?: string
}

const medalColors: Record<number, { bg: string; border: string; text: string; rankBg: string }> = {
  1: { bg: '#fef3c7', border: '#fbbf24', text: '#92400e', rankBg: '#fbbf24' },
  2: { bg: '#f3f4f6', border: '#9ca3af', text: '#374151', rankBg: '#9ca3af' },
  3: { bg: '#fed7aa', border: '#f97316', text: '#9a3412', rankBg: '#f97316' },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

type LeaderboardPodiumProps = {
  podium: LeaderboardEntry[]
}

export function LeaderboardPodium({ podium }: LeaderboardPodiumProps) {
  if (podium.length === 0) return null

  const podiumDisplayOrder = [podium[1], podium[0], podium[2]]

  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 md:p-6 lg:p-8">
      {/* Avatar & Info Row - Responsive sizing */}
      <div className="grid grid-cols-3 items-end gap-2 md:gap-4 lg:gap-6">
        {podiumDisplayOrder.map((entry, slotIndex) => {
          if (!entry) return <div key={`empty-${slotIndex}`} />
          const rank = podium.indexOf(entry) + 1
          const isMe = entry.name === CURRENT_USER_NAME
          const colors = medalColors[rank]

          // Responsive sizing for different screen sizes
          const crownSize = rank === 1 ? 18 : 14
          const avatarSize = 'lg:h-20 lg:w-20 md:h-16 md:w-16 h-14 w-14'

          return (
            <div className="flex flex-col items-center gap-2 md:gap-3" key={entry.name}>
              {/* Crown */}
              <div
                className="flex items-center justify-center rounded-full p-1.5 md:p-2"
                style={{ background: colors.bg, border: `2px solid ${colors.border}` }}
              >
                <CrownIcon size={crownSize} color={colors.text} />
              </div>

              {/* Avatar */}
              <div
                className={`flex items-center justify-center rounded-full text-sm font-semibold md:text-base ${avatarSize}`}
                style={{ background: colors.bg, color: colors.text }}
              >
                {entry.avatarUrl ? (
                  <img className="h-full w-full rounded-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                ) : (
                  getInitials(entry.name)
                )}
              </div>

              {/* Name */}
              <span className="text-sm font-medium text-[var(--text-primary)] text-center line-clamp-1 max-w-full md:text-base">
                {entry.name}
              </span>

              {/* "Bạn" badge */}
              {isMe && (
                <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-medium text-[var(--on-gold)] md:text-xs">
                  Bạn
                </span>
              )}

              {/* Points */}
              <div className="flex items-center gap-1 rounded-full bg-[var(--bg-2)] px-2 py-1 md:px-3 md:py-1.5">
                <StarIcon size={10} color="var(--gold)" />
                <span className="text-xs font-semibold text-[var(--gold-bright)] md:text-sm">
                  {formatPoints(entry.points)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Podium Bases - Bậc thang - Responsive heights */}
      <div className="mt-4 grid grid-cols-3 items-end gap-2 md:mt-6 md:gap-4 lg:mt-8 lg:gap-6">
        {[2, 1, 3].map((rank) => {
          const colors = medalColors[rank]
          const heights: Record<number, string> = {
            1: 'h-16 md:h-20 lg:h-24',
            2: 'h-12 md:h-16 lg:h-20',
            3: 'h-10 md:h-12 lg:h-16',
          }

          return (
            <div
              key={rank}
              className={`flex items-center justify-center rounded-t-lg ${heights[rank]}`}
              style={{ background: colors.bg, borderTop: `3px solid ${colors.border}` }}
            >
              <span
                className="text-xl font-bold md:text-2xl lg:text-3xl"
                style={{ color: colors.text }}
              >
                {rank}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type LeaderboardListProps = {
  entries: LeaderboardEntry[]
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  const [visibleCount, setVisibleCount] = useState(3)
  const INITIAL_RANK_COUNT = 3

  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {entries.slice(0, visibleCount).map((entry, index) => {
        const rank = index + 4
        const isMe = entry.name === CURRENT_USER_NAME

        return (
          <div
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 md:px-4 md:py-3 ${
              isMe
                ? 'border-[var(--gold)]/[0.4] bg-[var(--gold)]/[0.05]'
                : 'border-[var(--hairline)] bg-[var(--surface-1)]'
            }`}
            key={entry.name}
          >
            {/* Rank */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-2)] text-xs font-medium text-[var(--text-muted)] md:h-8 md:w-8 md:text-sm">
              {rank}
            </span>

            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/[0.15] text-xs font-semibold text-[var(--gold-bright)] md:h-11 md:w-11 md:text-sm">
              {entry.avatarUrl ? (
                <img className="h-full w-full rounded-full object-cover" src={entry.avatarUrl} alt={entry.name} />
              ) : (
                getInitials(entry.name)
              )}
            </div>

            {/* Name */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm font-medium text-[var(--text-primary)] md:text-base">
                {entry.name}
              </span>
              {isMe && (
                <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-medium text-[var(--on-gold)] md:text-xs">
                  Bạn
                </span>
              )}
            </div>

            {/* Points */}
            <div className="flex items-center gap-1 rounded-full bg-[var(--bg-2)] px-2.5 py-1 md:px-3 md:py-1.5">
              <StarIcon size={10} color="var(--gold)" />
              <span className="text-xs font-semibold text-[var(--gold-bright)] md:text-sm">
                {formatPoints(entry.points)}
              </span>
            </div>
          </div>
        )
      })}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-2 md:pt-3">
        {visibleCount < entries.length && (
          <button
            type="button"
            className="rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-3)] md:text-sm md:px-6 md:py-2"
            onClick={() => setVisibleCount((v) => Math.min(v + 3, entries.length))}
          >
            Xem thêm
          </button>
        )}
        {visibleCount > INITIAL_RANK_COUNT && (
          <button
            type="button"
            className="rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-3)] md:text-sm md:px-6 md:py-2"
            onClick={() => setVisibleCount(INITIAL_RANK_COUNT)}
          >
            Thu gọn
          </button>
        )}
      </div>
    </div>
  )
}
