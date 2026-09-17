import { useState, type FormEvent } from 'react'
import { CameraIcon } from '@/components'
import { useFeedback } from '@/context/FeedbackContext'
import { feedbackTypeLabels, type FeedbackType } from '@/types/dtr'

const feedbackTypeOptions = (Object.entries(feedbackTypeLabels) as [FeedbackType, string][]).map(
  ([value, label]) => ({ value, label }),
)

type FeedbackSectionProps = {
  embedded?: boolean
}

export default function FeedbackSection({ embedded = false }: FeedbackSectionProps) {
  const { addFeedback } = useFeedback()
  const [type, setType] = useState<FeedbackType>('suggestion')
  const [content, setContent] = useState('')
  const [imagePreview, setImagePreview] = useState<string | undefined>()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    addFeedback(type, content.trim(), undefined, imagePreview)
    setSubmitted(true)
    setContent('')
    setImagePreview(undefined)
    setType('suggestion')
  }

  return (
    <section className={embedded ? 'pt-6 pb-4 md:pt-8 md:pb-6' : 'px-4 pt-6 pb-4 md:px-6 md:pt-8 md:pb-6 lg:px-8 lg:pt-8 lg:pb-6'}>
      <div className={embedded ? undefined : 'mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-[1280px]'}>
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)] lg:text-xl">
          Phản hồi & góp ý
        </h2>
        <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:p-6 lg:p-8">
          <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit}>
          {/* Feedback Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] md:text-sm">Loại phản hồi</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {feedbackTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex min-w-0 cursor-pointer items-center justify-center gap-1 rounded-full border px-2 py-1.5 text-center text-[11px] leading-none font-medium whitespace-nowrap transition-colors sm:gap-1.5 sm:px-3 sm:text-xs md:px-4 md:py-2 md:text-sm ${
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

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-[var(--text-secondary)] md:text-sm">Đính kèm hình ảnh</span>
            {imagePreview ? (
              <div className="flex items-start gap-3">
                <img
                  src={imagePreview}
                  alt="Ảnh đính kèm"
                  className="h-20 w-20 rounded-lg border border-[var(--hairline)] object-cover"
                />
                <button
                  type="button"
                  className="text-xs font-medium text-[var(--negative)] hover:underline md:text-sm"
                  onClick={() => setImagePreview(undefined)}
                >
                  Gỡ ảnh
                </button>
              </div>
            ) : (
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[var(--hairline)] bg-[var(--bg-2)] px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--gold)] hover:text-[var(--gold)] md:px-4">
                <CameraIcon size={18} color="currentColor" />
                Đính kèm hình ảnh
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file || !file.type.startsWith('image/')) return
                    const reader = new FileReader()
                    reader.onload = () => setImagePreview(reader.result as string)
                    reader.readAsDataURL(file)
                    event.target.value = ''
                  }}
                />
              </label>
            )}
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
      </div>
    </section>
  )
}
