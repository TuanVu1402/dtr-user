import { useState } from 'react'

type FaqItem = {
  question: string
  paragraphs: string[]
  bullets?: string[]
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'DTR Point dùng để làm gì?',
    paragraphs: [
      'DTR Point là nền tảng tích điểm dành riêng cho nhà môi giới tại Đông Tây Land. Bạn ghi nhận thành tích theo từng hạng mục, theo dõi lịch sử duyệt và cạnh tranh trên bảng vàng vinh danh.',
    ],
  },
  {
    question: 'Làm sao để nộp minh chứng ghi điểm?',
    paragraphs: [
      'Tại mục Cách ghi điểm, chọn hạng mục phù hợp rồi điền ngày thực hiện và thông tin minh chứng.',
    ],
    bullets: [
      'Training / Kick off và check-in sự kiện: quét mã QR tại chỗ (cần vị trí GPS).',
      'Booking và giao dịch: nhập mô tả minh chứng (mã booking, dự án…) — không cần ảnh.',
      'Clip DTLO / GĐDA: dán link clip; hạng mục GĐDA cần chọn dự án.',
      'Check-in VPBH: chụp ảnh minh chứng kèm mô tả nếu cần.',
    ],
  },
  {
    question: 'Booking và giao dịch có bắt buộc chụp ảnh không?',
    paragraphs: [
      'Không. Với hai hạng mục này, minh chứng là phần mô tả (ví dụ dự án, mã booking, thông tin giao dịch). Ảnh không được yêu cầu và không hiển thị trong lịch sử duyệt.',
    ],
  },
  {
    question: 'Điểm được duyệt trong bao lâu? Khi nào tôi thấy điểm trên bảng xếp hạng?',
    paragraphs: [
      'Sau khi gửi, yêu cầu nằm ở trạng thái Chờ duyệt trong Lịch sử duyệt điểm. Khi được duyệt, điểm cộng vào thành tích và bảng xếp hạng; nếu từ chối, lý do sẽ hiện ngay trên từng dòng lịch sử.',
    ],
  },
  {
    question: 'Bảng xếp hạng tính theo tháng hay toàn thời gian?',
    paragraphs: [
      'Trang chủ mặc định hiển thị bảng vàng tháng trước. Vào trang xếp hạng để chọn tháng cụ thể hoặc bấm Toàn thời gian để xem thành tích cộng dồn. Ô Tìm thành viên giúp lọc theo tên.',
    ],
  },
  {
    question: 'Clip DTLO khác clip GĐDA ở điểm nào?',
    paragraphs: [
      'Cả hai đều nộp bằng link clip, không kèm ảnh.',
    ],
    bullets: [
      'Clip DTLO: Đông Tây Land Online duyệt nội dung.',
      'Clip GĐDA: Giám đốc dự án duyệt; form yêu cầu chọn đúng dự án trước khi gửi.',
    ],
  },
  {
    question: 'Tôi đã nộp minh chứng nhưng chưa thấy điểm — phải làm gì?',
    paragraphs: [
      'Mở Lịch sử duyệt điểm trên trang chủ:',
    ],
    bullets: [
      'Chờ duyệt: yêu cầu đang được xử lý, điểm chưa cộng.',
      'Từ chối: đọc lý do, chỉnh minh chứng rồi nộp lại.',
      'Vẫn chưa rõ: liên hệ hotline 0939 653 777 hoặc email xhub@dongtayland.vn.',
    ],
  },
  {
    question: 'Quét QR check-in có bắt buộc bật GPS không?',
    paragraphs: [
      'Có. Training / Kick off và check-in sự kiện cần vị trí để xác nhận bạn có mặt tại điểm diễn ra. Hãy cho phép trình duyệt truy cập vị trí trước khi quét.',
    ],
  },
  {
    question: 'Độ uy tín trên bảng xếp hạng được tính thế nào?',
    paragraphs: [
      'Độ uy tín là tỷ lệ minh chứng được duyệt trên tổng số lần bạn đã nộp. Nộp đúng hạng mục, đủ thông tin sẽ giữ độ uy tín cao hơn.',
    ],
  },
  {
    question: 'Tôi xem lịch sử điểm đã nộp ở đâu?',
    paragraphs: [
      'Ngay trên trang chủ, mục Lịch sử duyệt điểm. Lọc Tất cả / Đã duyệt / Chờ duyệt / Từ chối để theo dõi từng yêu cầu. Ảnh minh chứng (nếu có) mở khi bấm vào dòng tương ứng.',
    ],
  },
  {
    question: 'Minh chứng bị từ chối thì kháng cáo thế nào?',
    paragraphs: [
      'Vào Lịch sử duyệt điểm, chọn dòng bị từ chối để xem lý do. Ở cuối chi tiết, điền nội dung kháng cáo rồi bấm Gửi kháng cáo. Mỗi minh chứng chỉ kháng cáo được một lần.',
    ],
  },
  {
    question: 'Kháng cáo có bắt buộc đính kèm ảnh không?',
    paragraphs: [
      'Cần giải thích bằng chữ. Ảnh bổ sung nên đính kèm với hạng mục vốn có minh chứng hình (ví dụ check-in VPBH). Booking và giao dịch không yêu cầu ảnh khi kháng cáo.',
    ],
  },
  {
    question: 'Sau khi gửi kháng cáo thì chuyện gì xảy ra?',
    paragraphs: [
      'Minh chứng chuyển lại trạng thái Chờ duyệt để được xem xét lần nữa. Bạn sẽ thấy dòng “Đã gửi kháng cáo” kèm thời điểm gửi trong chi tiết lịch sử.',
    ],
  },
  {
    question: 'Tôi có thể kháng cáo minh chứng đã được duyệt không?',
    paragraphs: [
      'Không. Chỉ minh chứng bị từ chối và chưa từng kháng cáo mới hiện form gửi. Nếu cần chỉnh hạng mục đã duyệt, liên hệ hotline 0939 653 777 hoặc email xhub@dongtayland.vn.',
    ],
  },
]

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())
  const midpoint = Math.ceil(FAQ_ITEMS.length / 2)
  const columns = [FAQ_ITEMS.slice(0, midpoint), FAQ_ITEMS.slice(midpoint)]

  function toggleItem(index: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function renderItem(item: FaqItem, index: number) {
    const open = openIndexes.has(index)
    return (
      <div
        key={item.question}
        className="min-w-0 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-3 shadow-[0_1px_2px_var(--shadow)] md:px-5"
      >
        <button
          type="button"
          className="flex w-full min-w-0 cursor-pointer items-start gap-3 text-left"
          aria-expanded={open}
          onClick={() => toggleItem(index)}
        >
          <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[#4a3728] md:text-[15px]">
            {item.question}
          </span>
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-lg leading-none font-medium text-[#8a6a54]"
            aria-hidden
          >
            {open ? '−' : '+'}
          </span>
        </button>

        {open ? (
          <div className="mt-3 min-w-0 overflow-hidden border-t border-[var(--hairline)] pt-3 text-sm italic leading-relaxed break-words text-[#6b4f3a]">
            {item.paragraphs.map((text) => (
              <p key={text} className="mb-2 last:mb-0">
                {text}
              </p>
            ))}
            {item.bullets ? (
              <ul className="mt-1 flex list-disc flex-col gap-1.5 pl-4">
                {item.bullets.map((line) => (
                  <li key={line} className="break-words">
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <section id="faq" className="scroll-mt-24 pt-6 pb-4 md:pt-8 md:pb-6">
      <h2 className="mb-4 text-right text-lg font-semibold text-[var(--text-primary)] lg:text-xl">
        Câu hỏi thường gặp
      </h2>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:items-start md:gap-x-4 md:gap-y-0">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex min-w-0 flex-col gap-2.5">
            {column.map((item, offset) => renderItem(item, columnIndex === 0 ? offset : midpoint + offset))}
          </div>
        ))}
      </div>
    </section>
  )
}
