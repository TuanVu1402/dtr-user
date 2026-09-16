import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Category } from '@/types/dtr'
import { formatPoints } from '@/utils/format'

type SubmissionFormProps = {
  category: Category
  onCancel: () => void
  onSubmit: (data: {
    optionLabel: string
    points: number
    description: string
    date: string
    link?: string
    imageDataUrl?: string
  }) => void
}

type FormErrors = {
  date?: string
  description?: string
  link?: string
  file?: string
}

export default function SubmissionForm({ category, onCancel, onSubmit }: SubmissionFormProps) {
  const [optionLabel, setOptionLabel] = useState(category.pointOptions[0].label)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined)
  const [errors, setErrors] = useState<FormErrors>({})

  const selectedOption = category.pointOptions.find((o) => o.label === optionLabel) ?? category.pointOptions[0]
  const hasMultipleOptions = category.pointOptions.length > 1
  const isLinkEvidence = category.evidenceType === 'link'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const nextErrors: FormErrors = {}
    if (!date.trim()) nextErrors.date = 'Vui lòng chọn ngày thực hiện'
    if (!description.trim()) nextErrors.description = 'Vui lòng nhập mô tả / thông tin minh chứng'
    if (isLinkEvidence) {
      if (!link.trim()) nextErrors.link = 'Vui lòng dán link clip minh chứng'
    } else if (!file) {
      nextErrors.file = 'Vui lòng chọn ảnh hoặc tệp minh chứng'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    onSubmit({
      optionLabel: selectedOption.label,
      points: selectedOption.points,
      description,
      date,
      link: isLinkEvidence ? link : undefined,
      imageDataUrl,
    })
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const nextFile = e.target.files?.[0] ?? null
    setFile(nextFile)
    if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }))

    if (nextFile && nextFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setImageDataUrl(reader.result as string)
      reader.readAsDataURL(nextFile)
    } else {
      setImageDataUrl(undefined)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-4"
      onClick={onCancel}
    >
      <form
        className="flex w-full max-w-[400px] max-h-[85svh] flex-col gap-4 overflow-y-auto rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)] uppercase">Nộp minh chứng</div>
            <div className="mt-1 text-base font-semibold text-[var(--text-primary)]">
              {category.title}
            </div>
          </div>
          <button
            type="button"
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-[var(--hairline)] bg-transparent text-xl leading-none text-[var(--text-secondary)]"
            onClick={onCancel}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Point Options */}
        {hasMultipleOptions && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Loại</label>
            <div className="flex flex-wrap gap-2">
              {category.pointOptions.map((option) => (
                <label
                  key={option.label}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    option.label === optionLabel
                      ? 'border-[var(--gold)] bg-[var(--gold)]/[0.1] text-[var(--gold-bright)]'
                      : 'border-[var(--hairline)] text-[var(--text-secondary)]'
                  }`}
                >
                  <input
                    className="accent-[var(--gold)]"
                    type="radio"
                    name="pointOption"
                    value={option.label}
                    checked={option.label === optionLabel}
                    onChange={() => setOptionLabel(option.label)}
                  />
                  {option.label} · {formatPoints(option.points)} điểm
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="submission-date">
            Ngày thực hiện <span className="text-[var(--negative)]">*</span>
          </label>
          <input
            id="submission-date"
            className={`rounded-lg border bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--gold)] focus:outline-none ${
              errors.date ? 'border-[var(--negative)]' : 'border-[var(--hairline)]'
            }`}
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
            }}
          />
          {errors.date && <div className="text-xs text-[var(--negative)]">{errors.date}</div>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="submission-desc">
            Mô tả minh chứng <span className="text-[var(--negative)]">*</span>
          </label>
          <textarea
            id="submission-desc"
            className={`min-h-[72px] resize-y rounded-lg border bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none ${
              errors.description ? 'border-[var(--negative)]' : 'border-[var(--hairline)]'
            }`}
            placeholder="Ví dụ: Dự án, mã booking, tên sự kiện..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
            }}
          />
          {errors.description && <div className="text-xs text-[var(--negative)]">{errors.description}</div>}
        </div>

        {/* Evidence - Link */}
        {isLinkEvidence ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="submission-link">
              Link minh chứng <span className="text-[var(--negative)]">*</span>
            </label>
            <input
              id="submission-link"
              className={`rounded-lg border bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none ${
                errors.link ? 'border-[var(--negative)]' : 'border-[var(--hairline)]'
              }`}
              type="url"
              placeholder="Dán link (YouTube, TikTok, Drive...)"
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                if (errors.link) setErrors((prev) => ({ ...prev, link: undefined }))
              }}
            />
            {errors.link && <div className="text-xs text-[var(--negative)]">{errors.link}</div>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Ảnh minh chứng <span className="text-[var(--negative)]">*</span>
            </label>
            <label
              className={`flex cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 text-center text-sm text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold-bright)] ${
                errors.file ? 'border-[var(--negative)]' : 'border-[var(--hairline)]'
              }`}
            >
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              <span>{file ? file.name : 'Chọn ảnh minh chứng'}</span>
            </label>
            {errors.file && <div className="text-xs text-[var(--negative)]">{errors.file}</div>}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-[var(--hairline)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--on-gold)]"
          >
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </div>
  )
}
