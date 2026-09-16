import { useEffect, useMemo, useState } from 'react'
import { categories, pointBreakdown } from '../data/dtrData'
import { CURRENT_USER_NAME } from '../data/currentUser'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BookingIcon,
  CheckinIcon,
  ClipIcon,
  CrownIcon,
  OfficeIcon,
  StarIcon,
  TrainingIcon,
} from '../components/icons'
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

// Ba bước tóm tắt quy trình ghi điểm, hiển thị ở đầu khối "Cách ghi điểm".
const submitSteps = [
  { title: 'Chọn hạng mục', detail: 'Tìm hoạt động bạn đã tham gia' },
  { title: 'Tải minh chứng', detail: 'Ảnh, clip hoặc quét QR tại chỗ' },
  { title: 'Chờ duyệt', detail: 'Admin xét duyệt và cộng điểm' },
]

const leaderboardMeTagClass =
  'rounded-full bg-(--gold) px-2.5 py-[3px] text-[11px] font-bold tracking-[0.4px] text-(--on-gold)'

// --- Bảng xếp hạng kiểu "bảng vàng vinh danh": 3 avatar tròn có vương miện phía trên (đại diện
// hạng 1/2/3) + dải bục màu vàng/bạc/đồng bên dưới + danh sách hạng còn lại dạng hàng. Dùng
// đúng 1 bộ thiết kế cho mọi kích thước màn hình thay vì tách riêng bản mobile/desktop.

/** Bộ màu huy chương vàng / bạc / đồng. Gradient nhiều chặng mô phỏng kim loại bắt sáng,
 * kèm màu quầng sáng (glow) và màu viền để hạng 1/2/3 rực rỡ hẳn so với phần còn lại. */
type MedalTheme = {
  gradient: string
  glow: string
  icon: string
}

const medalThemes: Record<number, MedalTheme> = {
  1: {
    gradient: 'linear-gradient(135deg,#fff8dc 0%,#f7d774 36%,#e0a92e 70%,#b8801a 100%)',
    glow: 'rgba(224,169,46,0.5)',
    icon: '#6b4a10',
  },
  2: {
    gradient: 'linear-gradient(135deg,#ffffff 0%,#e6ecf4 38%,#b8c2d0 72%,#939fb0 100%)',
    glow: 'rgba(147,159,176,0.45)',
    icon: '#3c4759',
  },
  3: {
    gradient: 'linear-gradient(135deg,#ffd9b0 0%,#e8a463 38%,#c67a3a 72%,#9a5824 100%)',
    glow: 'rgba(198,122,58,0.45)',
    icon: '#5c3417',
  },
}

function medalTheme(rank: number) {
  return medalThemes[rank] ?? medalThemes[3]
}

/** Màu số điểm theo hạng — hạng 1/2/3 dùng đúng tông vàng/bạc/đồng để nổi bật hẳn khỏi
 * phần còn lại của danh sách, thay vì mọi hạng dùng chung 1 màu. */
function rankPointColorClass(rank: number) {
  if (rank === 1) return 'text-[#b9852f] dark:text-[#f3d98b]'
  if (rank === 2) return 'text-[#5b6478] dark:text-[#c9d0da]'
  if (rank === 3) return 'text-[#a15a26] dark:text-[#e3a768]'
  return 'text-(--gold-bright)'
}

function podiumCrownWrapClass(rank: number) {
  return `relative z-[1] flex items-center justify-center rounded-full ring-2 ring-(--surface-1) ${
    rank === 1 ? 'h-9 w-9' : 'h-7 w-7'
  }`
}

function podiumAvatarRingClass(rank: number, isMe: boolean) {
  const size = rank === 1 ? 'h-20 w-20' : 'h-15 w-15'
  const ring = isMe
    ? 'ring-[rgba(37,99,235,0.6)]'
    : rank === 1
      ? 'ring-[rgba(247,215,116,0.95)]'
      : rank === 2
        ? 'ring-[rgba(214,222,232,0.95)]'
        : 'ring-[rgba(232,164,99,0.9)]'
  return `relative flex items-center justify-center rounded-full ring-[3px] ring-offset-2 ring-offset-(--surface-1) ${size} ${ring}`
}

