import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, pointBreakdown } from '../data/dtrData'
import { CURRENT_USER_NAME } from '../data/currentUser'
import { ArrowRightIcon, BookingIcon, CheckinIcon, ClipIcon, CrownIcon, OfficeIcon, TrainingIcon } from '../components/icons'
import UserNavbar from '../components/UserNavbar'
import SubmissionForm from '../components/SubmissionForm'
import FeedbackSection from '../components/FeedbackSection'
import Footer from '../components/Footer'
import { useTrainingSessions } from '../context/TrainingSessionsContext'
import { useSubmissions } from '../context/SubmissionsContext'
import { formatPoints } from '../utils/format'
import type { Category } from '../types/dtr'
import '../styles/shared.css'
import './UserHomePage.css'

const categoryIcons: Record<Category['icon'], typeof BookingIcon> = {
  booking: BookingIcon,
  training: TrainingIcon,
  clip: ClipIcon,
  checkin: CheckinIcon,
  office: OfficeIcon,
}

const totalPoints = 128
const nextTierAt = 160
const tierName = 'Hạng Kim Cương'

type CheckinNotice = {
  title: string
  alreadyDone: boolean
}

export default function UserHomePage() {
  const { submissions, addSubmission } = useSubmissions()
  const [openCategory, setOpenCategory] = useState<Category | null>(null)
  const [checkinNotice, setCheckinNotice] = useState<CheckinNotice | null>(null)
  const { findSession } = useTrainingSessions()

  const myEntries = useMemo(
    () => submissions.filter((s) => s.userName === CURRENT_USER_NAME),
    [submissions],
  )
  const recentEntries = myEntries.slice(0, 4)

  const progressPercent = Math.min(100, Math.round((totalPoints / nextTierAt) * 100))
  const pointsToNextTier = nextTierAt - totalPoints

  // Quét mã QR điểm danh Training/Kick off: URL dạng ?checkin=<mã buổi> sẽ tự động
  // cộng điểm mà không cần chờ admin duyệt (do đã có bằng chứng có mặt qua QR).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('checkin')
    if (!code) return

    const session = findSession(code)
    const title = session?.title ?? 'Buổi Training'
    const storageKey = `dtr-checkin-done-${code}`
    const alreadyDone = localStorage.getItem(storageKey) === '1'

    if (!alreadyDone) {
      localStorage.setItem(storageKey, '1')
      addSubmission({
        userName: CURRENT_USER_NAME,
        categoryLabel: 'Training / Kick off',
        description: `Điểm danh QR — ${title}`,
        date: new Date().toLocaleDateString('vi-VN'),
        points: 1,
        status: 'approved',
      })
    }

    setCheckinNotice({ title, alreadyDone })

    const url = new URL(window.location.href)
    url.searchParams.delete('checkin')
    window.history.replaceState({}, '', url.toString())
    // Chỉ chạy 1 lần khi trang vừa mở từ link quét QR.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(data: { optionLabel: string; points: number; description: string; date: string; link?: string }) {
    if (!openCategory) return
    const formattedDate = data.date
      ? new Date(data.date).toLocaleDateString('vi-VN')
      : new Date().toLocaleDateString('vi-VN')

    addSubmission({
      userName: CURRENT_USER_NAME,
      categoryLabel: data.optionLabel === 'Điểm' ? openCategory.title : data.optionLabel,
      description: data.description || '—',
      date: formattedDate,
      points: data.points,
      status: 'pending',
      link: data.link || undefined,
    })
    setOpenCategory(null)
  }

  return (
    <div className="dtr-root page-bg">
      {checkinNotice && (
        <div className="checkin-toast">
          <div>
            {checkinNotice.alreadyDone ? (
              <>
                Bạn đã điểm danh <b className="gold-text">{checkinNotice.title}</b> trước đó rồi.
              </>
            ) : (
              <>
                ✓ Điểm danh thành công <b className="gold-text">{checkinNotice.title}</b> — đã tự động
                cộng <b className="gold-text">+1 điểm DTR</b>
              </>
            )}
          </div>
          <button
            type="button"
            className="checkin-toast-close"
            onClick={() => setCheckinNotice(null)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}

      <UserNavbar active="home" />

      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-top">
            <div>
              <div className="hero-label">Tổng điểm DTR hiện tại</div>
              <div className="hero-points">
                {totalPoints}
                <span className="hero-points-unit">điểm</span>
              </div>
            </div>
            <div className="tier-badge">
              <CrownIcon />
              {tierName}
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-note">
              Còn <b className="gold-text">{pointsToNextTier} điểm</b> nữa để đạt Hạng Vương Miện
            </div>
          </div>

          <div className="breakdown-row">
            {pointBreakdown.map((item) => (
              <div className="breakdown-item" key={item.label}>
                <div className="breakdown-num">{item.count}</div>
                <div className="breakdown-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="coin-card">
          <div className="coin">
            <div className="coin-inner">
              <div className="coin-text">DTR</div>
              <div className="coin-sub">POINT</div>
            </div>
          </div>
          <div className="coin-caption">
            &ldquo;Mỗi hành động —<br />
            <b className="gold-text">một bước tiến gần thành công</b>&rdquo;
          </div>
        </div>
      </section>

      <section className="section-head">
        <div className="pill">CÁCH GHI ĐIỂM</div>
        <h1 className="section-title">Nộp minh chứng nhận điểm DTR</h1>
        <p className="section-caption">
          Chọn một hạng mục bên dưới và nộp minh chứng để admin xét duyệt điểm.
        </p>
      </section>

      <section className="cat-list">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon]
          return (
            <div className="cat-card" key={category.id}>
              <div className="cat-main">
                <div className="cat-top">
                  <div className="cat-num">{category.number}</div>
                  <div className="cat-icon">
                    <Icon />
                  </div>
                  {category.audienceTag && <div className="audience-tag">{category.audienceTag}</div>}
                </div>
                <div className="cat-title">{category.title}</div>
                <div className="cat-desc">{category.description}</div>
              </div>

              <div className="cat-action">
                <div className="cat-points-row">
                  {category.pointOptions.map((option) => (
                    <span className="point-chip" key={option.label}>
                      {option.label === 'Điểm'
                        ? `${formatPoints(option.points)} điểm`
                        : `${option.label} · ${formatPoints(option.points)} điểm`}
                    </span>
                  ))}
                  {category.id === 'training-kickoff' && (
                    <span className="point-chip qr-chip">Quét QR tự động</span>
                  )}
                </div>
                <button className="cat-btn" type="button" onClick={() => setOpenCategory(category)}>
                  {category.id === 'training-kickoff' ? 'Nộp thủ công' : 'Nộp minh chứng'}
                  <ArrowRightIcon color="#0d1f3d" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

      <section className="history-section">
        <div className="history-head">
          <h2 className="history-title">Lịch sử nộp minh chứng</h2>
          <Link to="/history" className="history-view-all">
            Xem tất cả lịch sử <ArrowRightIcon size={12} />
          </Link>
        </div>

        <div className="table-card">
          <div className="t-row-compact t-head">
            <div>Hạng mục</div>
            <div>Ngày nộp</div>
          </div>

          {recentEntries.length === 0 && (
            <p className="section-caption" style={{ padding: '20px 24px' }}>
              Bạn chưa nộp minh chứng nào.
            </p>
          )}
          {recentEntries.map((entry) => (
            <div className="t-row-compact t-body" key={entry.id}>
              <div className="t-cat">
                <span className="t-dot" />
                {entry.categoryLabel}
              </div>
              <div className="t-date">{entry.date}</div>
            </div>
          ))}
        </div>
      </section>

      <FeedbackSection />

      <Footer />

      {openCategory && (
        <SubmissionForm
          category={openCategory}
          onCancel={() => setOpenCategory(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
