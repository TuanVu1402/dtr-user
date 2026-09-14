import { useMemo } from 'react'
import { CURRENT_USER_NAME } from '../data/currentUser'
import UserNavbar from '../components/UserNavbar'
import Footer from '../components/Footer'
import { CrownIcon } from '../components/icons'
import { useSubmissions } from '../context/SubmissionsContext'
import { formatPoints } from '../utils/format'
import '../styles/shared.css'
import './LeaderboardPage.css'

export default function LeaderboardPage() {
  const { submissions, users } = useSubmissions()

  const ranking = useMemo(() => {
    const totals = new Map<string, number>()
    for (const s of submissions) {
      if (s.status !== 'approved') continue
      totals.set(s.userName, (totals.get(s.userName) ?? 0) + s.points)
    }
    return users
      .filter((u) => u.role === 'user')
      .map((u) => ({ name: u.name, points: totals.get(u.name) ?? 0 }))
      .sort((a, b) => b.points - a.points)
  }, [submissions, users])

  return (
    <div className="dtr-root page-bg">
      <UserNavbar active="leaderboard" />

      <section className="section-head">
        <div className="pill">XẾP HẠNG</div>
        <h1 className="section-title">Bảng xếp hạng DTR Point</h1>
        <p className="section-caption">
          Xếp hạng theo tổng điểm DTR đã được duyệt, cập nhật theo thời gian thực.
        </p>
      </section>

      <section className="history-section">
        <div className="leaderboard-list">
          {ranking.map((entry, index) => {
            const rank = index + 1
            const isMe = entry.name === CURRENT_USER_NAME
            return (
              <div className={`leaderboard-row${isMe ? ' me' : ''}`} key={entry.name}>
                <div className={`leaderboard-rank rank-${rank}`}>
                  {rank <= 3 ? <CrownIcon size={16} color={rank === 1 ? '#f3d98b' : rank === 2 ? '#d7dce6' : '#d99a63'} /> : rank}
                </div>
                <div className="leaderboard-avatar">
                  {entry.name
                    .split(' ')
                    .slice(-2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="leaderboard-name">
                  {entry.name}
                  {isMe && <span className="leaderboard-me-tag">Bạn</span>}
                </div>
                <div className="leaderboard-points">{formatPoints(entry.points)} điểm</div>
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
