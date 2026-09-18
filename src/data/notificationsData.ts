export type NotificationKind = 'success' | 'warning' | 'info'
export type NotificationTopic = 'approved' | 'rejected' | 'training' | 'rank' | 'system'

export type AppNotification = {
  id: string
  kind: NotificationKind
  topic: NotificationTopic
  sender: string
  title: string
  description: string
  snippet?: string
  /** Ảnh minh chứng demo đã có trong /public/demo */
  imageUrl?: string
  /** Link clip / minh chứng (nếu có) */
  link?: string
  time: string
  read: boolean
}

export const topicLabels: Record<NotificationTopic, string> = {
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  training: 'Đào tạo',
  rank: 'Hạng',
  system: 'Hệ thống',
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
    topic: 'approved',
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
    topic: 'rank',
    sender: 'Hệ thống',
    title: 'Chúc mừng thăng hạng!',
    description: 'Bạn vừa đạt Hạng Kim Cương. Cố thêm 32 điểm nữa để lên Hạng Vương Miện.',
    snippet: 'Hạng Kim Cương',
    imageUrl: '/filetinhdiem.jpg',
    time: '10:20',
    read: false,
  },
  {
    id: 'N3',
    kind: 'warning',
    topic: 'rejected',
    sender: 'ĐTLO',
    title: 'Minh chứng bị từ chối',
    description: 'Clip DTLO "Clip review dự án Sun Grand City" bị từ chối — vui lòng nộp lại minh chứng rõ hơn.',
    snippet: 'Clip Sun Grand City',
    link: 'https://youtube.com/watch?v=example',
    time: 'Hôm qua',
    read: false,
  },
  {
    id: 'N4',
    kind: 'info',
    topic: 'training',
    sender: 'Đào tạo',
    title: 'Sắp diễn ra: Training Quý 3',
    description: 'Buổi Training / Kick off Quý 3 diễn ra 20/09 — nhớ điểm danh QR để nhận điểm.',
    snippet: 'Training Quý 3',
    imageUrl: '/demo/checkin3.jpg',
    time: '20/09',
    read: true,
  },
  {
    id: 'N5',
    kind: 'success',
    topic: 'approved',
    sender: 'ĐTLO',
    title: 'Minh chứng đã được duyệt',
    description: 'Check-in sự kiện Vinhomes Ocean Park vừa được duyệt, +1 điểm DTR.',
    snippet: 'Vinhomes Ocean Park',
    imageUrl: '/demo/checkin2.jpg',
    time: '3 ngày trước',
    read: true,
  },
  {
    id: 'N6',
    kind: 'warning',
    topic: 'rejected',
    sender: 'ĐTLO',
    title: 'Check-in VPBH chưa đạt',
    description: 'Ảnh check-in tại Hải Vân Bay bị từ chối vì không thấy mặt tiền văn phòng. Hãy chụp lại và kháng cáo nếu cần.',
    snippet: 'Hải Vân Bay',
    imageUrl: '/demo/checkin1.jpg',
    time: '4 ngày trước',
    read: true,
  },
  {
    id: 'N7',
    kind: 'info',
    topic: 'training',
    sender: 'Đào tạo',
    title: 'Nhắc điểm danh Kick off',
    description: 'Buổi Kick off dự án Vin Green City bắt đầu lúc 08:30. Bật GPS trước khi quét QR.',
    snippet: 'Vin Green City',
    time: '05/09',
    read: true,
  },
  {
    id: 'N8',
    kind: 'info',
    topic: 'system',
    sender: 'Hệ thống',
    title: 'Bảng xếp hạng tháng 8 đã chốt',
    description: 'Điểm tháng 8/2026 đã khóa. Bạn đang ở vị trí #1 với độ uy tín 100%.',
    snippet: 'Tháng 8/2026',
    time: '01/09',
    read: false,
  },
  {
    id: 'N9',
    kind: 'success',
    topic: 'approved',
    sender: 'ĐTLO',
    title: 'Giao dịch đã được ghi nhận',
    description: 'Thỏa thuận giao dịch The Marq đã được duyệt, +5 điểm DTR.',
    snippet: 'The Marq',
    time: '28/08',
    read: true,
  },
  {
    id: 'N10',
    kind: 'success',
    topic: 'rank',
    sender: 'Hệ thống',
    title: 'Bạn còn 12 điểm nữa lên hạng',
    description: 'Duy trì độ uy tín và nộp đúng hạng mục để tăng tốc lên Hạng Vương Miện.',
    snippet: 'Hạng Vương Miện',
    time: '25/08',
    read: true,
  },
  {
    id: 'N11',
    kind: 'info',
    topic: 'training',
    sender: 'Đào tạo',
    title: 'Lịch Training tháng 9',
    description: 'Đăng ký chỗ cho buổi đào tạo pháp lý BĐS ngày 22/09 tại hội trường tầng 3.',
    snippet: '22/09',
    time: '18/08',
    read: true,
  },
  {
    id: 'N12',
    kind: 'info',
    topic: 'system',
    sender: 'Hệ thống',
    title: 'Cập nhật quy tắc ghi điểm',
    description: 'Booking và giao dịch không cần ảnh minh chứng — chỉ cần mô tả. Clip GĐDA bắt buộc chọn dự án.',
    snippet: 'Quy tắc ghi điểm',
    time: '10/08',
    read: true,
  },
]
