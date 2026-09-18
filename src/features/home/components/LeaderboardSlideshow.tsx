import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPoints } from '@/utils/format'
import { useLanguage } from '@/context/LanguageContext'
import type { LeaderboardEntry } from './LeaderboardSection'
import { getInitials } from './LeaderboardSection'

const SLIDE_COUNT = 2
const SLIDE_MS = 6000

/** Mọi kích thước tính theo cqw (1cqw = 1% bề ngang thẻ) nên bố cục giữ đúng tỉ lệ ảnh mẫu ở mọi màn hình. */
const ROW_CLIP =
  'polygon(0 0, calc(100% - 2.4cqw) 0, 100% 50%, calc(100% - 2.4cqw) 100%, 0 100%)'
const HEX_CLIP = 'polygon(50% 0%, 94% 25%, 94% 75%, 50% 100%, 6% 75%, 6% 25%)'
const RIBBON_CLIP =
  'polygon(0 0, 100% 0, calc(100% - 1.5cqw) 50%, 100% 100%, 0 100%, 1.5cqw 50%)'
const SCORE_CLIP =
  'polygon(0.85cqw 0, calc(100% - 0.85cqw) 0, 100% 50%, calc(100% - 0.85cqw) 100%, 0.85cqw 100%, 0 50%)'

const GOLD_EDGE = 'linear-gradient(180deg,#fff3b8 0%,#e7bd4b 38%,#a8761a 72%,#f2d477 100%)'
const GOLD_FILL =
  'linear-gradient(180deg,#fffbe2 0%,#f8e394 22%,#edc855 48%,#d9a62c 74%,#f4dc8f 100%)'
/** Ô điểm của hạng 1 và các hạng còn lại dùng chung bề rộng để các con số thẳng một hàng dọc. */
const SCORE_BOX = '4.6cqw'

const NAVY_FILL = 'linear-gradient(180deg,#123a78 0%,#0a2255 45%,#061738 100%)'

type LeaderboardSlideshowProps = {
  ranking: LeaderboardEntry[]
  monthKey: string
  monthLabel: string
}

function formatBoardMonth(monthKey: string, locale: 'vi' | 'en') {
  const [year, month] = monthKey.split('-')
  if (locale === 'en') {
    const date = new Date(Number(year), Number(month) - 1, 1)
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
  }
  return `THÁNG ${Number(month)}/${year}`
}

/* ------------------------------------------------------------------ nền sân khấu */

