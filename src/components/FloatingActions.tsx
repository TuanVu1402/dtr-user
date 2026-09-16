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
    <div className="fixed right-[22px] bottom-[26px] z-[60] flex flex-col items-center gap-3.5 max-[640px]:right-3 max-[640px]:bottom-3">
      <a
        className="animate-zalo-pulse relative flex h-[52px] w-[52px] items-center justify-center rounded-xl border-none bg-[#0068ff] no-underline shadow-[0_10px_24px_rgba(0,0,0,0.35)] max-[640px]:h-11 max-[640px]:w-11"
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Chat với chúng tôi qua Zalo"
        title="Chat qua Zalo"
      >
        <span className="font-['Open_Sans',sans-serif] text-[13px] font-extrabold tracking-[0.2px] text-white italic max-[640px]:text-[11px]">
          Zalo
        </span>
      </a>

      {/* Luôn giữ nút trong DOM và chỉ ẩn/hiện bằng opacity — nếu unmount, cụm nút
          (neo theo đáy màn hình) sẽ co lại và làm nút Zalo bị nhảy vị trí khi cuộn. */}
      <button
        type="button"
        className={`flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border-none bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-200 max-[640px]:h-11 max-[640px]:w-11 ${
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
