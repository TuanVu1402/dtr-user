import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Đưa trang về đầu mỗi khi chuyển route, tránh việc trang mới giữ nguyên
// vị trí cuộn của trang trước. Khi bấm back/forward thì để trình duyệt tự khôi phục.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, navigationType])

  return null
}
