import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Footer, UserNavbar, CrownIcon, StarIcon, SearchIcon } from '@/components'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { useSubmissions } from '@/context/SubmissionsContext'
import { formatPoints } from '@/utils/format'
import { buildRanking, formatMonthLabel, previousMonthKey } from '@/utils/ranking'
import { LeaderboardList, LeaderboardPodium } from './LeaderboardSection'
import { getInitials } from './LeaderboardSection'
import RankingPeriodBar from './RankingPeriodBar'

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export default function LeaderboardPage() {
  const { submissions, users } = useSubmissions()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [query, setQuery] = useState('')

  const defaultMonth = previousMonthKey()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const viewAll = params.get('view') === 'all'
  const selectedMonth = params.get('month') || defaultMonth

  const ranking = useMemo(
    () => buildRanking(users, submissions, viewAll ? null : selectedMonth),
    [users, submissions, viewAll, selectedMonth],
  )

  const filtered = useMemo(() => {
    const needle = normalizeText(query)
    if (!needle) return ranking
    return ranking.filter((entry) => normalizeText(entry.name).includes(needle))
  }, [ranking, query])

  const myIndex = ranking.findIndex((entry) => entry.name === CURRENT_USER_NAME)
  const myEntry = myIndex >= 0 ? ranking[myIndex] : null
  const isSearching = query.trim().length > 0
  const podium = isSearching ? [] : filtered.slice(0, 3)
  const restRanking = isSearching ? filtered : filtered.slice(3)

  function showAll() {
    navigate(`/ranking?view=all&month=${selectedMonth}`)
  }

  function showMonth(month: string) {
    navigate(`/ranking?month=${month}`)
  }

  return (
    <div className="min-h-svh bg-[var(--bg-1)] pb-4">
      <UserNavbar active="home" />

      <div className="mx-auto max-w-3xl px-4 pt-5 md:px-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ← Trang chủ
        </Link>

        <RankingPeriodBar
          viewAll={viewAll}
          selectedMonth={selectedMonth}
          onShowAll={showAll}
          onShowMonth={showMonth}
        />

        <form
          className="mb-4 flex items-center rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] p-1 pl-4 shadow-[0_6px_18px_var(--shadow)] md:pl-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] [&::-webkit-search-cancel-button]:hidden"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm thành viên..."
            aria-label="Tìm thành viên trong bảng xếp hạng"
          />
          <button
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--gold)] px-2.5 py-2 text-sm font-semibold text-[var(--on-gold)] md:px-5 md:py-2.5"
            type="submit"
            aria-label="Tìm kiếm"
          >
            <span className="hidden md:inline">Tìm kiếm</span>
            <SearchIcon size={16} color="currentColor" />
          </button>
        </form>

        {myEntry && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--gold)]/[0.12] text-sm font-semibold text-[var(--gold-bright)]">
              {myEntry.avatarUrl ? (
                <img className="h-full w-full object-cover" src={myEntry.avatarUrl} alt="" />
              ) : (
                getInitials(myEntry.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">Bạn</p>
                <span className="rounded-full bg-[var(--gold)]/[0.12] px-2 py-0.5 text-[10px] font-medium text-[var(--gold-bright)]">
                  {viewAll ? 'Toàn thời gian' : formatMonthLabel(selectedMonth)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                Xếp hạng hiện tại: #{myIndex + 1}
                <span className="mx-1.5">·</span>
                Chính xác: {(myEntry.accuracy ?? 0).toFixed(2)}%
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[var(--gold-bright)]">
              <StarIcon size={14} color="currentColor" />
              <span className="text-lg font-bold">{formatPoints(myEntry.points)}</span>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="min-w-0 text-lg font-semibold text-[var(--text-primary)]">
            {viewAll ? 'Toàn thời gian' : `Top ${formatMonthLabel(selectedMonth).toLowerCase()}`}
          </h1>
          <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--gold-bright)]">
            <span className="animate-crown-blink inline-flex">
              <CrownIcon size={16} color="#f5c542" filled />
            </span>
            Bảng vàng vinh danh
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-8 md:px-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">
            {isSearching ? 'Không tìm thấy thành viên phù hợp.' : 'Chưa có dữ liệu xếp hạng.'}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {!isSearching && <LeaderboardPodium podium={podium} />}
            <LeaderboardList entries={restRanking} startRank={isSearching ? 1 : 4} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
