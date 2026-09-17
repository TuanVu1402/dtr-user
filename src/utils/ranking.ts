import type { AdminSubmission, AdminUser } from '@/types/dtr'
import type { LeaderboardEntry } from '@/features/home/components/LeaderboardSection'

export function parseViDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function toMonthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
}

export function previousMonthKey(from = new Date()) {
  const date = new Date(from.getFullYear(), from.getMonth() - 1, 1)
  return toMonthKey(date.getFullYear(), date.getMonth())
}

export function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-')
  return `Tháng ${Number(month)}/${year}`
}

export function submissionMonthKey(date: string) {
  const parsed = parseViDate(date)
  if (!parsed) return null
  return toMonthKey(parsed.getFullYear(), parsed.getMonth())
}

export function buildRanking(
  users: AdminUser[],
  submissions: AdminSubmission[],
  monthKey?: string | null,
): LeaderboardEntry[] {
  const totals = new Map<string, number>()
  const approved = new Map<string, number>()
  const total = new Map<string, number>()

  for (const item of submissions) {
    if (monthKey && submissionMonthKey(item.date) !== monthKey) continue
    total.set(item.userName, (total.get(item.userName) ?? 0) + 1)
    if (item.status !== 'approved') continue
    totals.set(item.userName, (totals.get(item.userName) ?? 0) + item.points)
    approved.set(item.userName, (approved.get(item.userName) ?? 0) + 1)
  }

  return users
    .filter((user) => user.role === 'user')
    .map((user) => {
      const submitted = total.get(user.name) ?? 0
      const ok = approved.get(user.name) ?? 0
      return {
        name: user.name,
        points: totals.get(user.name) ?? 0,
        avatarUrl: user.avatarUrl,
        accuracy: submitted ? (ok / submitted) * 100 : 0,
      }
    })
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}
