import { useEffect, useMemo, useState } from 'react'
import {
  UserNavbar,
  SubmissionForm,
  QrScannerModal,
  FeedbackSection,
  Footer,
  CrownIcon,
} from '@/components'
import { categories, pointBreakdown } from '@/data/dtrData'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { useTrainingSessions } from '@/context/TrainingSessionsContext'
import { useSubmissions } from '@/context/SubmissionsContext'
import type { Category } from '@/types/dtr'
import { LeaderboardPodium, LeaderboardList } from './LeaderboardSection'
import HowToEarnSection from './HowToEarnSection'
import CategoryCard from './CategoryCard'
import PointsProgressSection from './PointsProgressSection'

type CheckinNotice = {
  title: string
  alreadyDone: boolean
}

const totalPoints = 128
const nextTierAt = 160
const tierName = 'Hạng Kim Cương'

export default function UserHomePage() {
  const { submissions, users, addSubmission } = useSubmissions()
  const [openCategory, setOpenCategory] = useState<Category | null>(null)
  const [checkinNotice, setCheckinNotice] = useState<CheckinNotice | null>(null)
  const [showQrScanner, setShowQrScanner] = useState(false)
  const { findSession } = useTrainingSessions()

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

  function extractCheckinCode(rawValue: string) {
    try {
      const url = new URL(rawValue)
      const code = url.searchParams.get('checkin')
      if (code) return code
    } catch {
      // Not a URL — treat the whole string as the session code
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('checkin')
    if (!code) return

    processCheckinCode(code)

    const url = new URL(window.location.href)
    url.searchParams.delete('checkin')
    window.history.replaceState({}, '', url.toString())
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
    <div className="min-h-svh bg-[var(--bg-1)] pb-4">
      {/* Checkin Notice */}
      {checkinNotice && (
        <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-lg bg-[var(--gold)]/[0.1] border border-[var(--gold)]/[0.3] px-4 py-3 text-sm text-[var(--text-primary)]">
          <div>
            {checkinNotice.alreadyDone ? (
              <>
                Bạn đã điểm danh <b className="text-[var(--gold-bright)]">{checkinNotice.title}</b> trước đó rồi.
              </>
            ) : (
              <>
                ✓ Điểm danh thành công <b className="text-[var(--gold-bright)]">{checkinNotice.title}</b> — đã cộng <b className="text-[var(--gold-bright)]">+1 điểm DTR</b>
              </>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 cursor-pointer border-none bg-transparent text-xl leading-none text-[var(--text-primary)]"
            onClick={() => setCheckinNotice(null)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}

      <UserNavbar active="home" />

      {/* Leaderboard Header */}
      <div className="flex items-center justify-between gap-3 px-4 pt-6 pb-2 max-md:px-4 max-lg:px-6 max-lg:pt-8 max-lg:pb-4 lg:px-6 lg:pt-8 lg:pb-4">
        <span className="rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-bold tracking-wide text-[var(--on-gold)]">
          XẾP HẠNG
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
          <CrownIcon size={14} color="#d4af6a" />
          Bảng vàng
        </span>
      </div>

      {/* Leaderboard Section - Responsive: full width mobile, 2-col tablet/desktop */}
      <div className="px-4 pb-6 max-lg:px-4 max-lg:pb-8 lg:px-6 lg:pb-8">
        {fullRanking.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          <>
            <LeaderboardPodium podium={podium} />
            <LeaderboardList entries={restRanking} />
          </>
        )}
      </div>

      {/* How To Earn Section */}
      <HowToEarnSection />

      {/* Categories Section - Responsive grid layout */}
      <div className="px-4 pt-6 pb-4 max-lg:px-4 max-lg:pt-8 lg:px-6 lg:pt-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)] lg:text-xl">Nộp minh chứng</h2>
        <div className="grid gap-4 max-sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onOpen={setOpenCategory}
            />
          ))}
        </div>
      </div>

      {/* Points Progress - Centered container on desktop */}
      <div className="max-lg:px-4 max-lg:pb-6 lg:px-6 lg:pb-8">
        <div className="mx-auto max-w-3xl">
          <PointsProgressSection
            totalPoints={totalPoints}
            nextTierAt={nextTierAt}
            tierName={tierName}
            categories={categories}
            pointBreakdown={pointBreakdown}
          />
        </div>
      </div>

      {/* Feedback Section */}
      <FeedbackSection />

      <Footer />

      {/* Modals */}
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
