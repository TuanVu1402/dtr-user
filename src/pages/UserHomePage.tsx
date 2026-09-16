import { useEffect, useMemo, useState } from 'react'
import { categories, pointBreakdown } from '../data/dtrData'
import { CURRENT_USER_NAME } from '../data/currentUser'
import { ArrowRightIcon, BookingIcon, CheckinIcon, ClipIcon, CrownIcon, OfficeIcon, TrainingIcon } from '../components/icons'
import UserNavbar from '../components/UserNavbar'
import SubmissionForm from '../components/SubmissionForm'
import QrScannerModal from '../components/QrScannerModal'
import FeedbackSection from '../components/FeedbackSection'
import Footer from '../components/Footer'
import { useTrainingSessions } from '../context/TrainingSessionsContext'
import { useSubmissions } from '../context/SubmissionsContext'
import { formatPoints } from '../utils/format'
import type { Category } from '../types/dtr'
import '../styles/shared.css'
import './UserHomePage.css'
import './Leaderboard.css'

const categoryIcons: Record<Category['icon'], typeof BookingIcon> = {
  booking: BookingIcon,
  training: TrainingIcon,
  clip: ClipIcon,
  checkin: CheckinIcon,
  office: OfficeIcon,
}

const breakdownAccents: Record<Category['icon'], { fg: string; bg: string; border: string }> = {
  booking: { fg: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.28)' },
  training: { fg: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.28)' },
  clip: { fg: '#db2777', bg: 'rgba(219, 39, 119, 0.12)', border: 'rgba(219, 39, 119, 0.28)' },
  checkin: { fg: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.28)' },
  office: { fg: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.28)' },
}

const totalPoints = 128
const nextTierAt = 160
const tierName = 'Hạng Kim Cương'
// Bục top 3 đã chiếm 3 vị trí đầu — thêm 3 người nữa trong danh sách bên dưới
// để tổng cộng hiển thị đúng 6 người lúc mới vào trang (3 + 3 = 6).
const INITIAL_RANK_COUNT = 3

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

type CheckinNotice = {
  title: string
  alreadyDone: boolean
}

