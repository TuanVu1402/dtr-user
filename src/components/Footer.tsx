import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import dongTayLandLogo from '../assets/dong-tay-land-logo.png'
import { FacebookIcon, TiktokIcon, YoutubeIcon, ZaloIcon } from './icons'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col footer-brand-col">
          <BrandLogo height={34} />
          <p className="footer-desc">
            Nền tảng tích điểm DTR dành riêng cho môi giới Dong Tay Land — theo dõi thành tích,
            nộp minh chứng và nhận thưởng theo thời gian thực.
          </p>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">VỀ DTR</div>
          <ul className="footer-links">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <span>Giới thiệu</span>
            </li>
            <li>
              <span>Chính sách bảo mật</span>
            </li>
            <li>
              <span>Điều khoản sử dụng</span>
            </li>
            <li>
              <span>Liên hệ chúng tôi</span>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">DÀNH CHO MÔI GIỚI</div>
          <ul className="footer-links">
            <li>
              <span>Hướng dẫn ghi điểm</span>
            </li>
            <li>
              <span>Lịch sử nộp minh chứng</span>
            </li>
            <li>
              <span>Hạng mục &amp; mốc điểm</span>
            </li>
            <li>
              <span>Câu hỏi thường gặp</span>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">THÔNG TIN KHÁC</div>
          <ul className="footer-links">
            <li>
              <span>Thông báo</span>
            </li>
            <li>
              <span>Tin nhắn</span>
            </li>
            <li>
              <span>Trợ giúp</span>
            </li>
            <li>
              <span>Liên hệ hỗ trợ</span>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-social-col">
          <div className="footer-col-title">KẾT NỐI VỚI CHÚNG TÔI</div>

          <div className="footer-org-logos">
            <div className="footer-org-logo-box">
              <img src={dongTayLandLogo} alt="Dong Tay Land" />
            </div>
          </div>

          <div className="footer-social-divider" />

          <div className="footer-social-grid">
            <a className="social-chip" href="#" onClick={(e) => e.preventDefault()}>
              <FacebookIcon />
              Facebook
            </a>
            <a className="social-chip" href="#" onClick={(e) => e.preventDefault()}>
              <YoutubeIcon />
              YouTube
            </a>
            <a className="social-chip" href="#" onClick={(e) => e.preventDefault()}>
              <TiktokIcon />
              TikTok
            </a>
            <a className="social-chip" href="#" onClick={(e) => e.preventDefault()}>
              <ZaloIcon />
              Zalo
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026. <b>CÔNG TY CỔ PHẦN CÔNG NGHỆ XHUB</b>. GPĐKKD: 0312312011, thành lập vào
          xx/09/2026.
        </p>
        <p>
          Địa chỉ: 192 Trần Não, Khu Phố 2, Phường An Khánh, Thành Phố Hồ Chí Minh, Việt Nam. Điện
          thoại: 0939653777. Email: xhub@dongtayland.vn
        </p>
        <p>Người đại diện theo pháp luật: Ông Nguyễn Thái Bình – Chủ Tịch Hội Đồng Quản Trị.</p>
        <p>
          <a href="#" onClick={(e) => e.preventDefault()} className="footer-bottom-link">
            Xem chính sách sử dụng
          </a>
        </p>
      </div>
    </footer>
  )
}
