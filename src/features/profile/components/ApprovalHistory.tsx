import { useMemo, useState, type FormEvent } from 'react'
import { CameraIcon, CloseIcon, StatusBadge } from '@/components'
import { useSubmissions } from '@/context/SubmissionsContext'
import { formatPoints } from '@/utils/format'
import { parseViDate } from '@/utils/ranking'
import type { AdminSubmission, SubmissionStatus } from '@/types/dtr'
import { profileFieldStyles } from './profileStyles'

type ApprovalHistoryProps = {
  entries: AdminSubmission[]
}

type HistoryFilter = 'all' | 'approved' | 'pending' | 'rejected'

const filters: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'rejected', label: 'Từ chối' },
]

function statusTitle(status: SubmissionStatus) {
  if (status === 'approved') return 'Đã duyệt'
  if (status === 'pending') return 'Chờ duyệt'
  return 'Từ chối'
}

export default function ApprovalHistory({ entries }: ApprovalHistoryProps) {
  const { submitAppeal, updatePendingEvidence } = useSubmissions()
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [selected, setSelected] = useState<AdminSubmission | null>(null)
  const [appealNote, setAppealNote] = useState('')
  const [appealImage, setAppealImage] = useState<string | undefined>()
  const [appealSent, setAppealSent] = useState(false)
  const [pendingImage, setPendingImage] = useState<string | undefined>()
  const [pendingSaved, setPendingSaved] = useState(false)

  const sorted = useMemo(
    () =>
      [...entries].sort((a, b) => {
        const dateA = parseViDate(a.date)?.getTime() ?? 0
        const dateB = parseViDate(b.date)?.getTime() ?? 0
        return dateB - dateA
      }),
    [entries],
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted
    return sorted.filter((entry) => entry.status === filter)
  }, [sorted, filter])

  const selectedLive = selected ? sorted.find((entry) => entry.id === selected.id) ?? selected : null
  const canAppeal = selectedLive?.status === 'rejected' && !selectedLive.appealedAt
  const canUpdatePending = selectedLive?.status === 'pending'
  const pendingPreview = pendingImage || selectedLive?.imageDataUrl

  function openEntry(entry: AdminSubmission) {
    setSelected(entry)
    setAppealNote('')
    setAppealImage(undefined)
    setAppealSent(false)
    setPendingImage(undefined)
    setPendingSaved(false)
  }

  function closeDetail() {
    setSelected(null)
    setAppealNote('')
    setAppealImage(undefined)
    setAppealSent(false)
    setPendingImage(undefined)
    setPendingSaved(false)
  }

  function handleAppeal(event: FormEvent) {
    event.preventDefault()
    if (!selectedLive || !appealNote.trim()) return
    submitAppeal(selectedLive.id, appealNote.trim(), appealImage)
    setAppealSent(true)
  }

  function handleUpdatePending(event: FormEvent) {
    event.preventDefault()
    if (!selectedLive || !pendingImage) return
    updatePendingEvidence(selectedLive.id, pendingImage)
    setPendingSaved(true)
    setPendingImage(undefined)
  }

  function readPickedImage(file: File | undefined, onLoad: (url: string) => void) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onLoad(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={profileFieldStyles.profileCardClass}>
      <h3 className="mb-3 text-sm font-medium text-[var(--text-secondary)] md:mb-4 md:text-base">
        Lịch sử duyệt điểm
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm ${
              filter === item.value
                ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--on-gold)]'
                : 'border-[var(--hairline)] bg-[var(--surface-1)] text-[var(--text-secondary)]'
            }`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">
          {filter === 'all' ? 'Chưa có minh chứng nào được ghi nhận.' : 'Không có mục phù hợp bộ lọc.'}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-[var(--hairline)] p-0">
          {filtered.map((entry) => (
            <li className="py-3 first:pt-0 last:pb-0" key={entry.id}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-start gap-3 text-left md:items-center md:gap-4"
                onClick={() => openEntry(entry)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="m-0 text-sm font-semibold text-[var(--text-primary)] md:text-base">
                      {entry.categoryLabel}
                    </p>
                    <StatusBadge status={entry.status} />
                  </div>
                  <p className="mt-1 m-0 text-xs leading-snug text-[var(--text-tertiary)] md:text-sm">
                    {entry.description}
                  </p>
                  {entry.status === 'rejected' && entry.rejectReason ? (
                    <p className="mt-1 m-0 text-xs text-[var(--negative)]">Lý do: {entry.rejectReason}</p>
                  ) : null}
                  <p className="mt-1 m-0 text-[11px] text-[var(--text-muted)]">{entry.date}</p>
                </div>
                <div
                  className={`shrink-0 text-right text-sm font-bold md:text-base ${
                    entry.status === 'approved'
                      ? 'text-[var(--gold-bright)]'
                      : entry.status === 'rejected'
                        ? 'text-[var(--negative)]'
                        : 'text-[var(--text-muted)]'
                  }`}
                >
                  {entry.status === 'approved' ? '+' : ''}
                  {formatPoints(entry.points)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedLive ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--scrim)] p-0 md:items-center md:p-4"
          onClick={closeDetail}
        >
          <div
            className="flex max-h-[92svh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5 md:rounded-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-labelledby="approval-detail-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 id="approval-detail-title" className="m-0 text-base font-semibold text-[var(--text-primary)]">
                  {selectedLive.categoryLabel}
                </h4>
                <p className="mt-1 m-0 text-xs text-[var(--text-muted)]">{selectedLive.date}</p>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
                aria-label="Đóng"
                onClick={closeDetail}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Trạng thái:</span>
              <StatusBadge status={selectedLive.status} />
            </div>

            <p className="m-0 text-sm text-[var(--text-primary)]">{selectedLive.description}</p>

            {selectedLive.link ? (
              <a
                href={selectedLive.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-[var(--gold)] underline"
              >
                Xem minh chứng
              </a>
            ) : null}

            {pendingPreview ? (
              <img
                src={pendingPreview}
                alt="Minh chứng"
                className="max-h-72 w-full rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] object-contain"
              />
            ) : null}

            {canUpdatePending ? (
              <form className="flex flex-col gap-3" onSubmit={handleUpdatePending}>
                <p className="m-0 text-sm text-[var(--text-secondary)]">
                  Minh chứng đang chờ duyệt — bạn có thể đổi ảnh rồi cập nhật lại.
                </p>
                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[var(--hairline)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
                  <CameraIcon size={16} />
                  {pendingPreview ? 'Đổi ảnh minh chứng' : 'Thêm ảnh minh chứng'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      readPickedImage(event.target.files?.[0], (url) => {
                        setPendingImage(url)
                        setPendingSaved(false)
                      })
                      event.target.value = ''
                    }}
                  />
                </label>
                {pendingImage ? (
                  <button
                    type="button"
                    className="self-start text-xs font-medium text-[var(--negative)]"
                    onClick={() => setPendingImage(undefined)}
                  >
                    Hủy ảnh mới
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!pendingImage}
                  className="rounded-lg bg-[var(--gold)] py-2.5 text-sm font-semibold text-[var(--on-gold)] hover:bg-[var(--gold-deep)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Cập nhật minh chứng
                </button>
                {pendingSaved ? (
                  <p className="m-0 text-sm font-medium text-[var(--positive)]">
                    Đã cập nhật ảnh. Minh chứng vẫn đang chờ duyệt.
                  </p>
                ) : null}
              </form>
            ) : null}

            <p
              className={`m-0 text-right text-base font-bold ${
                selectedLive.status === 'approved'
                  ? 'text-[var(--gold-bright)]'
                  : selectedLive.status === 'rejected'
                    ? 'text-[var(--negative)]'
                    : 'text-[var(--text-muted)]'
              }`}
            >
              {selectedLive.status === 'approved' ? '+' : ''}
              {formatPoints(selectedLive.points)} điểm
            </p>

            {selectedLive.status === 'rejected' && (
              <p className="m-0 rounded-lg bg-[rgba(217,122,108,0.12)] px-3 py-2 text-sm text-[var(--negative)]">
                Lý do từ chối: {selectedLive.rejectReason || 'Minh chứng chưa đạt yêu cầu.'}
              </p>
            )}

            {selectedLive.appealedAt ? (
              <div className="rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] px-3 py-2">
                <p className="m-0 text-xs font-semibold text-[var(--text-secondary)]">
                  Đã gửi kháng cáo · {selectedLive.appealedAt}
                </p>
                <p className="mt-1 m-0 text-sm text-[var(--text-primary)]">{selectedLive.appealNote}</p>
                {selectedLive.appealImageDataUrl ? (
                  <img
                    src={selectedLive.appealImageDataUrl}
                    alt="Ảnh kháng cáo"
                    className="mt-2 max-h-32 rounded-lg object-contain"
                  />
                ) : null}
              </div>
            ) : null}

            {canAppeal && !appealSent ? (
              <form className="flex flex-col gap-3" onSubmit={handleAppeal}>
                <label className="text-sm font-medium text-[var(--text-secondary)]" htmlFor="appeal-note">
                  Kháng cáo
                </label>
                <textarea
                  id="appeal-note"
                  className="min-h-[88px] resize-y rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none"
                  placeholder="Giải thích và bổ sung minh chứng để được xem xét lại..."
                  value={appealNote}
                  onChange={(event) => setAppealNote(event.target.value)}
                  required
                />
                {appealImage ? (
                  <div className="flex items-start gap-3">
                    <img src={appealImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <button
                      type="button"
                      className="text-xs font-medium text-[var(--negative)]"
                      onClick={() => setAppealImage(undefined)}
                    >
                      Gỡ ảnh
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[var(--hairline)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                    <CameraIcon size={16} />
                    Đính kèm hình ảnh
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        readPickedImage(file, setAppealImage)
                        event.target.value = ''
                      }}
                    />
                  </label>
                )}
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--gold)] py-2.5 text-sm font-semibold text-[var(--on-gold)] hover:bg-[var(--gold-deep)]"
                >
                  Gửi kháng cáo
                </button>
              </form>
            ) : null}

            {appealSent ? (
              <p className="m-0 text-sm font-medium text-[var(--positive)]">
                Đã gửi kháng cáo. Minh chứng chuyển sang {statusTitle('pending').toLowerCase()}.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
