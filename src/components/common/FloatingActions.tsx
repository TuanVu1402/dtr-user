import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '../icons'

import zaloLogo from '@/assets/logo-zalo.webp'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed right-5 bottom-5 z-[60] flex flex-col items-center gap-3">
      {/* Zalo Button */}
      <a
        className="relative flex h-12 w-12 items-center justify-center rounded-[13px] border-none bg-transparent no-underline shadow-[0_8px_20px_rgba(0,104,255,0.28)] animate-zalo-pulse"
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Chat với chúng tôi qua Zalo"
        title="Chat qua Zalo"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[13px] bg-[#0068ff]/35 animate-zalo-ring" />
        <span className="pointer-events-none absolute inset-0 rounded-[13px] bg-[#0068ff]/25 animate-zalo-ring [animation-delay:0.7s]" />
        <span className="relative z-10 block h-full w-full origin-center overflow-hidden rounded-[13px] animate-zalo-blink">
          <img
            src={zaloLogo}
            alt="Zalo"
            className="h-full w-full object-cover"
          />
        </span>
      </a>

      {/* Scroll to Top */}
      <button
        type="button"
        className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--gold)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200 ${
          showTop ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0'
        }`}
        onClick={scrollToTop}
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        aria-label="Lên đầu trang"
      >
        <ArrowUpIcon color="#ffffff" />
      </button>
    </div>
  )
}
