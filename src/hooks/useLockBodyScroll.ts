import { useEffect } from 'react'

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement } = document
    const scrollY = window.scrollY
    // Bề rộng scrollbar dọc hiện có (0 trên mobile / scrollbar overlay).
    // Phải đo TRƯỚC khi ẩn overflow, nếu không clientWidth sẽ đã nới ra bằng innerWidth.
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      htmlOverflow: documentElement.style.overflow,
    }

    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    // Bù lại đúng phần rộng mà scrollbar vừa nhường ra, nếu không toàn bộ layout
    // desktop bị giãn rộng thêm vài chục px và lệch ngay khi mở modal.
    if (scrollBarWidth > 0) {
      const currentPaddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${currentPaddingRight + scrollBarWidth}px`
    }

    return () => {
      body.style.overflow = previous.overflow
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.left = previous.left
      body.style.right = previous.right
      body.style.width = previous.width
      body.style.paddingRight = previous.paddingRight
      documentElement.style.overflow = previous.htmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
