import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import dongTayLandLogo from '../assets/dong-tay-land-logo.png'
import { FacebookIcon, TiktokIcon, YoutubeIcon, ZaloIcon } from './icons'

const footerLinkItemClass =
  "flex items-center gap-2 text-[13.5px] text-(--text-secondary) before:content-['›'] before:font-bold before:text-(--gold) [&_a]:cursor-pointer [&_a]:text-inherit [&_a]:no-underline [&_a:hover]:text-(--gold-bright) [&_span]:cursor-pointer [&_span:hover]:text-(--gold-bright)"

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[rgba(37,99,235,0.16)] px-11 pt-12 pb-7 dark:bg-[linear-gradient(180deg,rgba(37,99,235,0.04),transparent_40%)] max-[640px]:px-5 max-[640px]:pt-10 max-[640px]:pb-6">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-8 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-7">
        <div>
          <BrandLogo height={34} />
          <p className="mt-3.5 mb-5 max-w-[30ch] text-[13px] leading-[1.6] text-(--text-tertiary)">
            Nền tảng tích điểm DTR dành riêng cho môi giới Dong Tay Land — theo dõi thành tích, nộp minh chứng và
            nhận thưởng theo thời gian thực.
          </p>
        </div>

        <div>
          <div className="relative mb-4 w-fit pb-3 text-[12.5px] font-extrabold tracking-[1.2px] text-(--gold-bright) after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[28px] after:bg-(--gold) after:content-['']">
            VỀ DTR
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
            <li className={footerLinkItemClass}>
              <span>Liên hệ chúng tôi</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="relative mb-4 w-fit pb-3 text-[12.5px] font-extrabold tracking-[1.2px] text-(--gold-bright) after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[28px] after:bg-(--gold) after:content-['']">
            DÀNH CHO MÔI GIỚI
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
              <span>Câu hỏi thường gặp</span>
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

        <div>
          <div className="relative mb-4 w-fit pb-3 text-[12.5px] font-extrabold tracking-[1.2px] text-(--gold-bright) after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-[28px] after:bg-(--gold) after:content-['']">
            KẾT NỐI VỚI CHÚNG TÔI
          </div>

          <div className="mb-4 flex flex-wrap gap-2.5">
            <div className="flex h-19 w-[110px] items-center justify-center rounded-[10px] border border-[rgba(37,99,235,0.28)] bg-(--surface-1) p-2.5">
              <img className="max-h-full max-w-full object-contain" src={dongTayLandLogo} alt="Dong Tay Land" />
            </div>
          </div>

          <div className="mb-4 h-px bg-(--hairline)" />

          <div className="flex flex-col gap-3">
            <a
              className="flex items-center gap-2.5 text-[13.5px] font-semibold text-(--text-primary) no-underline hover:text-(--gold-bright)"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <FacebookIcon />
              Facebook
            </a>
            <a
              className="flex items-center gap-2.5 text-[13.5px] font-semibold text-(--text-primary) no-underline hover:text-(--gold-bright)"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <YoutubeIcon />
              YouTube
            </a>
            <a
              className="flex items-center gap-2.5 text-[13.5px] font-semibold text-(--text-primary) no-underline hover:text-(--gold-bright)"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <TiktokIcon />
              TikTok
            </a>
            <a
              className="flex items-center gap-2.5 text-[13.5px] font-semibold text-(--text-primary) no-underline hover:text-(--gold-bright)"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <ZaloIcon />
              Zalo
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-1.5 border-t border-[rgba(37,99,235,0.16)] pt-5">
        <p className="m-0 text-[12.5px] text-(--text-muted)">
          © 2026. <b className="text-(--text-secondary)">CÔNG TY CỔ PHẦN CÔNG NGHỆ XHUB</b>. GPĐKKD: 0312312011,
          thành lập vào xx/09/2026.
        </p>
        <p className="m-0 text-[12.5px] text-(--text-muted)">
          Địa chỉ: 192 Trần Não, Khu Phố 2, Phường An Khánh, Thành Phố Hồ Chí Minh, Việt Nam. Điện thoại:
          0939653777. Email: xhub@dongtayland.vn
        </p>
        <p className="m-0 text-[12.5px] text-(--text-muted)">
          Người đại diện theo pháp luật: Ông Nguyễn Thái Bình – Chủ Tịch Hội Đồng Quản Trị.
        </p>
        <p className="m-0 text-[12.5px] text-(--text-muted)">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-semibold text-(--gold-bright) no-underline hover:underline"
          >
            Xem chính sách sử dụng
          </a>
        </p>
      </div>
    </footer>
  )
}
