import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { readLocation, startCameraStream, type GeoPoint } from '@/utils/qrCheckin'

export type { GeoPoint }

type QrScannerModalProps = {
  onDetected: (rawValue: string, geo?: GeoPoint) => void
  onCancel: () => void
  heading?: string
  requireLocation?: boolean
  cameraPromise?: Promise<MediaStream>
  geoPromise?: Promise<GeoPoint>
}

export default function QrScannerModal({
  onDetected,
  onCancel,
  heading = 'Quét mã QR',
  requireLocation = true,
  cameraPromise,
  geoPromise,
}: QrScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const detectedRef = useRef(false)
  const geoRef = useRef<GeoPoint | null>(null)
  const pendingQrRef = useRef<string | null>(null)
  const scanningRef = useRef(false)
  const cancelledRef = useRef(false)

  const [error, setError] = useState<string | null>(null)
  const [geo, setGeo] = useState<GeoPoint | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(requireLocation)

  function stopScanLoop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    scanningRef.current = false
  }

  function detachVideo() {
    stopScanLoop()
    const video = videoRef.current
    if (video) video.srcObject = null
  }

  function finish(rawValue: string, point?: GeoPoint) {
    if (detectedRef.current) return
    if (requireLocation && !point) {
      pendingQrRef.current = rawValue
      setGeoError('Hãy bật vị trí (GPS) trên thiết bị để hoàn tất điểm danh.')
      return
    }
    detectedRef.current = true
    stopScanLoop()
    onDetected(rawValue, point)
  }

  function tick() {
    const video = videoRef.current
    if (!video || detectedRef.current || cancelledRef.current || !scanningRef.current) return
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    if (video.readyState >= video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = jsQR(imageData.data, imageData.width, imageData.height)
      if (result?.data) {
        finish(result.data, geoRef.current ?? undefined)
        if (detectedRef.current) return
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  async function attachStream(stream: MediaStream) {
    if (cancelledRef.current) return
    stopScanLoop()
    streamRef.current = stream
    setError(null)
    const video = videoRef.current
    if (!video) {
      setError('Không thể mở camera. Hãy cấp quyền camera cho trình duyệt.')
      return
    }
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.controls = false
    video.srcObject = stream
    await new Promise<void>((resolve) => {
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        video.removeEventListener('loadedmetadata', done)
        resolve()
      }
      video.addEventListener('loadedmetadata', done)
      if (video.readyState >= 1) done()
      window.setTimeout(done, 1200)
    })
    try {
      await video.play()
    } catch {
      // iOS may reject the first play() then continue via autoplay.
    }
    if (cancelledRef.current) return
    scanningRef.current = true
    tick()
  }

  async function applyCamera(promise: Promise<MediaStream>) {
    try {
      let stream = await promise
      const live = stream.getTracks().some((track) => track.readyState === 'live')
      if (!live) {
        stream = await startCameraStream()
      }
      if (cancelledRef.current) return
      await attachStream(stream)
    } catch (err) {
      if (!cancelledRef.current) {
        const message = err instanceof Error ? err.message : ''
        setError(
          message || 'Không thể mở camera. Hãy cấp quyền camera cho trình duyệt rồi bấm Bật camera lại.',
        )
      }
    }
  }

  function requestGeo(promise?: Promise<GeoPoint>) {
    setGeoLoading(true)
    setGeoError(null)
    const next = promise ?? readLocation()
    next
      .then((point) => {
        geoRef.current = point
        setGeo(point)
        setGeoLoading(false)
        if (pendingQrRef.current) finish(pendingQrRef.current, point)
      })
      .catch((err: Error) => {
        setGeoLoading(false)
        setGeoError(err.message)
      })
  }

  useEffect(() => {
    cancelledRef.current = false
    void applyCamera(cameraPromise ?? startCameraStream())
    requestGeo(geoPromise)
    return () => {
      cancelledRef.current = true
      detachVideo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleRetryCamera() {
    setError(null)
    await applyCamera(startCameraStream())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-[360px] flex-col gap-4 rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)] uppercase">Điểm danh</div>
            <div className="mt-1 text-base font-semibold text-[var(--text-primary)]">{heading}</div>
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

        <div
          className={`rounded-lg border px-3 py-2 text-xs ${
            geo
              ? 'border-[var(--positive)]/30 bg-[var(--positive)]/10 text-[var(--positive)]'
              : geoError
                ? 'border-[var(--negative)]/30 bg-[var(--negative)]/10 text-[var(--negative)]'
                : 'border-[var(--hairline)] bg-[var(--bg-2)] text-[var(--text-secondary)]'
          }`}
        >
          {geoLoading && 'Đang bật vị trí GPS...'}
          {!geoLoading && geo && `Đã lấy vị trí: ${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}`}
          {!geoLoading && geoError && (
            <div className="flex flex-col gap-2">
              <span>{geoError}</span>
              <button
                type="button"
                className="cursor-pointer self-start font-semibold underline"
                onClick={() => requestGeo()}
              >
                Bật vị trí lại
              </button>
            </div>
          )}
        </div>

        <div className={error ? 'hidden' : 'relative aspect-square w-full overflow-hidden rounded-lg bg-black'}>
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay
          />
          <div className="pointer-events-none absolute inset-[14%] rounded-lg border-2 border-[var(--gold)] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
        </div>

        {error ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-[var(--negative)]/[0.3] bg-[var(--negative)]/[0.1] p-4 text-center text-sm text-[var(--negative)]">
              {error}
              {!window.isSecureContext ? (
                <a
                  className="mt-2 block font-semibold text-[var(--gold-bright)] underline"
                  href={`https://${window.location.host}/`}
                >
                  Mở https://{window.location.host}
                </a>
              ) : null}
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-[var(--gold)] px-4 py-2.5 text-sm font-medium text-[var(--on-gold)]"
              onClick={() => void handleRetryCamera()}
            >
              Bật camera lại
            </button>
          </div>
        ) : null}

        <p className="text-center text-xs text-[var(--text-muted)]">
          {error
            ? 'Hãy cấp quyền camera rồi bấm Bật camera lại.'
            : 'Bật vị trí GPS rồi đưa mã QR vào giữa khung hình.'}
        </p>

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
