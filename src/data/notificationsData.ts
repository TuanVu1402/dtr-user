export type NotificationKind = 'success' | 'warning' | 'info'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  description: string
  time: string
  read: boolean
}

/** Thông báo mẫu cho chuông thông báo ở Trang chủ User — dữ liệu minh hoạ, chưa nối API thật. */
export const initialNotifications: AppNotification[] = [
  {
    id: 'N1',
    kind: 'success',
    title: 'Minh chứng đã được duyệt',
    description: 'Booking #BK-3391 — Dự án Lumi Hà Nội vừa được duyệt, +4 điểm DTR.',
    time: '2 giờ trước',
    read: false,
  },
  {
    id: 'N2',
    kind: 'success',
    title: 'Chúc mừng thăng hạng!',
    description: 'Bạn vừa đạt Hạng Kim Cương. Cố thêm 32 điểm nữa để lên Hạng Vương Miện.',
    time: '5 giờ trước',
    read: false,
  },
  {
    id: 'N3',
    kind: 'warning',
    title: 'Minh chứng bị từ chối',
    description: 'Clip DTLO "Clip review dự án Sun Grand City" bị từ chối — vui lòng nộp lại minh chứng rõ hơn.',
    time: '1 ngày trước',
    read: false,
  },
  {
    id: 'N4',
    kind: 'info',
    title: 'Sắp diễn ra: Training Quý 3',
    description: 'Buổi Training / Kick off Quý 3 diễn ra 20/09 — nhớ điểm danh QR để nhận điểm.',
    time: '2 ngày trước',
    read: true,
  },
  {
    id: 'N5',
    kind: 'success',
    title: 'Minh chứng đã được duyệt',
    description: 'Check-in sự kiện Vinhomes Ocean Park vừa được duyệt, +1 điểm DTR.',
    time: '3 ngày trước',
    read: true,
  },
]
