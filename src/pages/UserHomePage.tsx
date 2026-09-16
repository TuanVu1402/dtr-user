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

const leaderboardMeTagClass =
  'rounded-full bg-(--gold) px-2.5 py-[3px] text-[11px] font-bold tracking-[0.4px] text-(--on-gold)'

function podiumSlotClass(rank: number, isMe: boolean) {
  const base =
    "group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-[20px] border bg-[linear-gradient(180deg,var(--surface-1),var(--surface-tint))] px-4.5 pt-7.5 pb-6 text-center shadow-[0_10px_24px_var(--shadow)] transition-[transform,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[5px] before:content-[''] max-[640px]:pt-0"
  if (isMe) {
    return `${base} border-[rgba(37,99,235,0.4)] bg-[linear-gradient(180deg,rgba(37,99,235,0.08),var(--surface-tint))] hover:-translate-y-1 hover:shadow-[0_16px_32px_var(--shadow-strong)] before:bg-[linear-gradient(90deg,var(--gold),var(--gold-deep))]`
  }
  if (rank === 1) {
    return `${base} order-2 z-[2] -translate-y-[22px] border-[rgba(212,175,106,0.4)] bg-[linear-gradient(180deg,color-mix(in_srgb,#f3d98b_10%,var(--surface-1)),var(--surface-1))] pt-10 pb-7.5 shadow-[0_22px_44px_rgba(169,127,47,0.22)] before:h-1.5 before:bg-[linear-gradient(90deg,#f3d98b,#d4af6a,#f3d98b)] hover:-translate-y-[26px] hover:shadow-[0_26px_52px_rgba(169,127,47,0.3)] max-[640px]:order-0 max-[640px]:translate-y-0 max-[640px]:hover:translate-y-0`
  }
  if (rank === 2) {
    return `${base} order-1 border-[rgba(37,99,235,0.16)] before:bg-[linear-gradient(90deg,#eef1f5,#b9c2cf)] hover:-translate-y-1 hover:shadow-[0_16px_32px_var(--shadow-strong)]`
  }
  return `${base} order-3 border-[rgba(37,99,235,0.16)] before:bg-[linear-gradient(90deg,#e3a768,#b97a3d)] hover:-translate-y-1 hover:shadow-[0_16px_32px_var(--shadow-strong)] max-[640px]:order-2`
}

function podiumCrownClass(rank: number) {
  if (rank === 1) {
    return 'flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f3d98b,#d4af6a)] shadow-[0_6px_14px_rgba(169,127,47,0.4)]'
  }
  if (rank === 3) {
    return 'flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#e3a768,#b97a3d)] shadow-[0_4px_10px_var(--shadow)]'
  }
  return 'flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#eef1f5,#b9c2cf)] shadow-[0_4px_10px_var(--shadow)]'
}

function podiumAvatarClass(rank: number) {
  const base =
    'flex items-center justify-center overflow-hidden rounded-full border-[3px] border-(--surface-1) font-[\'Open_Sans\',sans-serif] font-extrabold text-(--on-gold) shadow-[0_6px_14px_var(--shadow)]'
  if (rank === 1) {
    return `${base} h-19 w-19 bg-[linear-gradient(135deg,#f3d98b,#d4af6a)] text-[22px] text-[#4a2f12] shadow-[0_0_0_5px_rgba(216,180,99,0.3),0_10px_24px_rgba(169,127,47,0.35)]`
  }
  if (rank === 2) {
    return `${base} h-[58px] w-[58px] bg-[linear-gradient(135deg,#eef1f5,#b9c2cf)] text-lg text-[#33415a]`
  }
  if (rank === 3) {
    return `${base} h-[58px] w-[58px] bg-[linear-gradient(135deg,#e3a768,#b97a3d)] text-lg text-[#4a2f12]`
  }
  return `${base} h-[58px] w-[58px] bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] text-lg`
}

