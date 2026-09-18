import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

const footerLinkItemClass =
  "flex items-center gap-2 text-[13.5px] text-(--text-secondary) before:content-['›'] before:font-bold before:text-(--gold) [&_a]:cursor-pointer [&_a]:text-inherit [&_a]:no-underline [&_a:hover]:text-(--gold-bright) [&_span]:cursor-pointer [&_span:hover]:text-(--gold-bright)"

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[rgba(37,99,235,0.16)] px-11 pt-12 pb-7 dark:bg-[linear-gradient(180deg,rgba(37,99,235,0.04),transparent_40%)] max-[640px]:px-5 max-[640px]:pt-10 max-[640px]:pb-6">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-7">
        <div>
          <BrandLogo height={34} />
          <p className="mt-3.5 mb-4 max-w-[30ch] text-[13px] leading-[1.6] text-(--text-tertiary) max-[640px]:max-w-none">
            Nền tảng tích điểm DTR Point dành riêng cho nhà môi giới tại Đông Tây Land — theo dõi thành tích, nộp minh chứng và
            nhận thưởng theo thời gian thực.
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 rounded-lg border border-[rgba(37,99,235,0.28)] bg-[var(--surface-1)] px-4 py-2.5 text-sm font-medium text-[var(--gold-bright)]! no-underline shadow-[0_1px_2px_var(--shadow)] transition-colors hover:border-[var(--gold)] hover:bg-[var(--bg-2)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v11" />
              <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
              <path d="M4 19h16" />
            </svg>
            Tải app ngay
          </a>
        </div>

        <div>
          <div className="relative mb-4 w-fit pb-3 text-[12.5px] font-extrabold tracking-[1.2px] text-(--gold-bright) after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[28px] after:bg-(--gold) after:content-['']">
            VỀ CHÚNG TÔI
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className={footerLinkItemClass}>
              <Link to="/">Trang chủ</Link>
            </li>
            <li className={footerLinkItemClass}>
              <span>Giới thiệu</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Chính sách bảo mật</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Điều khoản sử dụng</span>
            </li>
            {/* <li className={footerLinkItemClass}>
              <span>Liên hệ chúng tôi</span>
            </li> */}
          </ul>
        </div>

        <div>
          <div className="relative mb-4 w-fit pb-3 text-[12.5px] font-extrabold tracking-[1.2px] text-(--gold-bright) after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[28px] after:bg-(--gold) after:content-['']">
            DÀNH CHO NHÀ MÔI GIỚI
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className={footerLinkItemClass}>
              <span>Hướng dẫn ghi điểm</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Lịch sử nộp minh chứng</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Hạng mục &amp; mốc điểm</span>
            </li>
            <li className={footerLinkItemClass}>
              <a href="/#faq">Câu hỏi thường gặp</a>
            </li>
          </ul>
        </div>

        <div>
          <div className="relative mb-4 w-fit pb-3 text-[12.5px] font-extrabold tracking-[1.2px] text-(--gold-bright) after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[28px] after:bg-(--gold) after:content-['']">
            THÔNG TIN KHÁC
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className={footerLinkItemClass}>
              <span>Thông báo</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Tin nhắn</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Trợ giúp</span>
            </li>
            <li className={footerLinkItemClass}>
              <span>Liên hệ hỗ trợ</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-[rgba(37,99,235,0.16)] pt-5 text-[12.5px] leading-relaxed text-(--text-muted)">
        <p className="m-0">
          <b className="text-(--text-secondary)">
            © 2026 Đông Tây Land. All rights reserved | Designed by XHUB TECHNOLOGY.
          </b>
        </p>
        <p className="m-0">
          Địa chỉ: 192 Trần Não, Khu Phố 2, Phường An Khánh, Thành phố Hồ Chí Minh, Việt Nam.
        </p>
        <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="whitespace-nowrap">
            Điện thoại:{' '}
            <a href="tel:0939653777" className="text-inherit no-underline">
              0939653777
            </a>
          </span>
          <span className="whitespace-nowrap">
            Email:{' '}
            <a href="mailto:xhub@dongtayland.vn" className="text-inherit no-underline">
              xhub@dongtayland.vn
            </a>
          </span>
        </p>
        <p className="m-0">Người đại diện theo pháp luật: Ông Nguyễn Thái Bình – Chủ Tịch Hội Đồng Quản Trị.</p>
        <p className="m-0">
          {/* <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-semibold text-(--gold-bright) no-underline hover:underline"
          >
            Xem chính sách sử dụng
          </a> */}
        </p>
      </div>
    </footer>
  )
}
