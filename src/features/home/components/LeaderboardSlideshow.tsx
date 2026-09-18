import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CrownIcon } from '@/components'
import { formatPoints } from '@/utils/format'
import { useLanguage } from '@/context/LanguageContext'
import type { LeaderboardEntry } from './LeaderboardSection'
import { getInitials } from './LeaderboardSection'

const SLIDE_COUNT = 2
const SLIDE_MS = 6000

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

function GoldCorners() {
  const corner =
    'pointer-events-none absolute h-7 w-7 text-[#f5c542] md:h-[4.25rem] md:w-[4.25rem] xl:h-20 xl:w-20'
  return (
    <>
      <svg className={`${corner} top-1 left-1 md:top-2 md:left-2`} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M6 50V12c0-5 3-7 8-7h38" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M10 20c10-3 20-5 34-5" stroke="currentColor" strokeWidth="1.3" opacity="0.75" />
        <path d="M8 28c8-2 18-3 28-3" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
        <circle cx="14" cy="12" r="2.4" fill="currentColor" />
      </svg>
      <svg className={`${corner} top-1 right-1 rotate-90 md:top-2 md:right-2`} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M6 50V12c0-5 3-7 8-7h38" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M10 20c10-3 20-5 34-5" stroke="currentColor" strokeWidth="1.3" opacity="0.75" />
        <circle cx="14" cy="12" r="2.4" fill="currentColor" />
      </svg>
      <svg className={`${corner} bottom-1 left-1 -rotate-90 md:bottom-2 md:left-2`} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M6 50V12c0-5 3-7 8-7h38" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="14" cy="12" r="2.4" fill="currentColor" />
      </svg>
      <svg className={`${corner} right-1 bottom-1 rotate-180 md:right-2 md:bottom-2`} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M6 50V12c0-5 3-7 8-7h38" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="14" cy="12" r="2.4" fill="currentColor" />
      </svg>
    </>
  )
}

function CityGlow() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full text-[#f5c542] md:h-24 xl:h-28"
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="city-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5c542" stopOpacity="0.42" />
          <stop offset="70%" stopColor="#f5c542" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f5c542" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#city-fade)"
        d="M0 120V82h22v-26h16v26h20V52h12v16h18V38h14v44h22V62h16v18h28V46h18v36h24V66h14v16h34V42h20v40h26V54h16v28h38V48h22v34h30V72h14v48H0Z"
      />
    </svg>
  )
}

function GoldRays() {
  return (
    <svg className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full md:h-36 xl:h-40" viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ray-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5c542" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f5c542" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#ray-fade)" points="400,0 430,160 370,160" />
      <polygon fill="url(#ray-fade)" points="400,0 490,160 450,160" opacity="0.7" />
      <polygon fill="url(#ray-fade)" points="400,0 350,160 310,160" opacity="0.7" />
      <polygon fill="url(#ray-fade)" points="400,0 560,160 530,160" opacity="0.4" />
      <polygon fill="url(#ray-fade)" points="400,0 270,160 240,160" opacity="0.4" />
    </svg>
  )
}

function HonorCrest({ className }: { className: string }) {
  const leftLeaves = [
    [38, 108, -62],
    [28, 94, -48],
    [22, 78, -32],
    [20, 62, -14],
    [24, 46, 8],
    [32, 32, 28],
    [44, 22, 48],
  ] as const
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="honor-gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff6c8" />
            <stop offset="42%" stopColor="#f5c542" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
        {leftLeaves.map(([cx, cy, rot], index) => (
          <g key={`l${index}`}>
            <ellipse
              cx={cx}
              cy={cy}
              rx="11"
              ry="5.2"
              fill="url(#honor-gold)"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
            <ellipse
              cx={120 - cx}
              cy={cy}
              rx="11"
              ry="5.2"
              fill="url(#honor-gold)"
              transform={`rotate(${-rot} ${120 - cx} ${cy})`}
            />
          </g>
        ))}
        <path
          d="M44 34 60 10l16 24 10-8-6 28H40l-6-28 10 8Z"
          fill="url(#honor-gold)"
          stroke="#7a4b00"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <rect x="42" y="52" width="36" height="7" rx="1.4" fill="url(#honor-gold)" stroke="#7a4b00" strokeWidth="0.8" />
        <circle cx="44" cy="32" r="2.4" fill="#fff6c8" />
        <circle cx="60" cy="14" r="2.4" fill="#fff6c8" />
        <circle cx="76" cy="32" r="2.4" fill="#fff6c8" />
      </svg>
    </span>
  )
}

function rankBadgeClass(rank: number) {
  if (rank === 1) {
    return 'bg-[linear-gradient(180deg,#fff3b0,#f5c542_50%,#c49212)] text-[#5b3b00] shadow-[0_0_0_2px_#f8e38a,0_0_12px_rgba(245,197,66,0.45)]'
  }
  if (rank === 2) {
    return 'bg-[linear-gradient(180deg,#f4f7fb,#c5d0de_45%,#7f8ea3)] text-[#1d2a3c] ring-2 ring-[#e8eef6]/90'
  }
  if (rank === 3) {
    return 'bg-[linear-gradient(180deg,#f6d0a4,#c47a3a_55%,#8a4b18)] text-white ring-2 ring-[#f3c38a]/70'
  }
  return 'bg-[#0b1f44] text-[#f5c542] ring-2 ring-[#d4a017]/80'
}

function RankRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const champion = rank === 1
  return (
    <li
      className={`relative flex min-h-0 flex-1 items-center gap-1 rounded-full md:min-h-[2.75rem] md:gap-2.5 xl:min-h-[3.15rem] xl:gap-3 ${
        champion
          ? 'bg-[linear-gradient(90deg,#c9a024_0%,#f6e27a_18%,#fff6c2_50%,#f6e27a_82%,#c9a024_100%)] px-1 py-0 shadow-[0_6px_16px_rgba(245,197,66,0.32)] md:px-2.5 md:py-1 xl:px-3.5 xl:py-1.5'
          : 'bg-[#071a38]/90 px-1 py-0 ring-1 ring-[#1e4a86]/75 md:px-2.5 md:py-1 xl:px-3.5 xl:py-1.5'
      }`}
    >
      <span
        className={`relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-extrabold md:h-9 md:w-9 md:text-sm xl:h-12 xl:w-12 xl:text-lg ${rankBadgeClass(rank)}`}
      >
        {champion ? (
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 md:-top-2.5">
            <CrownIcon size={9} color="#f5c542" filled />
          </span>
        ) : null}
        {rank}
      </span>
      <div
        className={`relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full text-[6px] font-semibold md:h-10 md:w-10 md:text-xs xl:h-14 xl:w-14 xl:text-sm ${
          champion ? 'bg-[#1a2f5a] text-white ring-2 ring-[#fff4c2]' : 'bg-white/10 text-white ring-1 ring-white/40'
        }`}
      >
        {entry.avatarUrl ? (
          <img className="h-full w-full object-cover" src={entry.avatarUrl} alt="" />
        ) : (
          getInitials(entry.name)
        )}
      </div>
      <span
        className={`relative z-[1] min-w-0 flex-1 truncate text-[9px] leading-none font-semibold md:text-[15px] md:leading-normal xl:text-[20px] ${
          champion ? 'text-[#1a2744]' : 'text-white'
        }`}
      >
        {entry.name}
      </span>
      <span
        className={`relative z-[1] w-4 shrink-0 text-right text-[9px] leading-none font-extrabold tabular-nums md:w-8 md:text-base md:leading-normal xl:w-10 xl:text-[22px] ${
          champion ? 'text-[#7a4b00]' : 'text-[#f5c542]'
        }`}
      >
        {formatPoints(entry.points)}
      </span>
    </li>
  )
}

export default function LeaderboardSlideshow({ ranking, monthKey }: LeaderboardSlideshowProps) {
  const navigate = useNavigate()
  const { locale, t } = useLanguage()
  const left = ranking.slice(0, 5)
  const right = ranking.slice(5, 10)
  const monthText = formatBoardMonth(monthKey, locale)
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
        className={`absolute inset-0 cursor-pointer overflow-hidden bg-[radial-gradient(ellipse_at_50%_-10%,rgba(245,197,66,0.34),transparent_46%),linear-gradient(180deg,#071833_0%,#12356c_48%,#061427_100%)] px-2 pt-1.5 pr-2.5 pb-5 text-left transition-opacity duration-500 md:px-8 md:pt-5 md:pr-8 md:pb-7 lg:px-10 lg:pt-6 xl:px-12 xl:pt-7 xl:pb-9 ${
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
        <GoldRays />
        <GoldCorners />
        <CityGlow />

        <div className="relative flex h-full min-h-0 flex-col gap-1 md:gap-3 xl:gap-4">
          <div className="flex shrink-0 flex-col items-center -mt-1 pt-0 md:mt-0 md:pt-1">
            <div className="flex items-center justify-center gap-1 md:gap-3 xl:gap-4">
              <HonorCrest className="h-7 w-7 md:h-16 md:w-16 xl:h-[5.25rem] xl:w-[5.25rem]" />
              <p
                className="overflow-visible bg-[linear-gradient(180deg,#fff8d6_0%,#f5c542_48%,#c49212_100%)] bg-clip-text py-0.5 text-center text-[11px] leading-[1.25] font-extrabold tracking-[0.04em] text-transparent md:text-[1.85rem] md:tracking-[0.06em] xl:text-[2.55rem] xl:tracking-[0.08em]"
                style={{ filter: 'drop-shadow(0 0 14px rgba(245,197,66,0.35))' }}
              >
                {t('board.title')}
              </p>
            </div>
            <div
              className="mt-px -translate-y-0.5 bg-[linear-gradient(180deg,#ffe9a0,#f5c542_42%,#c49212)] px-3 py-px text-[7px] font-extrabold tracking-[0.16em] text-[#5b3b00] uppercase shadow-[0_3px_10px_rgba(245,197,66,0.4)] md:mt-2.5 md:translate-y-0 md:px-8 md:py-1 md:text-xs xl:mt-3 xl:px-9 xl:text-sm"
              style={{ clipPath: 'polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)' }}
            >
              {monthText}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-1 gap-x-1.5 gap-y-0 md:gap-x-8 lg:gap-x-12 xl:gap-x-14">
            <ul className="flex h-full min-h-0 min-w-0 flex-col gap-0.5 md:gap-2 xl:gap-2.5">
              {left.map((entry, index) => (
                <RankRow key={entry.name} entry={entry} rank={index + 1} />
              ))}
            </ul>
            <ul className="flex h-full min-h-0 min-w-0 flex-col gap-0.5 md:gap-2 xl:gap-2.5">
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
