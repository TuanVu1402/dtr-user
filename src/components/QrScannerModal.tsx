import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--scrim) p-6 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-[420px] flex-col gap-4.5 rounded-[18px] border border-[rgba(37,99,235,0.32)] bg-[linear-gradient(160deg,var(--surface-1),var(--surface-2))] p-7 shadow-[0_30px_60px_var(--shadow-strong)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-[1.4px] text-(--gold-bright) uppercase">
              Điểm danh Training / Kick off
            </div>
            <div className="mt-1.5 font-['Open_Sans',sans-serif] text-lg leading-[1.35] font-bold text-(--text-primary)">
              Quét mã QR tự động
            </div>
          </div>
          <button
            type="button"
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-[rgba(37,99,235,0.3)] bg-transparent text-xl leading-none text-(--gold-bright)"
            onClick={onCancel}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-[rgba(217,122,108,0.4)] bg-[rgba(217,122,108,0.12)] p-6 text-center text-[13.5px] leading-[1.6] text-(--negative)">
            {error}
          </div>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <div className="pointer-events-none absolute inset-[14%] rounded-2xl border-[3px] border-(--gold) shadow-[0_0_0_999px_rgba(0,0,0,0.35)]" />
          </div>
        )}

        <p className="m-0 text-center text-[13px] text-(--text-tertiary)">
          {error ? 'Bạn có thể đóng cửa sổ này và thử lại.' : 'Đưa mã QR của buổi Training vào giữa khung hình.'}
        </p>

        <div className="mt-1 flex justify-end gap-3">
          <button
            type="button"
            className="min-h-11 cursor-pointer rounded-[10px] border border-[rgba(37,99,235,0.3)] bg-transparent px-5 py-[11px] font-['Open_Sans',sans-serif] text-[13.5px] font-bold text-(--text-secondary) transition-[transform,box-shadow,background,border-color] duration-150 hover:border-[rgba(169,127,47,0.5)] hover:bg-[rgba(169,127,47,0.08)]"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