function StageBackdrop() {
  const sparks = [
    [8, 22, 0.55, 0.5],
    [16, 58, 0.4, 0.35],
    [24, 12, 0.7, 0.6],
    [33, 40, 0.35, 0.3],
    [45, 8, 0.5, 0.45],
    [58, 30, 0.4, 0.35],
    [67, 14, 0.6, 0.5],
    [76, 52, 0.45, 0.4],
    [86, 24, 0.65, 0.55],
    [93, 62, 0.4, 0.3],
    [50, 70, 0.35, 0.25],
    [12, 80, 0.45, 0.3],
    [88, 82, 0.5, 0.35],
  ] as const

  return (
    <>
      {/* quầng sáng vàng đổ từ đỉnh + nền xanh dương chuyển tối ra rìa */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 78% at 50% -14%, rgba(255,214,110,0.42) 0%, rgba(255,199,79,0.16) 26%, rgba(12,52,116,0) 58%), radial-gradient(110% 92% at 50% 34%, #2159ab 0%, #16458f 34%, #0b2559 62%, #061334 100%)',
        }}
      />

      {/* chùm tia sáng toả xuống */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 160 90"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="lb-beam" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffdf8f" stopOpacity="0.34" />
            <stop offset="55%" stopColor="#ffd06a" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffd06a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          [72, 46, 90],
          [78, 60, 90],
          [84, 100, 90],
          [88, 118, 90],
          [64, 8, 90],
          [60, -14, 88],
        ].map(([x1, x2, y], index) => (
          <polygon
            key={index}
            fill="url(#lb-beam)"
            opacity={0.85 - index * 0.1}
            points={`80,-4 ${x1},${y} ${x2},${y}`}
          />
        ))}
      </svg>

      {/* hạt sáng bokeh */}
      {sparks.map(([left, top, size, opacity], index) => (
        <span
          key={index}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}cqw`,
            height: `${size}cqw`,
            opacity,
            background: 'radial-gradient(circle, #fff3c4 0%, rgba(245,197,66,0.55) 45%, transparent 72%)',
            boxShadow: '0 0 0.7cqw rgba(255,220,130,0.7)',
          }}
        />
      ))}

      {/* bục sân khấu phát sáng ở đáy */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '22cqw',
          background:
            'radial-gradient(60% 100% at 50% 122%, rgba(255,214,120,0.5) 0%, rgba(255,199,79,0.18) 38%, rgba(6,20,48,0) 72%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '3.4cqw',
          background: 'linear-gradient(180deg, rgba(6,18,44,0) 0%, rgba(4,12,32,0.85) 100%)',
        }}
      />
    </>
  )
}

/* ---------------------------------------------------------------- khung góc vàng */

function CornerFrame() {
  const base = 'pointer-events-none absolute text-[#f3cf6a]'
  const box = { width: '9.5cqw', height: '9.5cqw' } as const
  const Mark = () => (
    <svg viewBox="0 0 80 80" fill="none" className="h-full w-full" aria-hidden>
      <path d="M4 66V16c0-7 4-11 11-11h52" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 62V19c0-5 3-8 8-8h44" stroke="currentColor" strokeWidth="1.1" opacity="0.7" strokeLinecap="round" />
      <path d="M17 30c9-4 20-6 34-6" stroke="currentColor" strokeWidth="1" opacity="0.45" strokeLinecap="round" />
      <path d="M4 44c0-6 2-9 7-11" stroke="currentColor" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
      <path d="M14 8 18 4l4 4-4 4z" fill="currentColor" />
      <circle cx="40" cy="7" r="1.8" fill="currentColor" opacity="0.8" />
      <circle cx="7" cy="40" r="1.8" fill="currentColor" opacity="0.8" />
    </svg>
  )
  return (
    <>
      <span className={`${base} top-0 left-0`} style={box}>
        <Mark />
      </span>
      <span className={`${base} top-0 right-0 -scale-x-100`} style={box}>
        <Mark />
      </span>
      <span className={`${base} bottom-0 left-0 -scale-y-100`} style={box}>
        <Mark />
      </span>
      <span className={`${base} right-0 bottom-0 -scale-100`} style={box}>
        <Mark />
      </span>
    </>
  )
}

/* ------------------------------------------------------------- ruy băng kim tuyến */

function Streamers() {
  const Ribbon = () => (
    <svg viewBox="0 0 120 140" fill="none" className="h-full w-full" aria-hidden>
      <path
        d="M14 6c18 16 6 34-8 44 16-2 30 8 26 24-3 13-18 18-28 12"
        stroke="#f6d977"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M52 2c14 22 0 38-14 48 18 0 32 12 26 28"
        stroke="#e9b93f"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path d="M78 22c10 12 4 24-6 30" stroke="#fff0bd" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="86" cy="76" r="3" fill="#f6d977" opacity="0.8" />
      <circle cx="30" cy="104" r="2.4" fill="#fff0bd" opacity="0.7" />
      <rect x="64" y="96" width="7" height="7" rx="1.5" fill="#f6d977" opacity="0.6" transform="rotate(24 64 96)" />
      <rect x="18" y="62" width="6" height="6" rx="1.5" fill="#fff0bd" opacity="0.5" transform="rotate(-18 18 62)" />
    </svg>
  )
  return (
    <>
      <span className="pointer-events-none absolute top-0 left-0" style={{ width: '11.5cqw', height: '13.5cqw' }}>
        <Ribbon />
      </span>
      <span
        className="pointer-events-none absolute top-0 right-0 -scale-x-100"
        style={{ width: '11.5cqw', height: '13.5cqw' }}
      >
        <Ribbon />
      </span>
    </>
  )
}

/* ------------------------------------------------------------------ nhành nguyệt quế */

const LAUREL_LEAVES = [
  [70, 112, -20],
  [55, 100, -9],
  [42, 87, 2],
  [32, 72, 14],
  [25, 56, 27],
  [21, 39, 40],
  [21, 21, 53],
] as const

const LAUREL_BERRIES = [
  [86, 118],
  [71, 106],
  [58, 93],
  [48, 77],
  [41, 60],
  [36, 42],
  [34, 24],
] as const

function LaurelBranch({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 130"
      fill="none"
      className={`h-full w-full ${flip ? '-scale-x-100' : ''}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="lb-laurel" x1="1" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#a87718" />
          <stop offset="38%" stopColor="#f0cb5f" />
          <stop offset="72%" stopColor="#fff6cd" />
          <stop offset="100%" stopColor="#e0b342" />
        </linearGradient>
      </defs>
      <path
        d="M100 126C74 117 52 96 41 66 34 46 32 28 34 10"
        stroke="url(#lb-laurel)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {LAUREL_LEAVES.map(([cx, cy, rot], index) => (
        <ellipse
          key={index}
          cx={cx}
          cy={cy}
          rx={14.4 - index * 0.7}
          ry={6.4 - index * 0.25}
          fill="url(#lb-laurel)"
          stroke="#8a5f0f"
          strokeWidth="0.8"
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      ))}
      {LAUREL_BERRIES.map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r={2.6 - index * 0.15} fill="#fff3c2" opacity="0.85" />
      ))}
      <circle cx="100" cy="126" r="3.4" fill="#fff3c2" />
    </svg>
  )
}

