export type GeoPoint = {
  lat: number
  lng: number
}

function isPhone() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function httpsLanUrl() {
  return `https://${window.location.host}/`
}

function insecureContextMessage(kind: 'camera' | 'gps') {
  const host = window.location.hostname
  const isLan = host !== 'localhost' && host !== '127.0.0.1'
  if (kind === 'gps') {
    return isLan
      ? `Điện thoại chặn GPS trên HTTP. Hãy mở ${httpsLanUrl()} (gõ https://, không phải http://).`
      : 'Trên điện thoại cần HTTPS hoặc localhost để bật GPS.'
  }
  return isLan
    ? `Điện thoại chặn camera trên HTTP. Hãy mở ${httpsLanUrl()} (gõ https://, không phải http://).`
    : 'Điện thoại chặn camera trên HTTP. Hãy mở bằng HTTPS hoặc localhost.'
}

function geoErrorMessage(code?: number) {
  if (!window.isSecureContext) {
    return insecureContextMessage('gps')
  }
  if (code === 1) {
    return 'Hãy cho phép vị trí (GPS) trên trình duyệt để điểm danh.'
  }
  if (code === 3) {
    return 'Không lấy được GPS kịp. Hãy ra chỗ thoáng rồi bật vị trí lại.'
  }
  return 'Hãy bật vị trí (GPS) trên thiết bị để điểm danh.'
}

function getPosition(options: PositionOptions): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Thiết bị không hỗ trợ vị trí.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => reject(new Error(geoErrorMessage(err.code))),
      options,
    )
  })
}

function watchOnce(options: PositionOptions): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Thiết bị không hỗ trợ vị trí.'))
      return
    }
    const timeoutMs = options.timeout ?? 20_000
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        navigator.geolocation.clearWatch(watchId)
        window.clearTimeout(timer)
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        navigator.geolocation.clearWatch(watchId)
        window.clearTimeout(timer)
        reject(new Error(geoErrorMessage(err.code)))
      },
      options,
    )
    const timer = window.setTimeout(() => {
      navigator.geolocation.clearWatch(watchId)
      reject(new Error(geoErrorMessage(3)))
    }, timeoutMs)
  })
}

export function readLocation(): Promise<GeoPoint> {
  const highAccuracy: PositionOptions = {
    enableHighAccuracy: true,
    timeout: isPhone() ? 12_000 : 8_000,
    maximumAge: 15_000,
  }
  const lowAccuracy: PositionOptions = {
    enableHighAccuracy: false,
    timeout: 15_000,
    maximumAge: 60_000,
  }
  const watchOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 20_000,
    maximumAge: 0,
  }

  return getPosition(highAccuracy)
    .catch(() => getPosition(lowAccuracy))
    .catch(() => watchOnce(watchOptions))
}

export async function startCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error(
      window.isSecureContext ? 'Trình duyệt không hỗ trợ camera.' : insecureContextMessage('camera'),
    )
  }

  const attempts: MediaStreamConstraints[] = [
    { audio: false, video: { facingMode: { ideal: 'environment' } } },
    { audio: false, video: { facingMode: 'environment' } },
    { audio: false, video: { facingMode: 'user' } },
    { audio: false, video: true },
  ]

  let lastError: unknown
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      lastError = err
    }
  }

  const name = lastError instanceof DOMException ? lastError.name : ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    throw new Error('Chưa cấp quyền camera. Hãy cho phép Camera rồi bấm Bật camera lại.')
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    throw new Error('Không tìm thấy camera trên thiết bị.')
  }
  if (name === 'NotReadableError') {
    throw new Error('Camera đang bị ứng dụng khác dùng. Hãy đóng app camera rồi thử lại.')
  }
  if (!window.isSecureContext) {
    throw new Error(insecureContextMessage('camera'))
  }
  throw new Error('Không thể mở camera. Hãy cấp quyền camera cho trình duyệt.')
}
