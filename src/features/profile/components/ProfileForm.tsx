import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CameraIcon, CheckCircleIcon } from '@/components'
import { profileFieldStyles } from './profileStyles'

const { fieldInputClass, fieldLabelClass, btnPrimaryClass } = profileFieldStyles

const branchOptions = ['Chi nhánh Hà Nội', 'Chi nhánh Hồ Chí Minh', 'Chi nhánh Đà Nẵng']

type ProfileFormProps = {
  initialName: string
  initialEmail: string
  initialPhone: string
  initialBranch: string
  avatarUrl: string | null
  onAvatarChange: (url: string) => void
  onSave: (data: { name: string; email: string; phone: string; branch: string }) => void
}

export default function ProfileForm({
  initialName,
  initialEmail,
  initialPhone,
  initialBranch,
  avatarUrl,
  onAvatarChange,
  onSave,
}: ProfileFormProps) {
  const [form, setForm] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    branch: initialBranch,
  })
  const [savedNote, setSavedNote] = useState(false)

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onAvatarChange(url)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSave(form)
    setSavedNote(true)
    window.setTimeout(() => setSavedNote(false), 3000)
  }

  const initials = form.name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <form className={profileFieldStyles.profileCardClass} onSubmit={handleSubmit}>
      <div className="flex items-center gap-4">
        <label className="relative h-[76px] w-[76px] shrink-0 cursor-pointer">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={form.name}
              className="h-[76px] w-[76px] rounded-full border-2 border-[rgba(37,99,235,0.4)] object-cover"
            />
          ) : (
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))]  text-2xl font-extrabold text-(--on-gold)">
              {initials}
            </div>
          )}
          <span className="absolute -right-0.5 -bottom-0.5 flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-(--surface-1) bg-(--gold) text-(--on-gold)">
            <CameraIcon size={14} />
          </span>
          <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </label>
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <div className=" text-[19px] font-extrabold text-(--text-primary)">
            {form.name}
          </div>
          <div className="text-[13px] text-(--text-tertiary)">
            {form.email} · {form.branch}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1">
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="profile-name">
            Họ và tên
          </label>
          <input
            id="profile-name"
            className={fieldInputClass}
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="profile-phone">
            Số điện thoại
          </label>
          <input
            id="profile-phone"
            className={fieldInputClass}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="profile-email">
          Email
        </label>
        <input
          id="profile-email"
          className={fieldInputClass}
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="profile-branch">
          Chi nhánh
        </label>
        <select
          id="profile-branch"
          className={`cursor-pointer ${fieldInputClass}`}
          value={form.branch}
          onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
        >
          {branchOptions.map((b) => (
            <option key={b} value={b} className="bg-[#fdf8ec] text-[#0d1f3d]">
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-1 flex items-center justify-end gap-3.5">
        {savedNote && (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-(--positive)">
            <CheckCircleIcon size={16} /> Đã lưu thay đổi
          </span>
        )}
        <button type="submit" className={btnPrimaryClass}>
          Lưu thay đổi
        </button>
      </div>
    </form>
  )
}
