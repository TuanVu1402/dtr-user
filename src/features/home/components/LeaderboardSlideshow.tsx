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
  'polygon(0 0, calc(100% - 2.6cqw) 0, 100% 50%, calc(100% - 2.6cqw) 100%, 0 100%)'
const MONTH_CLIP =
  'polygon(1.2cqw 0, calc(100% - 1.2cqw) 0, 100% 50%, calc(100% - 1.2cqw) 100%, 1.2cqw 100%, 0 50%)'

/** Ô điểm của mọi hạng dùng chung bề rộng để các con số thẳng một hàng dọc. */
const SCORE_BOX = '4cqw'

const ROW_EDGE_BLUE =
  'linear-gradient(90deg,#2f5794 0%,#7aa3d6 28%,#aecaee 50%,#7aa3d6 72%,#2f5794 100%)'
const ROW_EDGE_GOLD =
  'linear-gradient(90deg,#7d5f18 0%,#e8ca74 26%,#f9ebb6 50%,#d7b256 74%,#6b5417 100%)'
const ROW_NAVY = 'linear-gradient(180deg,#1a3c74 0%,#123163 46%,#0b1f47 100%)'
/** Hàng quán quân: vàng rực ở nửa trái, trầm dần về phía ô điểm — theo ảnh mẫu. */
const ROW_GOLD =
  'linear-gradient(90deg,#8f6c1c 0%,#e3bd52 5%,#fbf0bc 17%,#f4dc8c 32%,#d9ae42 50%,#9b7825 68%,#6f5718 85%,#544110 100%)'

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
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 24% at 50% 2%, rgba(247,220,140,0.16) 0%, rgba(247,220,140,0) 74%), radial-gradient(74% 58% at 50% 36%, #17396f 0%, #103060 34%, #0a1f45 64%, #060f26 88%, #040a1a 100%)',
        }}
      />

      {/* quầng sáng ấm rất nhẹ sát mép dưới — chỉ đủ tách chân bảng khỏi nền */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '6cqw',
          background:
            'radial-gradient(48% 100% at 50% 116%, rgba(255,198,96,0.34) 0%, rgba(255,176,64,0.1) 46%, rgba(6,16,40,0) 76%)',
        }}
      />

    </>
  )
}

/* ------------------------------------------------------- dải vàng lớn ở bốn góc */

function CornerBands() {
  const Band = () => (
    <svg viewBox="0 0 100 78" fill="none" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="lb-band" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fdf3c8" />
          <stop offset="34%" stopColor="#e9c765" />
          <stop offset="70%" stopColor="#b98c2c" />
          <stop offset="100%" stopColor="#7a5a16" />
        </linearGradient>
        <linearGradient id="lb-band-soft" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7e3a4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9c7423" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {/* nêm vàng đặc ôm sát góc */}
      <path d="M0 0H52L0 40Z" fill="url(#lb-band)" />
      {/* hai dải song song phía trong */}
      <path d="M62 0H80L0 64V48Z" fill="url(#lb-band-soft)" opacity="0.8" />
      <path d="M90 0H98L0 76V70Z" fill="url(#lb-band-soft)" opacity="0.45" />
    </svg>
  )
  const box = { width: '19cqw', height: '15cqw' } as const
  return (
    <>
      <span className="pointer-events-none absolute top-0 left-0" style={box}>
        <Band />
      </span>
      <span className="pointer-events-none absolute top-0 right-0 -scale-x-100" style={box}>
        <Band />
      </span>
      <span className="pointer-events-none absolute bottom-0 left-0 -scale-y-100" style={box}>
        <Band />
      </span>
      <span className="pointer-events-none absolute right-0 bottom-0 -scale-100" style={box}>
        <Band />
      </span>
    </>
  )
}

/* ------------------------------------------------------ vương miện + nguyệt quế */

const CROWN_GRADIENT = (
  <linearGradient id="lb-crown" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stopColor="#fff8da" />
    <stop offset="45%" stopColor="#f2cf60" />
    <stop offset="100%" stopColor="#bc8a1c" />
  </linearGradient>
)

