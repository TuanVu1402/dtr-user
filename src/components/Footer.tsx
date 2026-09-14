import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { AppleIcon, FacebookIcon, PlayStoreIcon, TiktokIcon, YoutubeIcon, ZaloIcon } from './icons'
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

          <div className="footer-app-title">TẢI ỨNG DỤNG</div>
          <div className="footer-app-badges">
            <div className="app-badge">
              <AppleIcon />
              <span>
                <em>Download on the</em>
                <b>App Store</b>
              </span>
            </div>
            <div className="app-badge">
              <PlayStoreIcon />
              <span>
                <em>GET IT ON</em>
                <b>Google Play</b>
              </span>
            </div>
          </div>
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
              <Link to="/history">Lịch sử nộp minh chứng</Link>
            </li>
            <li>
              <Link to="/leaderboard">Bảng xếp hạng</Link>
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
        <p>© 2026 DTR — Dong Tay Land. Your Time Has Come.</p>
      </div>
    </footer>
  )
}
