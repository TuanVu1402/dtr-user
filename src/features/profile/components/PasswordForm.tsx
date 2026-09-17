import { useState, type FormEvent } from 'react'
import { CheckCircleIcon } from '@/components'
import { profileFieldStyles } from './profileStyles'

const { fieldInputClass, fieldLabelClass, btnPrimaryClass } = profileFieldStyles

type PasswordFormProps = {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export default function PasswordForm({ open, onClose, onSave }: PasswordFormProps) {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaved, setPwSaved] = useState(false)

  function closeForm() {
    setPwError(null)
    setPwForm({ current: '', next: '', confirm: '' })
    onClose()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setPwSaved(false)
    if (pwForm.next.length < 6) {
      setPwError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('Xác nhận mật khẩu không khớp.')
      return
    }
    setPwError(null)
    onSave()
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    window.setTimeout(() => {
      setPwSaved(false)
      onClose()
    }, 1500)
  }

  if (!open) return null

  return (
    <form className={`${profileFieldStyles.profileCardClass} flex flex-col gap-4`} onSubmit={handleSubmit}>
      <div className="text-base font-extrabold text-(--text-primary)">Đổi mật khẩu</div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="pw-current">
          Mật khẩu hiện tại
        </label>
        <input
          id="pw-current"
          className={fieldInputClass}
          type="password"
          placeholder="••••••••"
          value={pwForm.current}
          onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="pw-next">
          Mật khẩu mới
        </label>
        <input
          id="pw-next"
          className={fieldInputClass}
          type="password"
          placeholder="Ít nhất 6 ký tự"
          value={pwForm.next}
          onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="pw-confirm">
          Xác nhận mật khẩu mới
        </label>
        <input
          id="pw-confirm"
          className={fieldInputClass}
          type="password"
          placeholder="••••••••"
          value={pwForm.confirm}
          onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
          required
        />
      </div>

      {pwError && <div className="text-[12.5px] text-[#e5876f]">{pwError}</div>}

      <div className="mt-1 flex items-center justify-end gap-3.5 lg:justify-between">
        <button
          type="button"
          className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-2)] md:text-base"
          onClick={closeForm}
        >
          Hủy
        </button>
        <div className="flex items-center gap-3">
          {pwSaved && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-(--positive)">
              <CheckCircleIcon size={16} /> Đã đổi mật khẩu
            </span>
          )}
          <button type="submit" className={btnPrimaryClass}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </form>
  )
}
