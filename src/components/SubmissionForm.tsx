import { useState, type FormEvent } from 'react'
import type { Category } from '../types/dtr'
import { formatPoints } from '../utils/format'
import '../styles/shared.css'
import './SubmissionForm.css'

type SubmissionFormProps = {
  category: Category
  onCancel: () => void
  onSubmit: (data: { optionLabel: string; points: number; description: string; date: string; link?: string }) => void
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
    })
  }

  return (
    <div className="form-overlay" onClick={onCancel}>
      <form className="form-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <div className="form-eyebrow">Nộp minh chứng</div>
            <div className="form-title">{category.title}</div>
          </div>
          <button type="button" className="form-close" onClick={onCancel} aria-label="Đóng">
            ×
          </button>
        </div>

        {hasMultipleOptions && (
          <div className="field">
            <label className="field-label">Loại</label>
            <div className="option-row">
              {category.pointOptions.map((option) => (
                <label
                  key={option.label}
                  className={`option-pill${option.label === optionLabel ? ' active' : ''}`}
                >
                  <input
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

        <div className="field">
          <label className="field-label" htmlFor="submission-date">
            Ngày thực hiện <span className="required-mark">*</span>
          </label>
          <input
            id="submission-date"
            className={`field-input${errors.date ? ' has-error' : ''}`}
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
            }}
          />
          {errors.date && <div className="field-error">{errors.date}</div>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="submission-desc">
            Mô tả / thông tin minh chứng <span className="required-mark">*</span>
          </label>
          <textarea
            id="submission-desc"
            className={`field-input field-textarea${errors.description ? ' has-error' : ''}`}
            placeholder="Ví dụ: Dự án, mã booking, tên sự kiện, nhóm khách hàng..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
            }}
          />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </div>

        {isLinkEvidence ? (
          <div className="field">
            <label className="field-label" htmlFor="submission-link">
              Link clip minh chứng <span className="required-mark">*</span>
            </label>
            <input
              id="submission-link"
              className={`field-input${errors.link ? ' has-error' : ''}`}
              type="url"
              placeholder="Dán link clip (YouTube, TikTok, Drive, Facebook...)"
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                if (errors.link) setErrors((prev) => ({ ...prev, link: undefined }))
              }}
            />
            {errors.link && <div className="field-error">{errors.link}</div>}
          </div>
        ) : (
          <div className="field">
            <label className="field-label">
              Ảnh / tệp minh chứng <span className="required-mark">*</span>
            </label>
            <label className={`upload-box${errors.file ? ' has-error' : ''}`}>
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null)
                  if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }))
                }}
              />
              <span className="upload-text">{file ? file.name : 'Chọn ảnh hoặc tệp minh chứng'}</span>
            </label>
            {errors.file && <div className="field-error">{errors.file}</div>}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Gửi yêu cầu chấm điểm
          </button>
        </div>
      </form>
    </div>
  )
}
