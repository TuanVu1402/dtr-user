import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

type QrScannerModalProps = {
  onDetected: (rawValue: string) => void
  onCancel: () => void
}

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
          setError('Không thể mở camera. Hãy cấp quyền camera cho trình duyệt.')
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-[360px] flex-col gap-4 rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)] uppercase">Điểm danh Training</div>
            <div className="mt-1 text-base font-semibold text-[var(--text-primary)]">Quét mã QR</div>
          </div>
          <button
            type="button"
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-[var(--hairline)] bg-transparent text-xl leading-none text-[var(--text-secondary)]"
            onClick={onCancel}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Camera / Error */}
        {error ? (
          <div className="rounded-lg border border-[var(--negative)]/[0.3] bg-[var(--negative)]/[0.1] p-4 text-center text-sm text-[var(--negative)]">
            {error}
          </div>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <div className="pointer-events-none absolute inset-[14%] rounded-lg border-2 border-[var(--gold)] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
          </div>
        )}

        <p className="text-center text-xs text-[var(--text-muted)]">
          {error ? 'Hãy đóng cửa sổ này và thử lại.' : 'Đưa mã QR vào giữa khung hình.'}
        </p>

        {/* Cancel Button */}
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-[var(--hairline)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
          onClick={onCancel}
        >
          Hủy
        </button>
      </div>
    </div>
  )
}
