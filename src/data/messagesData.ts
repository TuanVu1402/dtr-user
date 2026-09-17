export type ChatMessage = {
  id: string
  fromMe: boolean
  text: string
  time: string
}

export type MessageThread = {
  id: string
  sender: string
  preview: string
  time: string
  unread: boolean
  messages: ChatMessage[]
}

/** Hộp thư mẫu — tin nhắn người dùng đã nhận (demo, chưa nối API). */
export const initialThreads: MessageThread[] = [
  {
    id: 'M1',
    sender: 'DTR Support',
    preview: 'Minh chứng Booking #BK-3391 đã được duyệt, +4 điểm DTR.',
    time: '2 giờ trước',
    unread: true,
    messages: [
      {
        id: 'M1-1',
        fromMe: false,
        text: 'Chào bạn, minh chứng Booking #BK-3391 — Dự án Lumi Hà Nội đã được duyệt.',
        time: '2 giờ trước',
      },
      {
        id: 'M1-2',
        fromMe: false,
        text: 'Bạn được cộng +4 điểm DTR. Tiếp tục phát huy nhé!',
        time: '2 giờ trước',
      },
    ],
  },
  {
    id: 'M2',
    sender: 'Ban vận hành',
    preview: 'Nhắc lịch Training Quý 3 — 20/09, nhớ điểm danh QR.',
    time: '5 giờ trước',
    unread: true,
    messages: [
      {
        id: 'M2-1',
        fromMe: false,
        text: 'Buổi Training / Kick off Quý 3 diễn ra ngày 20/09.',
        time: '5 giờ trước',
      },
      {
        id: 'M2-2',
        fromMe: false,
        text: 'Nhớ mang điện thoại để quét mã QR điểm danh và nhận điểm.',
        time: '5 giờ trước',
      },
      {
        id: 'M2-3',
        fromMe: true,
        text: 'Mình đã nhận lịch, cảm ơn Ban vận hành.',
        time: '4 giờ trước',
      },
    ],
  },
  {
    id: 'M3',
    sender: 'Hệ thống DTR',
    preview: 'Chúc mừng bạn vừa đạt Hạng Kim Cương!',
    time: '1 ngày trước',
    unread: true,
    messages: [
      {
        id: 'M3-1',
        fromMe: false,
        text: 'Chúc mừng! Bạn vừa đạt Hạng Kim Cương.',
        time: '1 ngày trước',
      },
      {
        id: 'M3-2',
        fromMe: false,
        text: 'Còn 32 điểm nữa để lên Hạng Vương Miện. Cố lên nhé!',
        time: '1 ngày trước',
      },
    ],
  },
  {
    id: 'M4',
    sender: 'DTR Support',
    preview: 'Clip DTLO bị từ chối — vui lòng nộp lại minh chứng rõ hơn.',
    time: '2 ngày trước',
    unread: false,
    messages: [
      {
        id: 'M4-1',
        fromMe: false,
        text: 'Clip review dự án Sun Grand City chưa đủ rõ nên chưa được duyệt.',
        time: '2 ngày trước',
      },
      {
        id: 'M4-2',
        fromMe: false,
        text: 'Bạn nộp lại minh chứng với hình ảnh/video rõ hơn giúp mình nhé.',
        time: '2 ngày trước',
      },
    ],
  },
]
