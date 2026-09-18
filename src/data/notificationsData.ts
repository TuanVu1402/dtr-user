export type NotificationKind = 'success' | 'warning' | 'info'

export type AppNotification = {
  id: string
  kind: NotificationKind
  sender: string
  title: string
  description: string
  snippet?: string
  time: string
  read: boolean
}

function initialsColor(kind: NotificationKind) {
  if (kind === 'success') return 'bg-[#dcfce7] text-[#166534]'
  if (kind === 'warning') return 'bg-[#ffedd5] text-[#9a3412]'
  return 'bg-[#dbeafe] text-[#1d4ed8]'
}

export function notificationAvatarClass(kind: NotificationKind) {
  return initialsColor(kind)
}

/** Thông báo mẫu cho hộp thông báo ở Trang chủ User — dữ liệu minh hoạ, chưa nối API thật. */
export const initialNotifications: AppNotification[] = [
  {
    id: 'N1',
    kind: 'success',
    sender: 'ĐTLO',
    title: 'Minh chứng đã được duyệt',
    description: 'Booking #BK-3391 — Dự án Lumi Hà Nội vừa được duyệt, +4 điểm DTR.',
    snippet: 'Booking #BK-3391',
    time: '15:55',
    read: false,
  },
  {
    id: 'N2',
    kind: 'success',
    sender: 'Hệ thống',
    title: 'Chúc mừng thăng hạng!',
    description: 'Bạn vừa đạt Hạng Kim Cương. Cố thêm 32 điểm nữa để lên Hạng Vương Miện.',
    snippet: 'Hạng Kim Cương',
    time: '10:20',
    read: false,
  },
  {
    id: 'N3',
    kind: 'warning',
    sender: 'ĐTLO',
    title: 'Minh chứng bị từ chối',
    description: 'Clip DTLO "Clip review dự án Sun Grand City" bị từ chối — vui lòng nộp lại minh chứng rõ hơn.',
    snippet: 'Clip Sun Grand City',
    time: 'Hôm qua',
    read: false,
  },
  {
    id: 'N4',
    kind: 'info',
    sender: 'Đào tạo',
    title: 'Sắp diễn ra: Training Quý 3',
    description: 'Buổi Training / Kick off Quý 3 diễn ra 20/09 — nhớ điểm danh QR để nhận điểm.',
    snippet: 'Training Quý 3',
    time: '20/09',
    read: true,
  },
  {
    id: 'N5',
    kind: 'success',
    sender: 'ĐTLO',
    title: 'Minh chứng đã được duyệt',
    description: 'Check-in sự kiện Vinhomes Ocean Park vừa được duyệt, +1 điểm DTR.',
    snippet: 'Vinhomes Ocean Park',
    time: '3 ngày trước',
    read: true,
  },
]