function CrownPath() {
  return (
    <>
      <path
        d="M6 40 8 12l14 12L36 4l14 20 14-12-2 28Z"
        fill="url(#lb-crown)"
        stroke="#7a4a06"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="6" y="38" width="60" height="9" rx="3" fill="url(#lb-crown)" stroke="#7a4a06" strokeWidth="1.6" />
      <circle cx="8" cy="10" r="3.2" fill="#fff8da" stroke="#7a4a06" strokeWidth="1.3" />
      <circle cx="36" cy="4" r="3.6" fill="#fff8da" stroke="#7a4a06" strokeWidth="1.3" />
      <circle cx="64" cy="10" r="3.2" fill="#fff8da" stroke="#7a4a06" strokeWidth="1.3" />
    </>
  )
}

/**
 * Lá nguyệt quế của emblem tiêu đề: [cx, cy, độ xoay, bán trục dài, bán trục ngắn].
 * Tâm lá nằm trên cung bán kính 50 quanh (65, 62); góc xoay = gócCung - 50 để lá xoè ra ngoài.
 */
const WREATH_LEAVES = [
  [58, 112, 48, 15, 5.6],
  [42, 106, 68, 14.6, 5.4],
  [28, 95, 88, 14, 5.2],
  [19, 81, 108, 13.2, 4.9],
  [15, 64, 128, 12.4, 4.6],
  [17, 47, 148, 11.4, 4.3],
  [26, 31, 168, 10.2, 3.9],
  [39, 20, 188, 8.8, 3.4],
] as const

/** Vòng nguyệt quế ôm lấy vương miện: hai nhánh bắt chéo ở đáy, mở miệng lên trên. */
function CrownWreath({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 130 122" fill="none" className={className} style={style} aria-hidden>
      <defs>
        {CROWN_GRADIENT}
        <linearGradient id="lb-wreath" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0%" stopColor="#a87718" />
          <stop offset="40%" stopColor="#eec95c" />
          <stop offset="74%" stopColor="#fff6cd" />
          <stop offset="100%" stopColor="#deb03f" />
        </linearGradient>
      </defs>

      {[0, 1].map((side) => (
        <g key={side} transform={side ? 'translate(130,0) scale(-1,1)' : undefined}>
          {/* cuống vượt qua trục giữa một chút để hai nhánh bắt chéo ở đáy */}
          <path
            d="M72 114C46 110 25 92 23 64 21 45 29 31 43 23"
            stroke="url(#lb-wreath)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {WREATH_LEAVES.map(([cx, cy, rot, rx, ry], index) => (
            <ellipse
              key={index}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="url(#lb-wreath)"
              stroke="#8a5f0f"
              strokeWidth="0.7"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
          ))}
        </g>
      ))}

      {/* vương miện nằm trong lòng vòng lá */}
      <g transform="translate(32, 38) scale(0.92)">
        <CrownPath />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------------ huy hiệu */

type Tone = { face: string; ring: string; leaf: string; leafEdge: string; digit: string }

const GOLD_TONE: Tone = {
  face: 'radial-gradient(circle at 38% 26%, #fff4c4 0%, #f0cd6a 34%, #d3a234 66%, #9d711a 100%)',
  ring: '#ffeeb0',
  leaf: '#eec95c',
  leafEdge: '#8a5f0f',
  digit: '#5b3b00',
}
const SILVER_TONE: Tone = {
  face: 'radial-gradient(circle at 38% 26%, #f4f8fd 0%, #d2dfef 34%, #9db1cb 66%, #6b8099 100%)',
  ring: '#eef4fb',
  leaf: '#d6e2f1',
  leafEdge: '#61789a',
  digit: '#1b2c45',
}
const BRONZE_TONE: Tone = {
  face: 'radial-gradient(circle at 38% 26%, #ffdcb4 0%, #efb277 34%, #c87a34 66%, #91541a 100%)',
  ring: '#ffd9ab',
  leaf: '#f0bd84',
  leafEdge: '#8a4f17',
  digit: '#4a2405',
}
const STEEL_TONE: Tone = {
  face: 'radial-gradient(circle at 38% 26%, #21508f 0%, #17396f 40%, #0e2450 74%, #091b3c 100%)',
  ring: '#8fb2e0',
  leaf: '#b9cdea',
  leafEdge: '#48679a',
  digit: '#ffffff',
}