function podiumAvatarInnerClass(rank: number) {
  const base =
    "flex h-full w-full items-center justify-center overflow-hidden rounded-full font-['Open_Sans',sans-serif] font-extrabold"
  return `${base} ${rank === 1 ? 'text-xl' : 'text-base'} text-[#4a2f12]`
}

/** Bục 3 khối 2 / 1 / 3 bên dưới hàng avatar — khối "1" ở giữa cao và nổi bật nhất, mô phỏng
 * bục trao giải thay vì thẻ 3D cầu kỳ, dễ nhìn và gọn trên màn hình hẹp. */
function podiumBaseClass(rank: number) {
  const base =
    "relative flex items-center justify-center overflow-hidden rounded-[10px] font-['Open_Sans',sans-serif] font-extrabold"
  if (rank === 1) return `${base} h-16 text-2xl text-[#5c4114]`
  if (rank === 2) return `${base} h-12 text-lg text-[#3a4658]`
  return `${base} h-12 text-lg text-[#4a2f12]`
}

/** Hàng danh sách xếp hạng cho hạng 4 trở đi — avatar nhỏ có huy hiệu tích xanh trang trí,
 * #hạng + tên, điểm kèm sao vàng nằm bên phải. */
function rankRowClass(isMe: boolean) {
  const base =
    'flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5 shadow-[0_2px_8px_var(--shadow)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_var(--shadow-strong)]'
  if (isMe) {
    return `${base} border-[rgba(37,99,235,0.4)] bg-[linear-gradient(90deg,rgba(37,99,235,0.1),var(--surface-1))]`
  }
  return `${base} border-(--hairline) bg-(--surface-1)`
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
            {podium.length > 0 && (
              <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[rgba(212,175,106,0.4)] bg-[linear-gradient(180deg,rgba(255,244,214,0.8),rgba(255,255,255,0))] px-6 pt-7 pb-6 dark:border-[rgba(212,175,106,0.24)] dark:bg-[linear-gradient(180deg,rgba(212,175,106,0.16),rgba(255,255,255,0))] max-[480px]:px-3.5">
                <span className="pointer-events-none absolute -top-28 left-1/2 h-[300px] w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(247,199,84,0.38),transparent_70%)]" />

                <div className="relative grid grid-cols-3 items-end gap-2.5">
                  {podiumDisplayOrder.map((entry, slotIndex) => {
                    if (!entry) return <div key={`empty-${slotIndex}`} />
                    const rank = podium.indexOf(entry) + 1
                    const isMe = entry.name === CURRENT_USER_NAME
                    const theme = medalTheme(rank)
                    return (
                      <div className="flex flex-col items-center gap-1" key={entry.name}>
                        <div
                          className={podiumCrownWrapClass(rank)}
                          style={{ background: theme.gradient, boxShadow: `0 4px 12px ${theme.glow}` }}
                        >
                          <CrownIcon size={rank === 1 ? 16 : 13} color={theme.icon} />
                        </div>
                        <div
                          className={`-mt-1 ${podiumAvatarRingClass(rank, isMe)}`}
                          style={{ boxShadow: `0 10px 26px ${theme.glow}` }}
                        >
                          {rank === 1 && (
                            <span className="animate-champion-glow pointer-events-none absolute inset-0 rounded-full" />
                          )}
                          <div className={podiumAvatarInnerClass(rank)} style={{ background: theme.gradient }}>
                            {entry.avatarUrl ? (
                              <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                            ) : (
                              getInitials(entry.name)
                            )}
                          </div>
                        </div>
                        <span className="mt-1 line-clamp-2 max-w-full text-center text-[12.5px] leading-[1.25] font-extrabold text-(--text-primary)">
                          {entry.name}
                        </span>
                        {isMe && <span className={leaderboardMeTagClass}>Bạn</span>}
                        <div className="flex items-center gap-1">
                          <StarIcon size={12} color="#d4af6a" />
                          <span className={`font-['Open_Sans',sans-serif] text-[13.5px] font-extrabold ${rankPointColorClass(rank)}`}>
                            {formatPoints(entry.points)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="relative grid grid-cols-3 items-end gap-2.5">
                  {[2, 1, 3].map((rank) => {
                    const theme = medalTheme(rank)
                    return (
                      <div
                        key={rank}
                        className={podiumBaseClass(rank)}
                        style={{ background: theme.gradient, boxShadow: `0 10px 22px ${theme.glow}` }}
                      >
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.5),transparent)]" />
                        {rank === 1 && (
                          <span className="animate-medal-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)]" />
                        )}
                        <span className="relative">{rank}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {restRanking.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {restRanking.slice(0, visibleRankCount).map((entry, index) => {
                  const rank = index + 4
                  const isMe = entry.name === CURRENT_USER_NAME
                  return (
                    <div className={rankRowClass(isMe)} key={entry.name}>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,99,235,0.2),rgba(37,99,235,0.06))] font-['Open_Sans',sans-serif] text-[12px] font-extrabold text-(--gold-bright)">
                        {rank}
                      </span>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-(--surface-1) bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] font-['Open_Sans',sans-serif] text-[13px] font-bold text-(--on-gold) shadow-[0_3px_8px_var(--shadow)]">
                        {entry.avatarUrl ? (
                          <img className="h-full w-full object-cover" src={entry.avatarUrl} alt={entry.name} />
                        ) : (
                          getInitials(entry.name)
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate text-[14.5px] font-extrabold text-(--text-primary)">
                          {entry.name}
                        </span>
                        {isMe && <span className={leaderboardMeTagClass}>Bạn</span>}
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded-full border border-[rgba(212,175,106,0.45)] bg-[rgba(243,217,139,0.2)] px-3 py-1">
                        <StarIcon size={13} color="#d4af6a" />
                        <span className="font-['Open_Sans',sans-serif] text-[15px] font-extrabold text-[#8a6a1f] dark:text-[#f3d98b]">
                          {formatPoints(entry.points)}
                        </span>
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
                      Xem thêm <ArrowDownIcon size={12} />
                    </button>
                  )}
                  {visibleRankCount > INITIAL_RANK_COUNT && (
                    <button
                      type="button"
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-(--hairline) bg-transparent px-4 py-[7px] font-inherit text-[12.5px] font-bold text-(--text-tertiary) transition-[background,border-color] duration-150 hover:border-(--text-tertiary) hover:bg-(--surface-tint)"
                      onClick={() => setVisibleRankCount(INITIAL_RANK_COUNT)}
                    >
                      Thu gọn <ArrowUpIcon size={12} color="currentColor" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="px-11 pt-10 max-[640px]:px-5">
        <div className="relative overflow-hidden rounded-xl border border-[rgba(37,99,235,0.2)] bg-(--surface-1) px-9 py-8 shadow-[0_14px_32px_var(--shadow)] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.1),color-mix(in_srgb,var(--surface-1)_45%,transparent))] max-[640px]:px-5 max-[640px]:py-6">
          <span className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-[linear-gradient(180deg,var(--gold-deep),var(--gold))]" />
          <span className="pointer-events-none absolute -top-[110px] -right-[90px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16),transparent_70%)]" />

          <div className="relative z-[1] flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex h-9 items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
                <ClipIcon size={14} color="#ffffff" />
                CÁCH GHI ĐIỂM
              </div>
              <div className="inline-flex h-9 items-center gap-1.5 rounded-full border border-(--hairline) bg-(--surface-tint) px-3.5 text-xs font-bold whitespace-nowrap text-(--text-secondary)">
                <StarIcon size={12} color="#d4af6a" />
                {categories.length} hạng mục đang mở
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h1 className="m-0 max-w-[24ch] font-['Open_Sans',sans-serif] text-[34px] leading-[1.2] font-extrabold tracking-[0.3px] text-(--text-primary) max-[640px]:text-[26px]">
                Nộp minh chứng{' '}
                <span className="bg-[linear-gradient(90deg,var(--gold-deep),var(--gold-bright))] bg-clip-text text-transparent">
                  nhận điểm DTR
                </span>
              </h1>
              <p className="m-0 max-w-[62ch] text-sm leading-[1.65] font-medium text-(--text-tertiary)">
                Chọn một hạng mục bên dưới và nộp minh chứng để admin xét duyệt điểm.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-(--hairline) pt-4.5 max-[760px]:grid-cols-1 max-[760px]:gap-2.5">
              {submitSteps.map((step, index) => (
                <div className="flex items-center gap-3" key={step.title}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.1)] font-['Open_Sans',sans-serif] text-[13px] font-extrabold text-(--gold-bright)">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[13px] leading-[1.3] font-bold text-(--text-primary)">
                      {step.title}
                    </span>
                    <span className="text-[11.5px] leading-[1.35] text-(--text-tertiary)">
                      {step.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5 px-11 pt-6.5 max-[640px]:px-5">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon]
          const accent = breakdownAccents[category.icon]
          const maxPoints = Math.max(...category.pointOptions.map((option) => option.points))
          return (
            <div
              className="group relative flex flex-col gap-4.5 overflow-hidden rounded-xl border border-(--hairline) bg-(--surface-1) p-6.5 shadow-[0_10px_28px_var(--shadow)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_var(--shadow-strong)] max-[480px]:p-5"
              key={category.id}
            >
              <span
                className="pointer-events-none absolute -top-[90px] -right-[70px] h-[220px] w-[220px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${accent.bg}, transparent 70%)` }}
              />

              <div className="relative z-[1] flex flex-col gap-3">
                <span className="text-[11px] font-extrabold tracking-[1.2px] text-(--text-muted) uppercase">
                  Hạng mục {category.number}
                </span>

                <div className="flex items-start gap-4 max-[480px]:gap-3">
                  <div
                    className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[10px] border transition-transform duration-200 group-hover:scale-105"
                    style={{ background: accent.bg, borderColor: accent.border }}
                  >
                    <Icon size={24} color={accent.fg} />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h3 className="m-0 font-['Open_Sans',sans-serif] text-[18px] leading-[1.35] font-extrabold text-(--text-primary)">
                      {category.title}
                    </h3>
                    {category.audienceTag && (
                      <span className="w-fit rounded-full border border-[rgba(37,99,235,0.35)] bg-[rgba(37,99,235,0.14)] px-2.5 py-1 text-[11px] font-bold tracking-[0.4px] text-(--gold-bright)">
                        {category.audienceTag}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end max-[480px]:hidden">
                    <span className="font-['Open_Sans',sans-serif] text-[22px] leading-none font-extrabold text-(--gold-bright)">
                      {formatPoints(maxPoints)}
                    </span>
                    <span className="mt-1 text-[10px] font-bold tracking-[0.8px] text-(--text-muted) uppercase">
                      {category.pointOptions.length > 1 ? 'điểm tối đa' : 'điểm'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-[1] flex flex-col gap-2.5">
                <p className="m-0 text-[13.5px] leading-[1.6] text-(--text-tertiary)">{category.description}</p>
                {category.locationLabels && category.locationLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
              </div>

              <div className="relative z-[1] flex flex-wrap gap-2 border-t border-(--hairline) pt-4">
                {category.pointOptions.map((option) => (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.08)] px-3.5 py-2 text-xs font-bold whitespace-nowrap text-(--gold-bright)"
                    key={option.label}
                  >
                    <StarIcon size={12} color={accent.fg} />
                    {option.label === 'Điểm'
                      ? `${formatPoints(option.points)} điểm`
                      : `${option.label} · ${formatPoints(option.points)} điểm`}
                  </span>
                ))}
                {category.id === 'training-kickoff' && (
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-[rgba(76,175,130,0.4)] bg-[rgba(76,175,130,0.12)] px-3.5 py-2 font-inherit text-xs font-bold whitespace-nowrap text-(--positive) transition-[background,border-color] duration-150 hover:border-[rgba(76,175,130,0.6)] hover:bg-[rgba(76,175,130,0.22)]"
                    onClick={() => setShowQrScanner(true)}
                  >
                    Quét QR tự động
                  </button>
                )}
              </div>

              <button
                className="relative z-[1] flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-4 py-3 font-['Open_Sans',sans-serif] text-sm font-bold whitespace-nowrap text-(--on-gold) shadow-[0_8px_20px_rgba(37,99,235,0.28)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_12px_26px_rgba(37,99,235,0.4)]"
                type="button"
                onClick={() => setOpenCategory(category)}
              >
                {category.id === 'training-kickoff' ? 'Nộp thủ công' : 'Nộp minh chứng'}
                <span className="inline-flex transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRightIcon color="#ffffff" />
                </span>
              </button>
            </div>
          )
        })}
      </section>

      <section className="flex px-11 pt-11 pb-2 max-[640px]:px-5">
        <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-[rgba(212,175,106,0.4)] bg-(--surface-1) px-10 py-9 shadow-[0_16px_36px_var(--shadow)] before:absolute before:-top-[120px] before:-right-[100px] before:h-[280px] before:w-[280px] before:rounded-full before:bg-[radial-gradient(circle,rgba(212,175,106,0.22),transparent_70%)] before:pointer-events-none before:content-[''] dark:bg-[linear-gradient(135deg,rgba(212,175,106,0.1),color-mix(in_srgb,var(--surface-1)_40%,transparent))] max-[640px]:gap-5 max-[640px]:px-5 max-[640px]:py-6">
          <div className="relative z-[1] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-bold tracking-[1.5px] text-(--text-tertiary) uppercase">
                Tổng điểm DTR hiện tại
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] bg-clip-text font-['Open_Sans',sans-serif] text-[64px] leading-none font-extrabold text-transparent max-[640px]:text-[48px]">
                  {totalPoints}
                </span>
                <span className="font-['Open_Sans',sans-serif] text-[20px] font-bold text-(--text-tertiary)">
                  / {nextTierAt} điểm
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-full bg-[linear-gradient(90deg,#c79a43,#f3d98b)] py-2.5 pr-4.5 pl-3 text-[13px] font-bold whitespace-nowrap text-[#4a3610] shadow-[0_8px_18px_rgba(199,154,67,0.35)]">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.45)]">
                <CrownIcon size={13} color="#4a3610" />
              </span>
              {tierName}
            </div>
          </div>

          <div className="relative z-[1] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 text-[11px] font-extrabold tracking-[0.8px] text-(--text-muted) uppercase">
              <span>{tierName}</span>
              <span>Hạng Vương Miện</span>
            </div>

            <div className="relative">
              <div className="h-3 overflow-hidden rounded-full bg-(--hairline)">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#c79a43,#f3d98b)] transition-[width] duration-[400ms] ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span
                className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-(--surface-1) bg-[#e0a92e] shadow-[0_2px_10px_rgba(199,154,67,0.7)] transition-[left] duration-[400ms] ease-in-out"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-[13px] text-(--text-secondary)">
                Còn <b className="text-[#8a6a1f] dark:text-[#f3d98b]">{pointsToNextTier} điểm</b> nữa để lên
                hạng tiếp theo
              </div>
              <div className="shrink-0 font-['Open_Sans',sans-serif] text-[15px] font-extrabold text-[#8a6a1f] dark:text-[#f3d98b]">
                {progressPercent}%
              </div>
            </div>
          </div>

          <div className="relative z-[1] flex flex-col gap-3 border-t border-(--hairline) pt-5">
            <div className="text-xs font-extrabold tracking-[0.6px] text-(--text-tertiary) uppercase">
              Chi tiết điểm đã ghi nhận
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 max-[640px]:grid-cols-2 max-[640px]:gap-2.5">
              {pointBreakdown.map((item, index) => {
                const iconKey = categories[index]?.icon ?? 'office'
                const Icon = categoryIcons[iconKey]
                const accent = breakdownAccents[iconKey]
                return (
                  <div
                    className={`group relative flex min-w-0 flex-col gap-2.5 overflow-hidden rounded-lg border border-(--hairline) bg-(--surface-tint) px-4 pt-4 pb-3.5 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_var(--shadow)] max-[640px]:px-3 max-[640px]:pt-3.5 max-[640px]:pb-3 ${
                      item.count === 0 ? 'opacity-55' : ''
                    }`}
                    key={item.label}
                    style={{ borderColor: item.count === 0 ? undefined : accent.border }}
                  >
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
                      style={{ background: accent.fg }}
                    />

                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border transition-transform duration-150 group-hover:scale-[1.08] max-[640px]:h-[30px] max-[640px]:w-[30px]"
                        style={{ background: accent.bg, borderColor: accent.border }}
                      >
                        <Icon size={16} color={accent.fg} />
                      </div>
                      <span className="font-['Open_Sans',sans-serif] text-[26px] leading-none font-extrabold text-(--text-primary) max-[640px]:text-[22px]">
                        {item.count}
                      </span>
                    </div>

                    <div className="text-[11.5px] leading-[1.3] font-semibold break-words text-(--text-tertiary) max-[640px]:text-[10.5px]">
                      {item.label}
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
