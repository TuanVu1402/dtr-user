import { useState, type FormEvent } from 'react'
import { useFeedback } from '@/context/FeedbackContext'
import { feedbackTypeLabels, type FeedbackType } from '@/types/dtr'

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
    <section className="px-4 pt-6 pb-4 md:px-6 md:pt-6 md:pb-6 lg:px-6 lg:pt-6 lg:pb-6">
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:p-6 lg:p-8">
        <h2 className="mb-1 text-base font-semibold text-[var(--text-primary)] md:text-lg">
          Phản hồi & góp ý
        </h2>
        <p className="mb-4 text-xs text-[var(--text-muted)] md:text-sm">
          Gặp lỗi hoặc có góp ý giúp DTR tốt hơn? Gửi cho đội ngũ vận hành nhé.
        </p>

        <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit}>
          {/* Feedback Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] md:text-sm">Loại phản hồi</label>
            <div className="flex flex-wrap gap-2">
              {feedbackTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors md:text-sm md:px-4 md:py-2 ${
                    option.value === type
                      ? 'border-[var(--gold)] bg-[var(--gold)]/[0.1] text-[var(--gold-bright)]'
                      : 'border-[var(--hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
                  }`}
                >
                  <input
                    className="accent-[var(--gold)]"
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

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] md:text-sm" htmlFor="feedback-content">
              Nội dung
            </label>
            <textarea
              id="feedback-content"
              className="min-h-[80px] resize-y rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none md:min-h-[100px] md:px-4 md:py-3 md:text-base"
              placeholder="Mô tả lỗi hoặc góp ý của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] md:text-sm" htmlFor="feedback-email">
              Email (không bắt buộc)
            </label>
            <input
              id="feedback-email"
              className="rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none md:px-4 md:py-3 md:text-base"
              type="email"
              placeholder="ban@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--gold)] py-2.5 text-sm font-medium text-[var(--on-gold)] transition-colors hover:bg-[var(--gold-deep)] md:py-3 md:text-base lg:w-auto lg:px-8"
          >
            Gửi phản hồi
          </button>

          {submitted && (
            <p className="text-center text-xs font-medium text-[var(--positive)] md:text-sm">
              ✓ Cảm ơn bạn, phản hồi đã được gửi!
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