function podiumRankNumClass(rank: number) {
  const base =
    'absolute -right-1 -bottom-0.5 flex items-center justify-center rounded-full border-2 border-(--surface-1) font-extrabold text-(--on-gold) shadow-[0_2px_6px_var(--shadow)]'
  if (rank === 1) {
    return `${base} h-7 w-7 bg-[linear-gradient(135deg,#f3d98b,#d4af6a)] text-[13px] text-[#4a2f12]`
  }
  if (rank === 2) {
    return `${base} h-6 w-6 bg-[linear-gradient(135deg,#eef1f5,#b9c2cf)] text-xs text-[#33415a]`
  }
  if (rank === 3) {
    return `${base} h-6 w-6 bg-[linear-gradient(135deg,#e3a768,#b97a3d)] text-xs text-[#4a2f12]`
  }
  return `${base} h-6 w-6 bg-(--gold) text-xs`
}

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
    <div className="min-h-svh bg-[radial-gradient(1100px_480px_at_85%_-10%,var(--bg-glow),transparent_60%),linear-gradient(180deg,var(--bg-1)_0%,var(--bg-2)_40%,var(--bg-3)_100%)] pb-14 text-(--text-primary)">
      {checkinNotice && (
        <div className="mx-11 mt-5 flex items-center justify-between gap-4 rounded-xl border border-[rgba(76,175,130,0.4)] bg-[rgba(76,175,130,0.12)] px-5 py-3.5 text-sm text-(--text-primary)">
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

      <section className="flex flex-col items-start gap-2.5 px-11 pt-10 pb-1 max-[640px]:px-5">
        <div className="inline-flex items-center rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-2 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
          XẾP HẠNG
        </div>
        <p className="m-0 text-[15px] font-semibold text-(--text-secondary)">
          Xếp hạng theo tổng điểm DTR đã được duyệt, cập nhật theo thời gian thực.
        </p>
      </section>

      <section className="flex flex-col gap-5.5 px-11 pt-7.5 max-[640px]:px-5">
        {fullRanking.length === 0 ? (
          <p className="m-0 text-sm font-medium text-(--text-tertiary)">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          <>
            {podium.length > 0 && (
              <div className="grid grid-cols-3 items-end gap-5 pt-7.5 max-[640px]:grid-cols-1 max-[640px]:items-stretch max-[640px]:gap-3.5 max-[640px]:pt-0">
                {podiumDisplayOrder.map((entry, slotIndex) => {
                  if (!entry) return <div className="invisible" key={`empty-${slotIndex}`} />
                  const rank = podium.indexOf(entry) + 1
                  const isMe = entry.name === CURRENT_USER_NAME
                  return (
                    <div className={podiumSlotClass(rank, isMe)} key={entry.name}>
                      <div className={podiumCrownClass(rank)}>
                        <CrownIcon
                          size={rank === 1 ? 18 : 15}
                          color={rank === 1 ? '#7a5518' : rank === 2 ? '#42506b' : '#5c3417'}
                        />
                      </div>
                      <div className="relative">
                        <div className={podiumAvatarClass(rank)}>
                          {entry.avatarUrl ? (
                            <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                          ) : (
                            getInitials(entry.name)
                          )}
                        </div>
                        <div className={podiumRankNumClass(rank)}>{rank}</div>
                      </div>
                      <div
                        className={`flex flex-wrap items-center justify-center gap-1.5 font-bold text-(--text-primary) ${
                          rank === 1 ? 'text-[15.5px]' : 'text-sm'
                        }`}
                      >
                        {entry.name}
                        {isMe && <span className={leaderboardMeTagClass}>Bạn</span>}
                      </div>
                      <div
                        className={`font-['Open_Sans',sans-serif] font-extrabold ${
                          rank === 1
                            ? 'text-lg text-[#b9852f] dark:text-[#f3d98b]'
                            : 'text-[15px] text-(--gold-bright)'
                        }`}
                      >
                        {formatPoints(entry.points)} điểm
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {restRanking.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {restRanking.slice(0, visibleRankCount).map((entry, index) => {
                  const rank = index + 4
                  const isMe = entry.name === CURRENT_USER_NAME
                  return (
                    <div
                      className={`grid grid-cols-[44px_44px_1fr_auto] items-center gap-4 rounded-2xl border px-5 py-3.5 shadow-[0_2px_8px_var(--shadow)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_var(--shadow-strong)] max-[480px]:grid-cols-[36px_36px_1fr] ${
                        isMe
                          ? 'border-[rgba(37,99,235,0.4)] bg-[linear-gradient(90deg,rgba(37,99,235,0.1),var(--surface-1))]'
                          : 'border-[rgba(37,99,235,0.12)] bg-(--surface-1)'
                      }`}
                      key={entry.name}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full font-['Open_Sans',sans-serif] text-[15px] font-extrabold text-(--text-tertiary)">
                        {rank}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-(--surface-tint) bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] text-[13px] font-bold text-(--on-gold) shadow-[0_3px_8px_var(--shadow)]">
                        {entry.avatarUrl ? (
                          <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                        ) : (
                          getInitials(entry.name)
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 text-[15px] font-bold text-(--text-primary)">
                        {entry.name}
                        {isMe && <span className={leaderboardMeTagClass}>Bạn</span>}
                      </div>
                      <div className="font-['Open_Sans',sans-serif] text-base font-extrabold whitespace-nowrap text-(--gold-bright) max-[480px]:col-[2/-1] max-[480px]:justify-self-end">
                        {formatPoints(entry.points)} điểm
                      </div>
                    </div>
                  )
                })}

                <div className="mt-0.5 flex items-center justify-center gap-2.5">
                  {visibleRankCount < restRanking.length && (
                    <button
                      type="button"
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[rgba(37,99,235,0.28)] bg-transparent px-4 py-[7px] font-inherit text-[12.5px] font-bold text-(--gold-bright) transition-[background,border-color] duration-150 hover:border-[rgba(37,99,235,0.45)] hover:bg-[rgba(37,99,235,0.08)]"
                      onClick={() => setVisibleRankCount((v) => Math.min(v + 3, restRanking.length))}
                    >
                      Xem thêm <ArrowRightIcon size={11} />
                    </button>
                  )}
                  {visibleRankCount > INITIAL_RANK_COUNT && (
                    <button
                      type="button"
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-(--hairline) bg-transparent px-4 py-[7px] font-inherit text-[12.5px] font-bold text-(--text-tertiary) transition-[background,border-color] duration-150 hover:border-(--text-tertiary) hover:bg-(--surface-tint)"
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

      <section className="flex flex-col items-start gap-3.5 px-11 pt-10 max-[640px]:px-5">
        <div className="inline-flex items-center rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-2 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
          CÁCH GHI ĐIỂM
        </div>
        <h1 className="m-0 font-['Open_Sans',sans-serif] text-[30px] font-extrabold tracking-[0.5px] text-(--text-primary)">
          Nộp minh chứng nhận điểm DTR
        </h1>
        <p className="m-0 text-sm font-medium text-(--text-tertiary)">
          Chọn một hạng mục bên dưới và nộp minh chứng để admin xét duyệt điểm.
        </p>
      </section>

      <section className="flex flex-col gap-4.5 px-11 pt-6.5 max-[640px]:px-5">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon]
          return (
            <div
              className="relative flex items-center gap-8 overflow-hidden rounded-[14px] border border-[rgba(37,99,235,0.16)] bg-(--surface-1) px-7.5 py-7 shadow-[0_4px_14px_var(--shadow)] transition-[transform,box-shadow] duration-200 before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-[linear-gradient(90deg,var(--gold-deep),var(--gold-bright))] before:content-[''] hover:-translate-y-[3px] hover:shadow-[0_14px_28px_var(--shadow-strong)] max-[960px]:flex-col max-[960px]:items-stretch max-[960px]:gap-5"
              key={category.id}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-(--gold) font-['Open_Sans',sans-serif] text-[13px] font-extrabold text-(--on-gold)">
                    {category.number}
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(37,99,235,0.25)] bg-[rgba(37,99,235,0.1)]">
                    <Icon />
                  </div>
                  {category.audienceTag && (
                    <div className="rounded-full border border-[rgba(37,99,235,0.35)] bg-[rgba(37,99,235,0.14)] px-2.5 py-1 text-[11px] font-bold tracking-[0.4px] whitespace-nowrap text-(--gold-bright)">
                      {category.audienceTag}
                    </div>
                  )}
                </div>
                <div className="font-['Open_Sans',sans-serif] text-[17px] leading-[1.4] font-bold text-(--text-primary)">
                  {category.title}
                </div>
                {category.locationLabels && category.locationLabels.length > 0 && (
                  <div className="-mt-0.5 flex flex-wrap gap-2">
                    {category.locationLabels.map((location) => (
                      <button
                        type="button"
                        className="cursor-pointer rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.1)] px-3 py-1 font-inherit text-xs font-bold text-(--gold-bright) transition-[background,border-color] duration-150 hover:border-[rgba(37,99,235,0.5)] hover:bg-[rgba(37,99,235,0.18)]"
                        key={location}
                        onClick={() => setOpenCategory(category)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
                <div className="text-[13.5px] leading-[1.6] text-(--text-tertiary)">{category.description}</div>
              </div>

              <div className="relative flex shrink-0 flex-col items-stretch gap-3.5 py-4.5 pr-5 pl-8 before:absolute before:top-2 before:bottom-2 before:left-0 before:w-px before:bg-[linear-gradient(180deg,transparent,rgba(37,99,235,0.35),transparent)] before:content-[''] max-[960px]:w-auto max-[960px]:items-stretch max-[960px]:py-4 max-[960px]:pr-0 max-[960px]:pl-0 max-[960px]:before:top-0 max-[960px]:before:bottom-auto max-[960px]:before:left-0 max-[960px]:before:h-px max-[960px]:before:w-auto max-[960px]:before:bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.35),transparent)] min-[961px]:w-[250px]">
                <div className="flex flex-wrap justify-end gap-2 max-[960px]:justify-start">
                  {category.pointOptions.map((option) => (
                    <span
                      className="rounded-full border border-[rgba(37,99,235,0.35)] bg-[rgba(37,99,235,0.12)] px-3 py-1.5 text-xs font-bold whitespace-nowrap text-(--gold-bright)"
                      key={option.label}
                    >
                      {option.label === 'Điểm'
                        ? `${formatPoints(option.points)} điểm`
                        : `${option.label} · ${formatPoints(option.points)} điểm`}
                    </span>
                  ))}
                  {category.id === 'training-kickoff' && (
                    <button
                      type="button"
                      className="cursor-pointer rounded-full border border-[rgba(76,175,130,0.4)] bg-[rgba(76,175,130,0.12)] px-3 py-1.5 font-inherit text-xs font-bold whitespace-nowrap text-(--positive) transition-[background,border-color] duration-150 hover:border-[rgba(76,175,130,0.6)] hover:bg-[rgba(76,175,130,0.22)]"
                      onClick={() => setShowQrScanner(true)}
                    >
                      Quét QR tự động
                    </button>
                  )}
                </div>
                <button
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-4 py-3 font-['Open_Sans',sans-serif] text-[13.5px] font-bold whitespace-nowrap text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]"
                  type="button"
                  onClick={() => setOpenCategory(category)}
                >
                  {category.id === 'training-kickoff' ? 'Nộp thủ công' : 'Nộp minh chứng'}
                  <ArrowRightIcon color="#ffffff" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

      <section className="flex px-11 pt-11 pb-2 max-[640px]:px-5">
        <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-[20px] border border-[rgba(37,99,235,0.28)] bg-(--surface-1) px-10 py-9 shadow-[0_16px_36px_var(--shadow)] before:absolute before:-top-[120px] before:-right-[100px] before:h-[280px] before:w-[280px] before:rounded-full before:bg-[radial-gradient(circle,rgba(37,99,235,0.16),transparent_70%)] before:pointer-events-none before:content-[''] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.1),color-mix(in_srgb,var(--surface-1)_40%,transparent))]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[13px] font-bold tracking-[1.5px] text-(--text-tertiary) uppercase">
                Tổng điểm DTR hiện tại
              </div>
              <div className="mt-2.5 font-['Open_Sans',sans-serif] text-[64px] leading-none font-extrabold text-(--gold-bright) max-[640px]:text-[48px]">
                {totalPoints}
                <span className="ml-2 text-[22px] font-bold text-(--gold-bright)">điểm</span>
              </div>
            </div>
            <div className="relative z-[1] flex items-center gap-2.5 rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] py-2.5 pr-4.5 pl-3 text-[13px] font-bold whitespace-nowrap text-(--on-gold) shadow-[0_8px_18px_rgba(37,99,235,0.3)]">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.22)]">
                <CrownIcon size={13} color="#ffffff" />
              </span>
              {tierName}
            </div>
          </div>

          <div className="relative z-[1] flex flex-col gap-2.5">
            <div className="h-2.5 overflow-hidden rounded-full bg-(--hairline)">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold-bright))] shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-[width] duration-[400ms] ease-in-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[13px] text-(--text-secondary)">
                Còn <b className="text-(--gold-bright)">{pointsToNextTier} điểm</b> nữa để đạt Hạng Vương Miện
              </div>
              <div className="shrink-0 font-['Open_Sans',sans-serif] text-[13px] font-extrabold text-(--gold-bright)">
                {progressPercent}%
              </div>
            </div>
          </div>

          <div className="relative z-[1] flex flex-col gap-3">
            <div className="text-xs font-extrabold tracking-[0.6px] text-(--text-tertiary) uppercase">
              Chi tiết điểm đã ghi nhận
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
              {pointBreakdown.map((item, index) => {
                const iconKey = categories[index]?.icon ?? 'office'
                const Icon = categoryIcons[iconKey]
                const accent = breakdownAccents[iconKey]
                return (
                  <div
                    className={`group flex min-w-0 items-center gap-3 rounded-xl border border-(--hairline) bg-(--surface-tint) px-4 py-3.5 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-[rgba(37,99,235,0.3)] hover:shadow-[0_8px_18px_var(--shadow)] ${
                      item.count === 0 ? 'opacity-55' : ''
                    }`}
                    key={item.label}
                  >
                    <div
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border transition-transform duration-150 group-hover:scale-[1.08]"
                      style={{ background: accent.bg, borderColor: accent.border }}
                    >
                      <Icon size={16} color={accent.fg} />
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <div className="text-xl leading-[1.1] font-extrabold text-(--text-primary)">{item.count}</div>
                      <div className="text-[11.5px] leading-[1.3] font-semibold break-words text-(--text-tertiary)">
                        {item.label}
                      </div>
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
