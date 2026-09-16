import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import '../styles/shared.css'
import './QrScannerModal.css'

type QrScannerModalProps = {
  onDetected: (rawValue: string) => void
  onCancel: () => void
}

/** Mở camera thiết bị và quét mã QR liên tục bằng jsQR — dùng cho nút "Quét QR tự động"
 * ở hạng mục Training/Kick off, thay vì phải quét bằng app camera ngoài rồi mở lại link. */
export default function QrScannerModal({ onDetected, onCancel }: QrScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const detectedRef = useRef(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let rafId: number | null = null
    let cancelled = false
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()
        tick()
      } catch {
        if (!cancelled) {
          setError('Không thể mở camera. Hãy cấp quyền camera cho trình duyệt rồi thử lại.')
        }
      }
    }

    function tick() {
      const video = videoRef.current
      if (!video || !ctx || detectedRef.current) return

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const result = jsQR(imageData.data, imageData.width, imageData.height)
        if (result?.data) {
          detectedRef.current = true
          onDetected(result.data)
          return
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    start()

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      stream?.getTracks().forEach((t) => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="qr-scanner-card" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <div>
            <div className="form-eyebrow">Điểm danh Training / Kick off</div>
            <div className="form-title">Quét mã QR tự động</div>
          </div>
          <button type="button" className="form-close" onClick={onCancel} aria-label="Đóng">
            ×
          </button>
        </div>

        {error ? (
          <div className="qr-scanner-error">{error}</div>
        ) : (
          <div className="qr-scanner-video-wrap">
            <video ref={videoRef} className="qr-scanner-video" muted playsInline />
            <div className="qr-scanner-frame" />
          </div>
        )}

        <p className="qr-scanner-hint">
          {error ? 'Bạn có thể đóng cửa sổ này và thử lại.' : 'Đưa mã QR của buổi Training vào giữa khung hình.'}
        </p>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
