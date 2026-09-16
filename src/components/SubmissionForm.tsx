import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Category } from '../types/dtr'
import { formatPoints } from '../utils/format'

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

const fieldInputClass =
  "w-full rounded-[10px] border border-[rgba(37,99,235,0.25)] bg-(--surface-tint) px-3.5 py-[11px] font-['Open_Sans',sans-serif] text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--gold) focus:outline-none"
const fieldLabelClass = 'text-[12.5px] font-bold text-(--text-secondary)'
const requiredMarkClass = 'font-bold text-[#e5876f]'
const fieldErrorClass = 'text-[12.5px] text-[#e5876f]'

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--scrim) p-6 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <form
        className="flex w-full max-w-[480px] max-h-[90svh] flex-col gap-5 overflow-y-auto rounded-[18px] border border-[rgba(37,99,235,0.32)] bg-[linear-gradient(160deg,var(--surface-1),var(--surface-2))] p-7 shadow-[0_30px_60px_var(--shadow-strong)]"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-[1.4px] text-(--gold-bright) uppercase">Nộp minh chứng</div>
            <div className="mt-1.5 font-['Open_Sans',sans-serif] text-lg leading-[1.35] font-bold text-(--text-primary)">
              {category.title}
            </div>
          </div>
          <button
            type="button"
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-[rgba(37,99,235,0.3)] bg-transparent text-xl leading-none text-(--gold-bright)"
            onClick={onCancel}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {hasMultipleOptions && (
          <div className="flex flex-col gap-2">
            <label className={fieldLabelClass}>Loại</label>
            <div className="flex flex-wrap gap-2.5">
              {category.pointOptions.map((option) => (
                <label
                  key={option.label}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-[13px] font-bold ${
                    option.label === optionLabel
                      ? 'border-(--gold) bg-[rgba(37,99,235,0.14)] text-(--gold-bright)'
                      : 'border-[rgba(37,99,235,0.3)] text-(--text-secondary)'
                  }`}
                >
                  <input
                    className="accent-(--gold)"
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

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="submission-date">
            Ngày thực hiện <span className={requiredMarkClass}>*</span>
          </label>
          <input
            id="submission-date"
            className={`${fieldInputClass} ${errors.date ? 'border-[#e5876f]' : ''}`}
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
            }}
          />
          {errors.date && <div className={fieldErrorClass}>{errors.date}</div>}
        </div>

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="submission-desc">
            Mô tả / thông tin minh chứng <span className={requiredMarkClass}>*</span>
          </label>
          <textarea
            id="submission-desc"
            className={`min-h-[88px] resize-y ${fieldInputClass} ${errors.description ? 'border-[#e5876f]' : ''}`}
            placeholder="Ví dụ: Dự án, mã booking, tên sự kiện, nhóm khách hàng..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
            }}
          />
          {errors.description && <div className={fieldErrorClass}>{errors.description}</div>}
        </div>

        {isLinkEvidence ? (
          <div className="flex flex-col gap-2">
            <label className={fieldLabelClass} htmlFor="submission-link">
              Link clip minh chứng <span className={requiredMarkClass}>*</span>
            </label>
            <input
              id="submission-link"
              className={`${fieldInputClass} ${errors.link ? 'border-[#e5876f]' : ''}`}
              type="url"
              placeholder="Dán link clip (YouTube, TikTok, Drive, Facebook...)"
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                if (errors.link) setErrors((prev) => ({ ...prev, link: undefined }))
              }}
            />
            {errors.link && <div className={fieldErrorClass}>{errors.link}</div>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className={fieldLabelClass}>
              Ảnh / tệp minh chứng <span className={requiredMarkClass}>*</span>
            </label>
            <label
              className={`flex cursor-pointer items-center justify-center rounded-[10px] border border-dashed p-4.5 text-center text-[13px] text-(--text-tertiary) hover:border-(--gold) hover:text-(--gold-bright) ${
                errors.file ? 'border-[#e5876f]' : 'border-[rgba(37,99,235,0.4)]'
              }`}
            >
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              <span>{file ? file.name : 'Chọn ảnh hoặc tệp minh chứng'}</span>
            </label>
            {errors.file && <div className={fieldErrorClass}>{errors.file}</div>}
          </div>
        )}

        <div className="mt-1 flex justify-end gap-3">
          <button
            type="button"
            className="min-h-11 cursor-pointer rounded-[10px] border border-[rgba(37,99,235,0.3)] bg-transparent px-5 py-[11px] font-['Open_Sans',sans-serif] text-[13.5px] font-bold text-(--text-secondary) transition-[transform,box-shadow,background,border-color] duration-150 hover:border-[rgba(169,127,47,0.5)] hover:bg-[rgba(169,127,47,0.08)]"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="min-h-11 cursor-pointer rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-[11px] font-['Open_Sans',sans-serif] text-[13.5px] font-bold text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow,background,border-color] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]"
          >
            Gửi yêu cầu chấm điểm
          </button>
        </div>
      </form>
    </div>
  )
}
