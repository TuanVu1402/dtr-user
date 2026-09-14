import { useState, type FormEvent } from 'react'
import { useFeedback } from '../context/FeedbackContext'
import { feedbackTypeLabels, type FeedbackType } from '../types/dtr'
import '../styles/shared.css'
import './FeedbackSection.css'

const feedbackTypeOptions = (Object.entries(feedbackTypeLabels) as [FeedbackType, string][]).map(
  ([value, label]) => ({ value, label }),
)

export default function FeedbackSection() {
  const { addFeedback } = useFeedback()
  const [type, setType] = useState<FeedbackType>('suggestion')
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    addFeedback(type, content.trim(), email.trim())
    setSubmitted(true)
    setContent('')
    setEmail('')
    setType('suggestion')
  }

  return (
    <section className="feedback-section">
      <div className="pill">HỖ TRỢ</div>
      <h2 className="section-title" style={{ fontSize: 22 }}>
        Phản hồi &amp; góp ý về trang web
      </h2>
      <p className="section-caption">
        Bạn gặp lỗi khi sử dụng hoặc có góp ý giúp DTR Point tốt hơn? Gửi cho đội ngũ vận hành nhé.
      </p>

      <form className="feedback-card" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label">Loại phản hồi</label>
          <div className="feedback-type-row">
            {feedbackTypeOptions.map((option) => (
              <label
                key={option.value}
                className={`option-pill${option.value === type ? ' active' : ''}`}
              >
                <input
                  type="radio"
                  name="feedback-type"
                  value={option.value}
                  checked={option.value === type}
                  onChange={() => setType(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="feedback-content">
            Nội dung
          </label>
          <textarea
            id="feedback-content"
            className="field-input field-textarea"
            placeholder="Mô tả lỗi bạn gặp phải hoặc góp ý của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="feedback-email">
            Email liên hệ (không bắt buộc)
          </label>
          <input
            id="feedback-email"
            className="field-input"
            type="email"
            placeholder="ban@dtr.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="feedback-actions">
          {submitted && (
            <span className="feedback-success">✓ Cảm ơn bạn, phản hồi đã được gửi!</span>
          )}
          <button type="submit" className="btn-primary">
            Gửi phản hồi
          </button>
        </div>
      </form>
    </section>
  )
}