function toneFor(rank: number) {
  if (rank === 1) return GOLD_TONE
  if (rank === 2) return SILVER_TONE
  if (rank === 3) return BRONZE_TONE
  return STEEL_TONE
}

/** Lá nguyệt quế ôm nửa dưới huy hiệu: [cx, cy, độ xoay] trên cung bán kính 52. */
const MEDAL_LEAVES = [
  [53, 111, 15],
  [28, 96, 50],
  [17, 69, 85],
  [23, 41, 120],
] as const

function RankMedal({ rank }: { rank: number }) {
  const tone = toneFor(rank)
  return (
    <span
      className="relative z-[3] flex shrink-0 items-center justify-center"
      style={{
        width: '6cqw',
        height: '6cqw',
        filter: 'drop-shadow(0 0.22cqw 0.45cqw rgba(2,8,24,0.6))',
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 130 130" fill="none" aria-hidden>
        {[0, 1].map((side) => (
          <g key={side} transform={side ? 'translate(130,0) scale(-1,1)' : undefined}>
            <path
              d="M58 108C36 102 20 90 19 68 18 52 24 44 32 38"
              stroke={tone.leaf}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            {MEDAL_LEAVES.map(([cx, cy, rot], index) => (
              <ellipse
                key={index}
                cx={cx}
                cy={cy}
                rx={13 - index * 0.8}
                ry={4.4 - index * 0.25}
                fill={tone.leaf}
                stroke={tone.leafEdge}
                strokeWidth="0.7"
                transform={`rotate(${rot} ${cx} ${cy})`}
              />
            ))}
          </g>
        ))}
      </svg>

      {rank === 1 ? (
        <svg
          className="absolute"
          viewBox="0 0 72 50"
          fill="none"
          style={{ width: '2.9cqw', height: '2cqw', top: '-0.55cqw' }}
          aria-hidden
        >
          <defs>{CROWN_GRADIENT}</defs>
          <CrownPath />
        </svg>
      ) : null}

      <span
        className="absolute rounded-full"
        style={{
          inset: '1.35cqw',
          background: tone.face,
          boxShadow: `0 0 0 0.2cqw ${tone.ring}, inset 0 0 0 0.24cqw rgba(255,255,255,0.28)`,
        }}
      />
      <span
        className="lb-optical-center relative font-extrabold tabular-nums"
        style={{
          fontSize: 'max(8px, 2.05cqw)',
          lineHeight: 1,
          color: tone.digit,
          textShadow: rank > 3 ? '0 0.1cqw 0.26cqw rgba(0,0,0,0.5)' : 'none',
        }}
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
        paddingLeft: '0.3cqw',
        paddingRight: '2.9cqw',
        gap: '0.7cqw',
        filter: champion
          ? 'drop-shadow(0 0.3cqw 0.85cqw rgba(236,207,114,0.35))'
          : 'drop-shadow(0 0.26cqw 0.6cqw rgba(2,8,24,0.55))',
      }}
    >
      {/* thanh nền: viền mảnh, đầu trái bo tròn, đầu phải vát nhọn */}
      <span className="absolute inset-0" style={{ clipPath: ROW_CLIP }} aria-hidden>
        <span
          className="absolute inset-0 rounded-l-full"
          style={{ background: champion ? ROW_EDGE_GOLD : ROW_EDGE_BLUE }}
        />
        <span
          className="absolute rounded-l-full"
          style={{ inset: '0.14cqw', background: champion ? ROW_GOLD : ROW_NAVY }}
        />
        <span
          className="absolute rounded-l-full"
          style={{
            inset: '0.14cqw',
            background: champion
              ? 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 46%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0) 44%)',
          }}
        />
      </span>

      <RankMedal rank={rank} />

      {/* avatar cao hơn thanh nền nên nhô lên trên và xuống dưới, như ảnh mẫu */}
      <span
        className="relative z-[2] flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold"
        style={{
          width: '5.8cqw',
          height: '5.8cqw',
          fontSize: 'max(6px, 1.7cqw)',
          background: '#0d2a5c',
          color: '#fff',
          boxShadow: '0 0 0 0.24cqw #e0bd5e, 0 0.24cqw 0.55cqw rgba(2,8,24,0.55)',
        }}
      >
        {entry.avatarUrl ? (
          <img className="h-full w-full object-cover" src={entry.avatarUrl} alt="" />
        ) : (
          getInitials(entry.name)
        )}
      </span>

      <span
        className="relative z-[2] min-w-0 flex-1 truncate font-semibold"
        style={{
          fontSize: 'max(7px, 1.85cqw)',
          lineHeight: 1.2,
          marginLeft: '0.5cqw',
          color: '#ffffff',
          textShadow: champion
            ? '0 0.12cqw 0.32cqw rgba(60,42,4,0.75)'
            : '0 0.12cqw 0.3cqw rgba(0,0,0,0.5)',
        }}
      >
        {entry.name}
      </span>

      <span
        className="lb-optical-center relative z-[2] shrink-0 text-center font-extrabold tabular-nums"
        style={{
          width: SCORE_BOX,
          fontSize: 'max(8px, 2.2cqw)',
          lineHeight: 1,
          color: champion ? '#fff6da' : '#f0cd76',
          textShadow: '0 0.12cqw 0.3cqw rgba(0,0,0,0.45)',
        }}
      >
        {formatPoints(entry.points)}
      </span>
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
        <CornerBands />

        <div
          className="relative flex h-full min-h-0 flex-col"
          style={{ padding: '1.5cqw 4.3cqw 6.2cqw', gap: '1.5cqw' }}
        >
          {/* ---------------------------------------------------------- tiêu đề */}
          <div className="flex shrink-0 flex-col items-center">
            <div className="flex items-center justify-center" style={{ gap: '0.8cqw' }}>
              <CrownWreath className="shrink-0" style={{ width: '9cqw', height: '8.2cqw' }} />
              <span
                className="whitespace-nowrap bg-clip-text font-black text-transparent"
                style={{
                  fontSize: 'max(12px, 3.9cqw)',
                  letterSpacing: '0.012em',
                  lineHeight: 1.16,
                  backgroundImage:
                    'linear-gradient(180deg,#fffdf2 0%,#fdeaa6 22%,#f2cf5e 46%,#dca928 68%,#f7e3a2 86%,#c8901a 100%)',
                  filter: 'drop-shadow(0 0.22cqw 0.4cqw rgba(0,0,0,0.5))',
                }}
              >
                {title}
              </span>
            </div>

            {/* dải tháng: gạch vàng hai bên + bảng nhỏ ở giữa */}
            <span
              className="flex items-center justify-center"
              style={{ marginTop: '0.6cqw', gap: '0.9cqw' }}
            >
              <span style={{ width: '7cqw', height: '0.16cqw', background: ROW_EDGE_GOLD }} />
              <span
                className="relative flex items-center justify-center"
                style={{ minWidth: '20cqw', height: '3.1cqw' }}
              >
                <span
                  className="absolute inset-0"
                  style={{ clipPath: MONTH_CLIP, background: ROW_EDGE_GOLD }}
                />
                <span
                  className="absolute"
                  style={{
                    inset: '0.14cqw',
                    clipPath: MONTH_CLIP,
                    background: 'linear-gradient(180deg,#123163 0%,#0b2149 55%,#071633 100%)',
                  }}
                />
                <span
                  className="lb-optical-center relative whitespace-nowrap font-bold uppercase"
                  style={{
                    fontSize: 'max(7px, 1.72cqw)',
                    letterSpacing: '0.06em',
                    padding: '0 2cqw',
                    lineHeight: 1,
                    color: '#fdf6e0',
                  }}
                >
                  {monthText}
                </span>
              </span>
              <span style={{ width: '7cqw', height: '0.16cqw', background: ROW_EDGE_GOLD }} />
            </span>
          </div>

          {/* ----------------------------------------------------- hai cột 5 dòng */}
          <div
            className="grid min-h-0 flex-1 grid-cols-2 grid-rows-1"
            style={{ columnGap: '2.2cqw' }}
          >
            <ul className="flex h-full min-h-0 min-w-0 flex-col" style={{ gap: '2.05cqw' }}>
              {left.map((entry, index) => (
                <RankRow key={entry.name} entry={entry} rank={index + 1} />
              ))}
            </ul>
            <ul className="flex h-full min-h-0 min-w-0 flex-col" style={{ gap: '2.05cqw' }}>
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