/* ---------------------------------------------------------------------- vương miện */

function Crown({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 72 50" fill="none" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="lb-crown" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff8da" />
          <stop offset="45%" stopColor="#f5cf5c" />
          <stop offset="100%" stopColor="#bc8a1c" />
        </linearGradient>
      </defs>
      <path
        d="M6 40 8 12l14 12L36 4l14 20 14-12-2 28Z"
        fill="url(#lb-crown)"
        stroke="#7a4a06"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="6" y="38" width="60" height="9" rx="3" fill="url(#lb-crown)" stroke="#7a4a06" strokeWidth="1.6" />
      <circle cx="8" cy="10" r="3.4" fill="#fff8da" stroke="#7a4a06" strokeWidth="1.2" />
      <circle cx="36" cy="4" r="3.8" fill="#fff8da" stroke="#7a4a06" strokeWidth="1.2" />
      <circle cx="64" cy="10" r="3.4" fill="#fff8da" stroke="#7a4a06" strokeWidth="1.2" />
      <circle cx="36" cy="43" r="2.4" fill="#8c5a08" opacity="0.65" />
    </svg>
  )
}

/* ------------------------------------------------------------------------ huy hiệu */

function RankBadge({ rank }: { rank: number }) {
  const size = { width: '4.9cqw', height: '5.5cqw' }
  const medal: Record<number, { edge: string; face: string; text: string }> = {
    1: {
      edge: 'linear-gradient(180deg,#fff7cc,#f0c74e 48%,#9c6f12)',
      face: 'linear-gradient(180deg,#fff6c0 0%,#f4d267 40%,#d9a72c 100%)',
      text: '#5b3b00',
    },
    2: {
      edge: 'linear-gradient(180deg,#ffffff,#c9d5e4 48%,#6f8098)',
      face: 'linear-gradient(180deg,#fbfdff 0%,#dbe4ef 42%,#9fb0c4 100%)',
      text: '#1b2c45',
    },
    3: {
      edge: 'linear-gradient(180deg,#ffd9b0,#c8813d 48%,#7c4413)',
      face: 'linear-gradient(180deg,#ffdcb4 0%,#dc9c55 44%,#a2601f 100%)',
      text: '#4a2405',
    },
  }

  if (rank <= 3) {
    const tone = medal[rank]
    return (
      <span
        className="relative z-[2] flex shrink-0 items-center justify-center"
        style={{ ...size, filter: 'drop-shadow(0 0.25cqw 0.55cqw rgba(0,0,0,0.45))' }}
      >
        <span className="absolute inset-0" style={{ clipPath: HEX_CLIP, background: tone.edge }} />
        <span
          className="absolute"
          style={{ inset: '0.26cqw', clipPath: HEX_CLIP, background: tone.face }}
        />
        <span
          className="lb-optical-center relative font-black tabular-nums"
          style={{ color: tone.text, fontSize: 'max(8px, 2.4cqw)', lineHeight: 1 }}
        >
          {rank}
        </span>
      </span>
    )
  }

  return (
    <span
      className="relative z-[2] flex shrink-0 items-center justify-center"
      style={{ width: '4.9cqw', height: '4.9cqw' }}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="24" cy="24" r="21" fill="#071b3f" />
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="#e7bd4b"
          strokeWidth="2.4"
          strokeDasharray="14 5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="16.5" fill="none" stroke="#f6dd90" strokeWidth="1.1" opacity="0.65" />
      </svg>
      <span
        className="lb-optical-center relative font-black tabular-nums text-[#f7d977]"
        style={{ fontSize: 'max(8px, 2.25cqw)', lineHeight: 1 }}
      >
        {rank}
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------------- dòng xếp hạng */

function RankRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const champion = rank === 1

  return (
    <li
      className="relative flex min-h-0 flex-1 items-center"
      style={{
        paddingLeft: '0.5cqw',
        paddingRight: '2.6cqw',
        gap: '0.75cqw',
        filter: champion
          ? 'drop-shadow(0 0.4cqw 1.1cqw rgba(247,205,88,0.42))'
          : 'drop-shadow(0 0.3cqw 0.7cqw rgba(2,8,24,0.55))',
      }}
    >
      {/* thân dòng: viền vàng + ruột, đầu trái bo tròn, đầu phải vát nhọn */}
      <span className="absolute inset-0" style={{ clipPath: ROW_CLIP }} aria-hidden>
        <span className="absolute inset-0 rounded-l-full" style={{ background: GOLD_EDGE }} />
        <span
          className="absolute rounded-l-full"
          style={{ inset: '0.25cqw', background: champion ? GOLD_FILL : NAVY_FILL }}
        />
        {champion ? (
          <span
            className="absolute rounded-l-full"
            style={{
              inset: '0.25cqw',
              background:
                'linear-gradient(100deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0) 60%)',
            }}
          />
        ) : (
          <span
            className="absolute rounded-l-full"
            style={{
              inset: '0.25cqw',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 52%)',
            }}
          />
        )}
      </span>

      {champion ? (
        <Crown
          className="absolute z-[3]"
          style={{ width: '3cqw', height: '2.1cqw', left: '1.45cqw', top: '-1.75cqw' }}
        />
      ) : null}

      <RankBadge rank={rank} />

      <span
        className="relative z-[2] flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold"
        style={{
          width: '4.5cqw',
          height: '4.5cqw',
          fontSize: 'max(6px, 1.5cqw)',
          background: champion ? '#13305f' : '#0d2a5c',
          color: '#fff',
          boxShadow: champion
            ? '0 0 0 0.28cqw #fff4c2, 0 0 0 0.5cqw rgba(122,74,6,0.5)'
            : '0 0 0 0.26cqw #e7bd4b',
        }}
      >
        {entry.avatarUrl ? (
          <img className="h-full w-full object-cover" src={entry.avatarUrl} alt="" />
        ) : (
          getInitials(entry.name)
        )}
      </span>

      <span
        className="relative z-[2] min-w-0 flex-1 truncate font-extrabold"
        style={{
          fontSize: 'max(7px, 1.85cqw)',
          lineHeight: 1.15,
          color: champion ? '#1d2b4d' : '#ffffff',
          textShadow: champion ? '0 0.1cqw 0 rgba(255,255,255,0.45)' : '0 0.15cqw 0.3cqw rgba(0,0,0,0.55)',
        }}
      >
        {entry.name}
      </span>

      {/* vách chevron ngăn cách phần điểm */}
      <svg
        className="relative z-[2] shrink-0"
        style={{ width: '1cqw', height: '3.4cqw' }}
        viewBox="0 0 12 40"
        fill="none"
        aria-hidden
      >
        <path
          d="M2 2 10 20 2 38"
          stroke={champion ? 'rgba(122,74,6,0.55)' : '#e7bd4b'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {champion ? (
        <span
          className="relative z-[2] flex shrink-0 items-center justify-center"
          style={{ width: SCORE_BOX, height: '3.7cqw' }}
        >
          <span
            className="absolute inset-0"
            style={{ clipPath: SCORE_CLIP, background: 'linear-gradient(180deg,#e7bd4b,#a8761a)' }}
          />
          <span
            className="absolute"
            style={{ inset: '0.22cqw', clipPath: SCORE_CLIP, background: NAVY_FILL }}
          />
          <span
            className="lb-optical-center relative font-black tabular-nums text-[#f7d977]"
            style={{ fontSize: 'max(8px, 2.15cqw)', lineHeight: 1 }}
          >
            {formatPoints(entry.points)}
          </span>
        </span>
      ) : (
        <span
          className="lb-optical-center relative z-[2] shrink-0 text-center font-black tabular-nums text-white"
          style={{
            width: SCORE_BOX,
            fontSize: 'max(8px, 2.15cqw)',
            lineHeight: 1,
            textShadow: '0 0.15cqw 0.35cqw rgba(0,0,0,0.6)',
          }}
        >
          {formatPoints(entry.points)}
        </span>
      )}
    </li>
  )
}

/* ----------------------------------------------------------------------- component */

export default function LeaderboardSlideshow({ ranking, monthKey }: LeaderboardSlideshowProps) {
  const navigate = useNavigate()
  const { locale, t } = useLanguage()
  const left = ranking.slice(0, 5)
  const right = ranking.slice(5, 10)
  const monthText = formatBoardMonth(monthKey, locale)
  const title = t('board.title')
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const swiped = useRef(false)

  const goTo = (next: number) => {
    setSlide(((next % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT)
  }

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % SLIDE_COUNT)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [paused, slide])

  const openRanking = () => {
    if (slide !== 0 || swiped.current) return
    navigate(`/ranking?month=${monthKey}`)
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#d4a017]/40 shadow-[0_12px_32px_rgba(8,18,40,0.35)] xl:rounded-3xl"
      style={{ containerType: 'inline-size' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX
        swiped.current = false
      }}
      onTouchEnd={(event) => {
        if (touchX.current == null) return
        const dx = event.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) {
          swiped.current = true
          goTo(slide + (dx < 0 ? 1 : -1))
        }
        touchX.current = null
      }}
    >
      <div
        className={`absolute inset-0 cursor-pointer overflow-hidden text-left transition-opacity duration-500 ${
          slide === 0 ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
        }`}
        onClick={openRanking}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openRanking()
          }
        }}
        role="link"
        tabIndex={slide === 0 ? 0 : -1}
        aria-hidden={slide !== 0}
        aria-label="Mở bảng xếp hạng theo tháng"
      >
        <StageBackdrop />
        <Streamers />
        <CornerFrame />

        <div
          className="relative flex h-full min-h-0 flex-col"
          style={{ padding: '2.2cqw 4cqw 4.2cqw', gap: '2cqw' }}
        >
          {/* ---------------------------------------------------------- tiêu đề */}
          <div className="flex shrink-0 flex-col items-center">
            <div className="flex items-end justify-center" style={{ gap: '1.2cqw' }}>
              <span className="shrink-0" style={{ width: '8.2cqw', height: '8.2cqw' }}>
                <LaurelBranch />
              </span>

              <span className="relative flex flex-col items-center">
                <Crown
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ width: '5cqw', height: '3.5cqw', top: '-2.9cqw' }}
                />
                <span className="relative inline-block" style={{ fontSize: 'max(12px, 4.5cqw)' }}>
                  <span
                    aria-hidden
                    className="absolute inset-0 whitespace-nowrap font-black"
                    style={{
                      letterSpacing: '0.02em',
                      lineHeight: 1.14,
                      color: 'transparent',
                      WebkitTextStroke: '0.52cqw #6d3f05',
                      filter: 'drop-shadow(0 0.35cqw 0.5cqw rgba(0,0,0,0.5))',
                    }}
                  >
                    {title}
                  </span>
                  <span
                    className="relative whitespace-nowrap bg-clip-text font-black text-transparent"
                    style={{
                      letterSpacing: '0.02em',
                      lineHeight: 1.14,
                      backgroundImage:
                        'linear-gradient(180deg,#fffdf0 0%,#fdeaa4 26%,#f3cf5e 48%,#d9a324 68%,#f7e3a0 88%,#c9931b 100%)',
                    }}
                  >
                    {title}
                  </span>
                </span>
              </span>

              <span className="shrink-0" style={{ width: '8.2cqw', height: '8.2cqw' }}>
                <LaurelBranch flip />
              </span>
            </div>

            {/* dải ruy băng tháng */}
            <span
              className="relative flex items-center justify-center"
              style={{
                marginTop: '1.1cqw',
                minWidth: '24cqw',
                height: '4.1cqw',
                filter: 'drop-shadow(0 0.35cqw 0.7cqw rgba(0,0,0,0.42))',
              }}
            >
              <span
                className="absolute inset-0"
                style={{ clipPath: RIBBON_CLIP, background: GOLD_EDGE }}
              />
              <span
                className="absolute"
                style={{
                  inset: '0.3cqw',
                  clipPath: RIBBON_CLIP,
                  background: 'linear-gradient(180deg,#123a78 0%,#0a2255 55%,#061738 100%)',
                }}
              />
              <span
                className="lb-optical-center relative whitespace-nowrap font-extrabold text-[#f7dd8f] uppercase"
                style={{
                  fontSize: 'max(7px, 2.05cqw)',
                  letterSpacing: '0.16em',
                  padding: '0 3cqw',
                  lineHeight: 1,
                  textShadow: '0 0.15cqw 0.3cqw rgba(0,0,0,0.6)',
                }}
              >
                {monthText}
              </span>
            </span>
          </div>

          {/* ----------------------------------------------------- hai cột 5 dòng */}
          <div
            className="grid min-h-0 flex-1 grid-cols-2 grid-rows-1"
            style={{ columnGap: '2.6cqw' }}
          >
            <ul className="flex h-full min-h-0 min-w-0 flex-col" style={{ gap: '1.15cqw' }}>
              {left.map((entry, index) => (
                <RankRow key={entry.name} entry={entry} rank={index + 1} />
              ))}
            </ul>
            <ul className="flex h-full min-h-0 min-w-0 flex-col" style={{ gap: '1.15cqw' }}>
              {right.map((entry, index) => (
                <RankRow key={entry.name} entry={entry} rank={index + 6} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 bg-[#071226] transition-opacity duration-500 ${
          slide === 1 ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
        }`}
        aria-hidden={slide !== 1}
      >
        <img
          src="/filetinhdiem.jpg"
          alt="Cách thu hoạch DTR Point"
          className="h-full w-full object-contain object-center md:object-cover xl:object-contain"
        />
      </div>

      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 md:bottom-3">
        {Array.from({ length: SLIDE_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              slide === index ? 'w-5 bg-[#f5c542]' : 'w-1.5 bg-white/45'
            }`}
            onClick={(event) => {
              event.stopPropagation()
              goTo(index)
            }}
          />
        ))}
      </div>
    </div>
  )
}
