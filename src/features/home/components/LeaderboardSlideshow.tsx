import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CrownIcon } from '@/components'
import { formatPoints } from '@/utils/format'
import { useLanguage } from '@/context/LanguageContext'
import type { LeaderboardEntry } from './LeaderboardSection'
import { getInitials } from './LeaderboardSection'
const SLIDE_COUNT = 2
const SLIDE_MS = 6000

const rankBadge: Record<number, string> = {
  1: 'bg-[#f5c542] text-[#5b3b00]',
  2: 'bg-[#cfd6e4] text-[#334155]',
  3: 'bg-[#e8b07a] text-[#7c3a12]',
}

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

function RankRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  return (
    <li className="grid h-5 grid-cols-[0.9rem_1.1rem_minmax(0,1fr)_auto] items-center gap-x-1 md:h-auto md:grid-cols-[2rem_2.5rem_minmax(0,1fr)_2.75rem] md:gap-3 xl:grid-cols-[3rem_4rem_minmax(0,1fr)_3rem] xl:gap-4">
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center justify-self-center rounded-full text-[7px] font-bold md:h-8 md:w-8 md:text-sm xl:h-12 xl:w-12 xl:text-lg ${
          rankBadge[rank] ?? 'bg-white/15 text-white'
        }`}
      >
        {rank}
      </span>
      <div className="flex h-[1.125rem] w-[1.125rem] items-center justify-center justify-self-center overflow-hidden rounded-full bg-white/10 text-[6px] font-semibold text-white md:h-10 md:w-10 md:text-xs xl:h-16 xl:w-16 xl:text-sm">
        {entry.avatarUrl ? (
          <img className="h-full w-full object-cover" src={entry.avatarUrl} alt="" />
        ) : (
          getInitials(entry.name)
        )}
      </div>
      <span className="min-w-0 truncate text-[10px] leading-none font-medium text-white md:text-base md:leading-normal xl:text-[22px]">
        {entry.name}
      </span>
      <span className="shrink-0 pl-0.5 text-right text-[10px] leading-none font-semibold tabular-nums text-[#f5c542] md:pl-0 md:text-base md:leading-normal xl:text-[22px]">
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
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_32px_rgba(8,18,40,0.35)] md:aspect-video xl:rounded-3xl"
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
        className={`relative h-full cursor-pointer bg-[linear-gradient(145deg,#071226_0%,#123056_55%,#0b1c34_100%)] px-2.5 py-3 pr-3 pb-7 text-left transition-opacity duration-500 md:absolute md:inset-0 md:px-8 md:py-5 md:pr-8 md:pb-5 lg:px-10 lg:py-6 xl:px-16 xl:py-10 ${
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
        <div className="flex h-full min-h-0 flex-col justify-center xl:justify-evenly">
          <div className="mb-2.5 flex shrink-0 flex-col items-center gap-0.5 px-1 md:mb-4 md:-translate-y-4 md:px-0 lg:-translate-y-5 xl:mb-0 xl:translate-y-0">
            <div className="flex w-full items-center justify-center gap-1 md:w-auto md:gap-2.5 xl:gap-3.5">
              <span className="animate-crown-blink inline-flex shrink-0 md:hidden">
                <CrownIcon size={13} color="#f5c542" filled />
              </span>
              <span className="animate-crown-blink hidden md:inline-flex xl:hidden">
                <CrownIcon size={28} color="#f5c542" filled />
              </span>
              <span className="animate-crown-blink hidden xl:inline-flex">
                <CrownIcon size={40} color="#f5c542" filled />
              </span>
              <p className="text-center text-[11px] leading-5 font-bold tracking-normal text-[#f5c542] whitespace-nowrap md:text-2xl md:leading-normal md:tracking-[0.04em] md:whitespace-normal xl:text-[2.15rem] xl:tracking-[0.06em] xl:whitespace-nowrap">
                {t('board.title')}
                <span className="hidden md:inline"> - {monthText}</span>
              </p>
            </div>
            <p className="text-[10px] leading-4 font-semibold tracking-wide text-[#f5c542] md:hidden">
              {monthText}
            </p>
          </div>

          <div className="grid w-full shrink-0 grid-cols-2 gap-x-1.5 md:gap-x-10 lg:gap-x-14 xl:flex-1 xl:gap-x-24">
            <ul className="flex min-w-0 flex-col gap-1.5 md:gap-3.5 xl:h-full xl:justify-evenly xl:gap-0">
              {left.map((entry, index) => (
                <RankRow key={entry.name} entry={entry} rank={index + 1} />
              ))}
            </ul>
            <ul className="flex min-w-0 flex-col gap-1.5 md:gap-3.5 xl:h-full xl:justify-evenly xl:gap-0">
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
