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
        className="flex h-11 w-11 items-center justify-center rounded-xl border-none no-underline"
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Chat với chúng tôi qua Zalo"
        title="Chat qua Zalo"
      >
        <img src={zaloLogo} alt="Zalo" className="h-11 w-11 object-contain" />
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
