import { useState, type FormEvent } from 'react'
import { useFeedback } from '../context/FeedbackContext'
import { feedbackTypeLabels, type FeedbackType } from '../types/dtr'

const feedbackTypeOptions = (Object.entries(feedbackTypeLabels) as [FeedbackType, string][]).map(
  ([value, label]) => ({ value, label }),
)

const fieldInputClass =
  "w-full rounded-[10px] border border-[rgba(37,99,235,0.25)] bg-(--surface-tint) px-3.5 py-[11px] font-['Open_Sans',sans-serif] text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--gold) focus:outline-none"
const fieldLabelClass = 'text-[12.5px] font-bold text-(--text-secondary)'
const btnPrimaryClass =
  "min-h-11 cursor-pointer rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-[11px] font-['Open_Sans',sans-serif] text-[13.5px] font-bold text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow,background,border-color] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]"

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
    <section className="flex flex-col items-start gap-3.5 px-11 pt-[46px] max-[640px]:px-5">
      <div className="inline-flex items-center rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-2 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
        HỖ TRỢ
      </div>
      <h2 className="m-0 font-['Open_Sans',sans-serif] text-[22px] font-extrabold tracking-[0.5px] text-(--text-primary)">
        Phản hồi &amp; góp ý về trang web
      </h2>
      <p className="m-0 text-sm font-medium text-(--text-tertiary)">
        Bạn gặp lỗi khi sử dụng hoặc có góp ý giúp DTR Point tốt hơn? Gửi cho đội ngũ vận hành nhé.
      </p>

      <form
        className="mt-2 flex w-full max-w-[640px] flex-col gap-5 rounded-xl border border-[rgba(37,99,235,0.2)] bg-(--surface-tint) p-6.5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass}>Loại phản hồi</label>
          <div className="flex flex-wrap gap-2.5">
            {feedbackTypeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-[13px] font-bold ${
                  option.value === type
                    ? 'border-(--gold) bg-[rgba(37,99,235,0.14)] text-(--gold-bright)'
                    : 'border-[rgba(37,99,235,0.3)] text-(--text-secondary)'
                }`}
              >
                <input
                  className="accent-(--gold)"
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

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="feedback-content">
            Nội dung
          </label>
          <textarea
            id="feedback-content"
            className={`min-h-[88px] resize-y ${fieldInputClass}`}
            placeholder="Mô tả lỗi bạn gặp phải hoặc góp ý của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="feedback-email">
            Email liên hệ (không bắt buộc)
          </label>
          <input
            id="feedback-email"
            className={fieldInputClass}
            type="email"
            placeholder="ban@dtr.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <button type="submit" className={btnPrimaryClass}>
            Gửi phản hồi
          </button>
          {submitted && (
            <span className="text-[13.5px] font-bold text-(--positive)">✓ Cảm ơn bạn, phản hồi đã được gửi!</span>
          )}
        </div>
      </form>
    </section>
  )
}
