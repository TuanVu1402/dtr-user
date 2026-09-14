import { Link } from 'react-router-dom'
import UserNavbar from '../components/UserNavbar'
import Footer from '../components/Footer'
import { categories } from '../data/dtrData'
import { formatPoints } from '../utils/format'
import {
  ArrowRightIcon,
  BookingIcon,
  CheckinIcon,
  ClipIcon,
  OfficeIcon,
  TrainingIcon,
} from '../components/icons'
import type { Category } from '../types/dtr'
import '../styles/shared.css'
import './GuidePage.css'

const categoryIcons: Record<Category['icon'], typeof BookingIcon> = {
  booking: BookingIcon,
  training: TrainingIcon,
  clip: ClipIcon,
  checkin: CheckinIcon,
  office: OfficeIcon,
}

const tiers = [
  { name: 'Hạng Đồng', range: '0 – 39 điểm' },
  { name: 'Hạng Bạc', range: '40 – 79 điểm' },
  { name: 'Hạng Vàng', range: '80 – 119 điểm' },
  { name: 'Hạng Kim Cương', range: '120 – 159 điểm' },
  { name: 'Hạng Vương Miện', range: 'Từ 160 điểm' },
]

const faqs = [
  {
    q: 'Minh chứng bị từ chối thì có nộp lại được không?',
    a: 'Có. Bạn nộp lại minh chứng mới cho cùng hạng mục ở Trang chủ bất cứ lúc nào, không giới hạn số lần.',
  },
  {
    q: 'Bao lâu thì minh chứng được duyệt?',
    a: 'Thường trong 1–2 ngày làm việc kể từ khi nộp. Riêng điểm danh QR ở Training/Kick off được cộng ngay lập tức.',
  },
  {
    q: 'Điểm DTR dùng để làm gì?',
    a: 'Dùng để xếp hạng thi đua nội bộ trên Bảng xếp hạng và xét thưởng theo chính sách công ty cuối mỗi quý.',
  },
]

export default function GuidePage() {
  return (
    <div className="dtr-root page-bg">
      <UserNavbar active="guide" />

      <section className="section-head">
        <div className="pill">HƯỚNG DẪN</div>
        <h1 className="section-title">Hướng dẫn ghi điểm DTR</h1>
        <p className="section-caption">
          Toàn bộ cách kiếm điểm DTR, mốc thăng hạng và các câu hỏi thường gặp.
        </p>
      </section>

      <section className="guide-section">
        <div className="guide-intro">
          Mỗi hành động đóng góp cho hoạt động kinh doanh — từ booking, giao dịch, đến tham dự
          training hay check-in cùng khách hàng tại sự kiện — đều được quy đổi thành điểm DTR. Nộp
          minh chứng ở Trang chủ, chờ admin xét duyệt là điểm sẽ được cộng vào tổng điểm của bạn.
        </div>

        <div className="guide-cat-list">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon]
            return (
              <div className="guide-cat-card" key={category.id}>
                <div className="guide-cat-icon">
                  <Icon />
                </div>
                <div className="guide-cat-body">
                  <div className="guide-cat-head">
                    <span className="guide-cat-num">{category.number}</span>
                    <span className="guide-cat-title">{category.title}</span>
                    {category.audienceTag && <span className="audience-tag">{category.audienceTag}</span>}
                  </div>
                  <p className="guide-cat-desc">{category.description}</p>
                  <div className="guide-cat-points">
                    {category.pointOptions.map((option) => (
                      <span className="point-chip" key={option.label}>
                        {option.label === 'Điểm'
                          ? `${formatPoints(option.points)} điểm`
                          : `${option.label} · ${formatPoints(option.points)} điểm`}
                      </span>
                    ))}
                    {category.evidenceType === 'link' && (
                      <span className="point-chip">Minh chứng: dán link clip</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="guide-tier-card">
          <div className="guide-block-title">Mốc thăng hạng</div>
          <div className="guide-tier-table">
            {tiers.map((tier) => (
              <div className="guide-tier-row" key={tier.name}>
                <span className="guide-tier-name">{tier.name}</span>
                <span className="guide-tier-range">{tier.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-faq">
          <div className="guide-block-title">Câu hỏi thường gặp</div>
          {faqs.map((item) => (
            <div className="guide-faq-item" key={item.q}>
              <div className="guide-faq-q">{item.q}</div>
              <div className="guide-faq-a">{item.a}</div>
            </div>
          ))}
        </div>

        <Link to="/" className="btn-primary guide-cta">
          Nộp minh chứng ngay
          <ArrowRightIcon color="var(--on-gold)" />
        </Link>
      </section>

      <Footer />
    </div>
  )
}
