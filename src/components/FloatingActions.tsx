import { useEffect, useState } from 'react'
import { ArrowUpIcon } from './icons'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Cụm nút nổi góc dưới bên phải, hiển thị xuyên suốt khi cuộn trang:
// nút chat Zalo + nút cuộn lên đầu trang (chỉ hiện khi đã cuộn xuống).
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
    <div className="fixed right-[22px] bottom-[26px] z-[60] flex flex-col items-center gap-3.5 max-[640px]:right-3.5 max-[640px]:bottom-4">
      <a
        className="animate-zalo-pulse relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-none bg-[#0068ff] no-underline shadow-[0_10px_24px_rgba(0,0,0,0.35)] max-[640px]:h-[46px] max-[640px]:w-[46px]"
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Chat với chúng tôi qua Zalo"
        title="Chat qua Zalo"
      >
        <span className="font-['Open_Sans',sans-serif] text-[13px] font-extrabold tracking-[0.2px] text-white italic">
          Zalo
        </span>
      </a>

      {showTop && (
        <button
          type="button"
          className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border-none bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] shadow-[0_10px_24px_rgba(0,0,0,0.35)] max-[640px]:h-[46px] max-[640px]:w-[46px]"
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
        >
          <ArrowUpIcon color="#ffffff" />
        </button>
      )}
    </div>
  )
}
