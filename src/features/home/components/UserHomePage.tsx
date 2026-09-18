import { useEffect, useMemo, useState } from 'react'
import {
  UserNavbar,
  SubmissionForm,
  FeedbackSection,
  Footer,
} from '@/components'
import QrScannerModal from '@/components/feedback/QrScannerModal'
import { readLocation, startCameraStream, type GeoPoint } from '@/utils/qrCheckin'
import { categories } from '@/data/dtrData'
import { CURRENT_USER_NAME } from '@/data/currentUser'
import { useTrainingSessions } from '@/context/TrainingSessionsContext'
import { useSubmissions } from '@/context/SubmissionsContext'
import type { Category } from '@/types/dtr'
import { buildRanking, formatMonthLabel, previousMonthKey } from '@/utils/ranking'
import { formatPoints } from '@/utils/format'
import { ApprovalHistory } from '@/features/profile'
import LeaderboardSlideshow from './LeaderboardSlideshow'
import PointsTicker from './PointsTicker'
import CategoryCard from './CategoryCard'
import FaqSection from './FaqSection'

type CheckinNotice = {
  title: string
  alreadyDone: boolean
  points: number
}

type ScanTarget = {
  category: Category
  location?: string
  cameraPromise: Promise<MediaStream>
  geoPromise: Promise<GeoPoint>
}

export default function UserHomePage() {
  const { submissions, users, addSubmission } = useSubmissions()
  const [openCategory, setOpenCategory] = useState<Category | null>(null)
  const [checkinNotice, setCheckinNotice] = useState<CheckinNotice | null>(null)
  const [scanTarget, setScanTarget] = useState<ScanTarget | null>(null)
  const { findSession } = useTrainingSessions()

  function processCheckinCode(code: string, category: Category, locationLabel?: string, geo?: GeoPoint) {
    const session = findSession(code)
    const points = category.pointOptions[0]?.points ?? 1
    const title =
      locationLabel ??
      session?.title ??
      category.title
    const storageKey = `dtr-checkin-done-${category.id}-${code}`
    const alreadyDone = localStorage.getItem(storageKey) === '1'
    const geoText = geo ? ` · GPS ${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}` : ''

    if (!alreadyDone) {
      localStorage.setItem(storageKey, '1')
      addSubmission({
        userName: CURRENT_USER_NAME,
        categoryLabel: category.id === 'training-kickoff' ? 'Training / Kick off' : category.title,
        description: `Điểm danh QR — ${title}${geoText}`,
        date: new Date().toLocaleDateString('vi-VN'),
        points,
        status: 'approved',
      })
    }

    setCheckinNotice({ title, alreadyDone, points })
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

  function releaseScanner(target: ScanTarget | null) {
    target?.cameraPromise
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop())
      })
      .catch(() => {})
  }

  function handleQrDetected(rawValue: string, geo?: GeoPoint) {
    const category = scanTarget?.category
    const location = scanTarget?.location
    releaseScanner(scanTarget)
    setScanTarget(null)
    const code = extractCheckinCode(rawValue)
    if (code && category) processCheckinCode(code, category, location, geo)
  }

  const myEntries = useMemo(
    () => submissions.filter((s) => s.userName === CURRENT_USER_NAME),
    [submissions],
  )

  const monthKey = previousMonthKey()
  const monthlyRanking = useMemo(
    () => buildRanking(users, submissions, monthKey),
    [users, submissions, monthKey],
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('checkin')
    if (!code) return

    const training = categories.find((item) => item.id === 'training-kickoff')
    if (training) processCheckinCode(code, training)

    const url = new URL(window.location.href)
    url.searchParams.delete('checkin')
    window.history.replaceState({}, '', url.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCategoryCard(next: Category, location?: string) {
    if (next.qrCheckin) {
      setScanTarget({
        category: next,
        location,
        cameraPromise: startCameraStream(),
        geoPromise: readLocation(),
      })
      return
    }
    setOpenCategory(next)
  }

  function handleSubmit(data: {
    optionLabel: string
    points: number
    description: string
    date: string
    project?: string
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
    const description = [data.project, data.description].filter(Boolean).join(' — ') || '—'

    addSubmission({
      userName: CURRENT_USER_NAME,
      categoryLabel: data.optionLabel === 'Điểm' ? fullCategoryTitle : data.optionLabel,
      description,
      date: formattedDate,
      points: data.points,
      status: 'pending',
      link: data.link || undefined,
      imageDataUrl: openCategory.evidenceType === 'none' ? undefined : data.imageDataUrl,
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
                ✓ Điểm danh thành công <b className="text-[var(--gold-bright)]">{checkinNotice.title}</b> — đã cộng <b className="text-[var(--gold-bright)]">+{formatPoints(checkinNotice.points)} điểm DTR</b>
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

      <div className="mx-auto max-w-3xl px-4 pt-5 pb-6 md:max-w-4xl md:px-6 md:pt-6 md:pb-8 lg:max-w-6xl lg:px-8 xl:max-w-[1280px]">
        {monthlyRanking.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          <>
            <LeaderboardSlideshow
              ranking={monthlyRanking}
              monthKey={monthKey}
              monthLabel={formatMonthLabel(monthKey)}
            />
            <PointsTicker submissions={submissions} />
          </>
        )}

        <div className="pt-6 pb-4 max-lg:pt-8 lg:pt-8">
          <h2 className="mb-4 text-lg font-semibold whitespace-nowrap text-[var(--text-primary)] lg:mb-5 lg:text-xl">
            Cách ghi điểm
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onOpen={openCategoryCard}
              />
            ))}
          </div>
        </div>

        <section className="pt-6 pb-0 md:pt-8">
          <ApprovalHistory entries={myEntries} />
        </section>

        <FeedbackSection embedded />

        <FaqSection />
      </div>

      <Footer />

      {/* Modals */}
      {openCategory && (
        <SubmissionForm
          category={openCategory}
          onCancel={() => setOpenCategory(null)}
          onSubmit={handleSubmit}
        />
      )}

      {scanTarget && (
        <QrScannerModal
          heading="Quét mã QR"
          requireLocation
          cameraPromise={scanTarget.cameraPromise}
          geoPromise={scanTarget.geoPromise}
          onDetected={handleQrDetected}
          onCancel={() => {
            releaseScanner(scanTarget)
            setScanTarget(null)
          }}
        />
      )}
    </div>
  )
}
