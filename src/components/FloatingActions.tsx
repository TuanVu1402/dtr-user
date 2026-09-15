import { useEffect, useState } from 'react'
import { ArrowUpIcon } from './icons'
import './FloatingActions.css'

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
    <div className="floating-actions">
      <a
        className="floating-btn floating-zalo"
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Chat với chúng tôi qua Zalo"
        title="Chat qua Zalo"
      >
        <span className="floating-zalo-bubble">Zalo</span>
      </a>

      {showTop && (
        <button
          type="button"
          className="floating-btn floating-top"
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
        >
          <ArrowUpIcon color="#0d1f3d" />
        </button>
      )}
    </div>
  )
}
