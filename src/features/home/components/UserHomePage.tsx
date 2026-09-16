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
    <div className="min-h-svh bg-[radial-gradient(1100px_480px_at_85%_-10%,var(--bg-glow),transparent_60%),linear-gradient(180deg,var(--bg-1)_0%,var(--bg-2)_40%,var(--bg-3)_100%)] pb-14 text-(--text-primary)">
      {checkinNotice && (
        <div className="mx-11 mt-5 flex items-center justify-between gap-4 rounded-lg border border-[rgba(76,175,130,0.4)] bg-[rgba(76,175,130,0.12)] px-5 py-3.5 text-sm text-(--text-primary)">
          <div>
            {checkinNotice.alreadyDone ? (
              <>
                Bạn đã điểm danh <b className="text-(--gold-bright)">{checkinNotice.title}</b> trước đó rồi.
              </>
            ) : (
              <>
                ✓ Điểm danh thành công <b className="text-(--gold-bright)">{checkinNotice.title}</b> — đã tự động
                cộng <b className="text-(--gold-bright)">+1 điểm DTR</b>
              </>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 cursor-pointer border-none bg-transparent text-xl leading-none text-(--text-primary)"
            onClick={() => setCheckinNotice(null)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}

      <UserNavbar active="home" />

      {/* Leaderboard Section */}
      <section className="flex flex-wrap items-center justify-between gap-3 px-11 pt-10 pb-1 max-[640px]:px-5">
        <div className="inline-flex h-9 items-center rounded-full border border-transparent bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
          XẾP HẠNG
        </div>
        <div className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[rgba(212,175,106,0.45)] bg-[rgba(243,217,139,0.16)] px-3.5 text-[12px] font-extrabold whitespace-nowrap text-[#8a6a1f] dark:text-[#f3d98b]">
          <CrownIcon size={14} color="#d4af6a" />
          Bảng vàng vinh danh
        </div>
      </section>

      <section className="flex flex-col gap-5 px-11 pt-7.5 max-[640px]:px-5">
        {fullRanking.length === 0 ? (
          <p className="m-0 text-sm font-medium text-(--text-tertiary)">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          <>
            <LeaderboardPodium podium={podium} />
            <LeaderboardList entries={restRanking} />
          </>
        )}
      </section>

      <HowToEarnSection />

      {/* Categories Section */}
      <section className="flex flex-col gap-5 px-11 pt-6.5 max-[640px]:px-5">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onOpen={setOpenCategory}
            onOpenQrScanner={() => setShowQrScanner(true)}
          />
        ))}
      </section>

      <PointsProgressSection
        totalPoints={totalPoints}
        nextTierAt={nextTierAt}
        tierName={tierName}
        categories={categories}
        pointBreakdown={pointBreakdown}
      />

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
