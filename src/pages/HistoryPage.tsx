import { useMemo, useState } from 'react'
import { CURRENT_USER_NAME } from '../data/currentUser'
import UserNavbar from '../components/UserNavbar'
import StatusBadge from '../components/StatusBadge'
import Footer from '../components/Footer'
import { useSubmissions } from '../context/SubmissionsContext'
import { formatPoints } from '../utils/format'
import type { SubmissionStatus } from '../types/dtr'
import '../styles/shared.css'

const statusFilters: { label: string; value: SubmissionStatus | 'all' }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
]

export default function HistoryPage() {
  const { submissions } = useSubmissions()
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all')

  const myEntries = useMemo(
    () => submissions.filter((s) => s.userName === CURRENT_USER_NAME),
    [submissions],
  )

  const filteredEntries = useMemo(() => {
    if (statusFilter === 'all') return myEntries
    return myEntries.filter((e) => e.status === statusFilter)
  }, [myEntries, statusFilter])

  return (
    <div className="dtr-root page-bg">
      <UserNavbar active="history" />

      <section className="section-head">
        <div className="pill">LỊCH SỬ</div>
        <h1 className="section-title">Lịch sử nộp minh chứng</h1>
        <p className="section-caption">
          Toàn bộ minh chứng bạn đã nộp và trạng thái xét duyệt của từng mục.
        </p>
      </section>

      <section className="history-section">
        <div className="history-head">
          <div className="filter-row">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-chip${filter.value === statusFilter ? ' active' : ''}`}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-card">
          <div className="t-row t-head">
            <div>Hạng mục</div>
            <div>Mô tả / minh chứng</div>
            <div>Ngày nộp</div>
            <div>Điểm</div>
            <div>Trạng thái</div>
          </div>

          {filteredEntries.length === 0 && (
            <p className="section-caption" style={{ padding: '20px 24px' }}>
              Không có minh chứng nào ở trạng thái này.
            </p>
          )}
          {filteredEntries.map((entry) => (
            <div className="t-row t-body" key={entry.id}>
              <div className="t-cat">
                <span className="t-dot" />
                {entry.categoryLabel}
              </div>
              <div className="t-desc">
                {entry.description}
                {entry.link && (
                  <>
                    {' '}
                    <a className="t-link" href={entry.link} target="_blank" rel="noreferrer">
                      Xem link ↗
                    </a>
                  </>
                )}
              </div>
              <div className="t-date">{entry.date}</div>
              <div className="t-points">+{formatPoints(entry.points)}</div>
              <div>
                <StatusBadge status={entry.status} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
