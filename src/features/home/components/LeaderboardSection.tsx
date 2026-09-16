import { useState } from 'react'
import { CrownIcon, StarIcon } from '@/components'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { formatPoints } from '@/utils/format'

export type LeaderboardEntry = {
  name: string
  points: number
  avatarUrl?: string
}

const medalThemes: Record<number, { gradient: string; glow: string; icon: string }> = {
  1: {
    gradient: 'linear-gradient(135deg,#fff8dc 0%,#f7d774 36%,#e0a92e 70%,#b8801a 100%)',
    glow: 'rgba(224,169,46,0.5)',
    icon: '#6b4a10',
  },
  2: {
    gradient: 'linear-gradient(135deg,#ffffff 0%,#e6ecf4 38%,#b8c2d0 72%,#939fb0 100%)',
    glow: 'rgba(147,159,176,0.45)',
    icon: '#3c4759',
  },
  3: {
    gradient: 'linear-gradient(135deg,#ffd9b0 0%,#e8a463 38%,#c67a3a 72%,#9a5824 100%)',
    glow: 'rgba(198,122,58,0.45)',
    icon: '#5c3417',
  },
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

  function podiumCrownWrapClass(rank: number) {
    return `relative z-[1] flex items-center justify-center rounded-full ring-2 ring-(--surface-1) ${
      rank === 1 ? 'h-9 w-9' : 'h-7 w-7'
    }`
  }

  function podiumAvatarRingClass(rank: number, isMe: boolean) {
    const size = rank === 1 ? 'h-20 w-20' : 'h-15 w-15'
    const ring = isMe
      ? 'ring-[rgba(37,99,235,0.6)]'
      : rank === 1
        ? 'ring-[rgba(247,215,116,0.95)]'
        : rank === 2
          ? 'ring-[rgba(214,222,232,0.95)]'
          : 'ring-[rgba(232,164,99,0.9)]'
    return `relative flex items-center justify-center rounded-full ring-[3px] ring-offset-2 ring-offset-(--surface-1) ${size} ${ring}`
  }

  function podiumAvatarInnerClass(rank: number) {
    const base = "flex h-full w-full items-center justify-center overflow-hidden rounded-full font-['Open_Sans',sans-serif] font-extrabold"
    return `${base} ${rank === 1 ? 'text-xl' : 'text-base'} text-[#4a2f12]`
  }

  function podiumBaseClass(rank: number) {
    const base = "relative flex items-center justify-center overflow-hidden rounded-[10px] font-['Open_Sans',sans-serif] font-extrabold"
    if (rank === 1) return `${base} h-16 text-2xl text-[#5c4114]`
    if (rank === 2) return `${base} h-12 text-lg text-[#3a4658]`
    return `${base} h-12 text-lg text-[#4a2f12]`
  }

  function rankPointColorClass(rank: number) {
    if (rank === 1) return 'text-[#b9852f] dark:text-[#f3d98b]'
    if (rank === 2) return 'text-[#5b6478] dark:text-[#c9d0da]'
    if (rank === 3) return 'text-[#a15a26] dark:text-[#e3a768]'
    return 'text-(--gold-bright)'
  }

  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[rgba(212,175,106,0.4)] bg-[linear-gradient(180deg,rgba(255,244,214,0.8),rgba(255,255,255,0))] px-6 pt-7 pb-6 dark:border-[rgba(212,175,106,0.24)] dark:bg-[linear-gradient(180deg,rgba(212,175,106,0.16),rgba(255,255,255,0))] max-[480px]:px-3.5">
      <span className="pointer-events-none absolute -top-28 left-1/2 h-[300px] w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,199,84,0.38),transparent_70%)]" />

      <div className="relative grid grid-cols-3 items-end gap-2.5">
        {podiumDisplayOrder.map((entry, slotIndex) => {
          if (!entry) return <div key={`empty-${slotIndex}`} />
          const rank = podium.indexOf(entry) + 1
          const isMe = entry.name === CURRENT_USER_NAME
          const theme = medalThemes[rank]
          return (
            <div className="flex flex-col items-center gap-1" key={entry.name}>
              <div
                className={podiumCrownWrapClass(rank)}
                style={{ background: theme.gradient, boxShadow: `0 4px 12px ${theme.glow}` }}
              >
                <CrownIcon size={rank === 1 ? 16 : 13} color={theme.icon} />
              </div>
              <div
                className={`-mt-1 ${podiumAvatarRingClass(rank, isMe)}`}
                style={{ boxShadow: `0 10px 26px ${theme.glow}` }}
              >
                {rank === 1 && (
                  <span className="animate-champion-glow pointer-events-none absolute inset-0 rounded-full" />
                )}
                <div className={podiumAvatarInnerClass(rank)} style={{ background: theme.gradient }}>
                  {entry.avatarUrl ? (
                    <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                  ) : (
                    getInitials(entry.name)
                  )}
                </div>
              </div>
              <span className="mt-1 line-clamp-2 max-w-full text-center text-[12.5px] leading-[1.25] font-extrabold text-(--text-primary)">
                {entry.name}
              </span>
              {isMe && (
                <span className="rounded-full bg-(--gold) px-2.5 py-[3px] text-[11px] font-bold tracking-[0.4px] text-(--on-gold)">
                  Bạn
                </span>
              )}
              <div className="flex items-center gap-1">
                <StarIcon size={12} color="#d4af6a" />
                <span className={`font-['Open_Sans',sans-serif] text-[13.5px] font-extrabold ${rankPointColorClass(rank)}`}>
                  {formatPoints(entry.points)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative grid grid-cols-3 items-end gap-2.5">
        {[2, 1, 3].map((rank) => {
          const theme = medalThemes[rank]
          return (
            <div
              key={rank}
              className={podiumBaseClass(rank)}
              style={{ background: theme.gradient, boxShadow: `0 10px 22px ${theme.glow}` }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.5),transparent)]" />
              {rank === 1 && (
                <span className="animate-medal-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)]" />
              )}
              <span className="relative">{rank}</span>
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

  function rankRowClass(isMe: boolean) {
    const base =
      'flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5 shadow-[0_2px_8px_var(--shadow)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_var(--shadow-strong)]'
    if (isMe) {
      return `${base} border-[rgba(37,99,235,0.4)] bg-[linear-gradient(90deg,rgba(37,99,235,0.1),var(--surface-1))]`
    }
    return `${base} border-(--hairline) bg-(--surface-1)`
  }

  return (
    <div className="flex flex-col gap-2.5">
      {entries.slice(0, visibleCount).map((entry, index) => {
        const rank = index + 4
        const isMe = entry.name === CURRENT_USER_NAME
        return (
          <div className={rankRowClass(isMe)} key={entry.name}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,99,235,0.2),rgba(37,99,235,0.06))] font-['Open_Sans',sans-serif] text-[12px] font-extrabold text-(--gold-bright)">
              {rank}
            </span>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-(--surface-1) bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] font-['Open_Sans',sans-serif] text-[13px] font-bold text-(--on-gold) shadow-[0_3px_8px_var(--shadow)]">
              {entry.avatarUrl ? (
                <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
              ) : (
                getInitials(entry.name)
              )}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-[14.5px] font-extrabold text-(--text-primary)">
                {entry.name}
              </span>
              {isMe && (
                <span className="rounded-full bg-(--gold) px-2.5 py-[3px] text-[11px] font-bold tracking-[0.4px] text-(--on-gold)">
                  Bạn
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-[rgba(212,175,106,0.45)] bg-[rgba(243,217,139,0.2)] px-3 py-1">
              <StarIcon size={13} color="#d4af6a" />
              <span className="font-['Open_Sans',sans-serif] text-[15px] font-extrabold text-[#8a6a1f] dark:text-[#f3d98b]">
                {formatPoints(entry.points)}
              </span>
            </div>
          </div>
        )
      })}

      <div className="mt-0.5 flex items-center justify-center gap-2.5">
        {visibleCount < entries.length && (
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[rgba(37,99,235,0.28)] bg-transparent px-4 py-[7px] font-inherit text-[12.5px] font-bold text-(--gold-bright) transition-[background,border-color] duration-150 hover:border-[rgba(37,99,235,0.45)] hover:bg-[rgba(37,99,235,0.08)]"
            onClick={() => setVisibleCount((v) => Math.min(v + 3, entries.length))}
          >
            Xem thêm
          </button>
        )}
        {visibleCount > INITIAL_RANK_COUNT && (
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-(--hairline) bg-transparent px-4 py-[7px] font-inherit text-[12.5px] font-bold text-(--text-tertiary) transition-[background,border-color] duration-150 hover:border-(--text-tertiary) hover:bg-(--surface-tint)"
            onClick={() => setVisibleCount(INITIAL_RANK_COUNT)}
          >
            Thu gọn
          </button>
        )}
      </div>
    </div>
  )
}