export default function UserHomePage() {
  const { submissions, users, addSubmission } = useSubmissions()
  const [openCategory, setOpenCategory] = useState<Category | null>(null)
  const [checkinNotice, setCheckinNotice] = useState<CheckinNotice | null>(null)
  const [visibleRankCount, setVisibleRankCount] = useState(INITIAL_RANK_COUNT)
  const [showQrScanner, setShowQrScanner] = useState(false)
  const { findSession } = useTrainingSessions()

  // Ghi nhận điểm danh QR cho 1 mã buổi Training/Kick off — dùng chung cho cả link quét từ
  // app camera ngoài (URL ?checkin=) lẫn quét trực tiếp trong app qua QrScannerModal.
  function processCheckinCode(code: string) {
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
  }

  // Mã QR có thể chứa cả link đầy đủ (?checkin=<mã>) hoặc chỉ riêng mã buổi — lấy đúng mã
  // trong cả 2 trường hợp.
  function extractCheckinCode(rawValue: string) {
    try {
      const url = new URL(rawValue)
      const code = url.searchParams.get('checkin')
      if (code) return code
    } catch {
      // Không phải URL — coi cả chuỗi quét được là mã buổi.
    }
    return rawValue.trim()
  }

  function handleQrDetected(rawValue: string) {
    setShowQrScanner(false)
    const code = extractCheckinCode(rawValue)
    if (code) processCheckinCode(code)
  }

  const fullRanking = useMemo(() => {
    const totals = new Map<string, number>()
    for (const s of submissions) {
      if (s.status !== 'approved') continue
      totals.set(s.userName, (totals.get(s.userName) ?? 0) + s.points)
    }
    return users
      .filter((u) => u.role === 'user')
      .map((u) => ({ name: u.name, points: totals.get(u.name) ?? 0, avatarUrl: u.avatarUrl }))
      .sort((a, b) => b.points - a.points)
  }, [submissions, users])

  const podium = fullRanking.slice(0, 3)
  const restRanking = fullRanking.slice(3)
  // Thứ tự hiển thị bục xếp hạng: Hạng 2 — Hạng 1 (giữa, cao nhất) — Hạng 3.
  const podiumDisplayOrder = [podium[1], podium[0], podium[2]]

  const progressPercent = Math.min(100, Math.round((totalPoints / nextTierAt) * 100))
  const pointsToNextTier = nextTierAt - totalPoints

  // Quét mã QR điểm danh Training/Kick off bằng app camera ngoài: mở link dạng
  // ?checkin=<mã buổi> sẽ tự động cộng điểm mà không cần chờ admin duyệt (do đã có bằng
  // chứng có mặt qua QR).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('checkin')
    if (!code) return

    processCheckinCode(code)

    const url = new URL(window.location.href)
    url.searchParams.delete('checkin')
    window.history.replaceState({}, '', url.toString())
    // Chỉ chạy 1 lần khi trang vừa mở từ link quét QR.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(data: {
    optionLabel: string
    points: number
    description: string
    date: string
    link?: string
    imageDataUrl?: string
  }) {
    if (!openCategory) return
    const formattedDate = data.date
      ? new Date(data.date).toLocaleDateString('vi-VN')
      : new Date().toLocaleDateString('vi-VN')

    const fullCategoryTitle = openCategory.locationLabels?.length
      ? `${openCategory.title} ${openCategory.locationLabels.join(', ')}`
      : openCategory.title

    addSubmission({
      userName: CURRENT_USER_NAME,
      categoryLabel: data.optionLabel === 'Điểm' ? fullCategoryTitle : data.optionLabel,
      description: data.description || '—',
      date: formattedDate,
      points: data.points,
      status: 'pending',
      link: data.link || undefined,
      imageDataUrl: data.imageDataUrl,
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

      <section className="section-head section-head-compact">
        <div className="pill">XẾP HẠNG</div>
        <p className="section-caption section-caption-lead">
          Xếp hạng theo tổng điểm DTR đã được duyệt, cập nhật theo thời gian thực.
        </p>
      </section>

      <section className="leaderboard-section">
        {fullRanking.length === 0 ? (
          <p className="section-caption">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          <>
            {podium.length > 0 && (
              <div className="podium-row">
                {podiumDisplayOrder.map((entry, slotIndex) => {
                  if (!entry) return <div className="podium-slot podium-empty" key={`empty-${slotIndex}`} />
                  const rank = podium.indexOf(entry) + 1
                  const isMe = entry.name === CURRENT_USER_NAME
                  return (
                    <div className={`podium-slot rank-${rank}${isMe ? ' me' : ''}`} key={entry.name}>
                      <div className="podium-crown">
                        <CrownIcon
                          size={rank === 1 ? 18 : 15}
                          color={rank === 1 ? '#7a5518' : rank === 2 ? '#42506b' : '#5c3417'}
                        />
                      </div>
                      <div className="podium-avatar-wrap">
                        <div className="podium-avatar">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={entry.name} />
                          ) : (
                            getInitials(entry.name)
                          )}
                        </div>
                        <div className="podium-rank-num">{rank}</div>
                      </div>
                      <div className="podium-name">
                        {entry.name}
                        {isMe && <span className="leaderboard-me-tag">Bạn</span>}
                      </div>
                      <div className="podium-points">{formatPoints(entry.points)} điểm</div>
                    </div>
                  )
                })}
              </div>
            )}

            {restRanking.length > 0 && (
              <div className="leaderboard-list">
                {restRanking.slice(0, visibleRankCount).map((entry, index) => {
                  const rank = index + 4
                  const isMe = entry.name === CURRENT_USER_NAME
                  return (
                    <div className={`leaderboard-row${isMe ? ' me' : ''}`} key={entry.name}>
                      <div className="leaderboard-rank">{rank}</div>
                      <div className="leaderboard-avatar">
                        {entry.avatarUrl ? (
                          <img src={entry.avatarUrl} alt={entry.name} />
                        ) : (
                          getInitials(entry.name)
                        )}
                      </div>
                      <div className="leaderboard-name">
                        {entry.name}
                        {isMe && <span className="leaderboard-me-tag">Bạn</span>}
                      </div>
                      <div className="leaderboard-points">{formatPoints(entry.points)} điểm</div>
                    </div>
                  )
                })}

                <div className="leaderboard-toggle-row">
                  {visibleRankCount < restRanking.length && (
                    <button
                      type="button"
                      className="leaderboard-more-btn"
                      onClick={() => setVisibleRankCount((v) => Math.min(v + 3, restRanking.length))}
                    >
                      Xem thêm <ArrowRightIcon size={11} />
                    </button>
                  )}
                  {visibleRankCount > INITIAL_RANK_COUNT && (
                    <button
                      type="button"
                      className="leaderboard-more-btn leaderboard-less-btn"
                      onClick={() => setVisibleRankCount(INITIAL_RANK_COUNT)}
                    >
                      Thu gọn
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
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
                {category.locationLabels && category.locationLabels.length > 0 && (
                  <div className="cat-location-row">
                    {category.locationLabels.map((location) => (
                      <button
                        type="button"
                        className="cat-location-label"
                        key={location}
                        onClick={() => setOpenCategory(category)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
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
                    <button
                      type="button"
                      className="point-chip qr-chip"
                      onClick={() => setShowQrScanner(true)}
                    >
                      Quét QR tự động
                    </button>
                  )}
                </div>
                <button className="cat-btn" type="button" onClick={() => setOpenCategory(category)}>
                  {category.id === 'training-kickoff' ? 'Nộp thủ công' : 'Nộp minh chứng'}
                  <ArrowRightIcon color="#ffffff" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

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
              <span className="tier-badge-icon">
                <CrownIcon size={13} color="#ffffff" />
              </span>
              {tierName}
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-meta">
              <div className="progress-note">
                Còn <b className="gold-text">{pointsToNextTier} điểm</b> nữa để đạt Hạng Vương Miện
              </div>
              <div className="progress-percent">{progressPercent}%</div>
            </div>
          </div>

          <div className="breakdown-block">
            <div className="breakdown-heading">Chi tiết điểm đã ghi nhận</div>
            <div className="breakdown-row">
              {pointBreakdown.map((item, index) => {
                const iconKey = categories[index]?.icon ?? 'office'
                const Icon = categoryIcons[iconKey]
                const accent = breakdownAccents[iconKey]
                return (
                  <div className={`breakdown-item${item.count === 0 ? ' is-empty' : ''}`} key={item.label}>
                    <div
                      className="breakdown-icon"
                      style={{ background: accent.bg, borderColor: accent.border }}
                    >
                      <Icon size={16} color={accent.fg} />
                    </div>
                    <div className="breakdown-text">
                      <div className="breakdown-num">{item.count}</div>
                      <div className="breakdown-label">{item.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
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

      {showQrScanner && (
        <QrScannerModal onDetected={handleQrDetected} onCancel={() => setShowQrScanner(false)} />
      )}
    </div>
  )
}
