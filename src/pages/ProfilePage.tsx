import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import UserNavbar from '../components/UserNavbar'
import Footer from '../components/Footer'
import { CameraIcon, CheckCircleIcon } from '../components/icons'
import { CURRENT_USER_NAME } from '../data/currentUser'
import { useSubmissions } from '../context/SubmissionsContext'
import { formatPoints } from '../utils/format'

// Cùng số liệu minh hoạ với UserHomePage — trang này chưa có API thật nên khai báo lại tại chỗ.
const totalPoints = 128
const tierName = 'Hạng Kim Cương'
const nextTierAt = 160

const branchOptions = ['Chi nhánh Hà Nội', 'Chi nhánh Hồ Chí Minh', 'Chi nhánh Đà Nẵng']

const fieldInputClass =
  "w-full rounded-[10px] border border-[rgba(37,99,235,0.25)] bg-(--surface-tint) px-3.5 py-[11px] font-['Open_Sans',sans-serif] text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--gold) focus:outline-none"
const fieldLabelClass = 'text-[12.5px] font-bold text-(--text-secondary)'
const btnPrimaryClass =
  "min-h-11 cursor-pointer rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-[11px] font-['Open_Sans',sans-serif] text-[13.5px] font-bold text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow,background,border-color] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]"
const statCardClass =
  'rounded-2xl border border-[rgba(37,99,235,0.16)] bg-(--surface-1) px-5.5 py-5 shadow-[0_4px_14px_var(--shadow)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_28px_var(--shadow-strong)]'
const profileCardClass =
  'flex flex-col gap-4 rounded-2xl border border-[rgba(37,99,235,0.16)] bg-(--surface-1) p-6.5 shadow-[0_8px_24px_var(--shadow)]'

export default function ProfilePage() {
  const { submissions, users } = useSubmissions()
  const myEntries = useMemo(
    () => submissions.filter((s) => s.userName === CURRENT_USER_NAME),
    [submissions],
  )
  const approvedCount = myEntries.filter((s) => s.status === 'approved').length
  const pendingCount = myEntries.filter((s) => s.status === 'pending').length
  const approvalRate = myEntries.length ? Math.round((approvedCount / myEntries.length) * 100) : 0
  const pointsToNextTier = Math.max(0, nextTierAt - totalPoints)

  const currentUser = users.find((u) => u.name === CURRENT_USER_NAME)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.avatarUrl ?? null)
  const [form, setForm] = useState({
    name: CURRENT_USER_NAME,
    email: 'an.nguyen@dtr.vn',
    phone: '0909 123 456',
    branch: branchOptions[0],
  })
  const [savedNote, setSavedNote] = useState(false)

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaved, setPwSaved] = useState(false)

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUrl(URL.createObjectURL(file))
  }

  function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    // Demo — lưu tạm ở state, chưa nối API cập nhật hồ sơ thật.
    setSavedNote(true)
    window.setTimeout(() => setSavedNote(false), 3000)
  }

  function handleChangePassword(e: FormEvent) {
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
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    window.setTimeout(() => setPwSaved(false), 3000)
  }

  const initials = form.name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-svh bg-[radial-gradient(1100px_480px_at_85%_-10%,var(--bg-glow),transparent_60%),linear-gradient(180deg,var(--bg-1)_0%,var(--bg-2)_40%,var(--bg-3)_100%)] pb-14 text-(--text-primary)">
      <UserNavbar active="profile" />

      <section className="flex flex-col items-start gap-3.5 px-11 pt-10 max-[900px]:px-6 max-[640px]:px-5">
        <div className="inline-flex items-center rounded-full bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-2 font-['Open_Sans',sans-serif] text-xs font-extrabold tracking-[1.6px] text-(--on-gold)">
          HỒ SƠ CỦA BẠN
        </div>
        <h1 className="m-0 font-['Open_Sans',sans-serif] text-[30px] font-extrabold tracking-[0.5px] text-(--text-primary)">
          Hồ sơ cá nhân
        </h1>
        <p className="m-0 text-sm font-medium text-(--text-tertiary)">
          Xem thành tích và cập nhật thông tin tài khoản DTR của bạn.
        </p>
      </section>

      <section className="flex flex-col gap-5 px-11 pt-6.5 max-[640px]:px-5">
        <div className="relative flex flex-wrap items-center gap-5 overflow-hidden rounded-[18px] border border-[rgba(37,99,235,0.28)] bg-(--surface-1) px-7.5 py-6.5 shadow-[0_16px_36px_var(--shadow)] before:pointer-events-none before:absolute before:-top-[120px] before:-right-[100px] before:h-[280px] before:w-[280px] before:rounded-full before:bg-[radial-gradient(circle,rgba(169,127,47,0.16),transparent_70%)] before:content-[''] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.1),color-mix(in_srgb,var(--surface-1)_40%,transparent))]">
          <label className="relative h-[76px] w-[76px] shrink-0 cursor-pointer">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={form.name}
                className="h-[76px] w-[76px] rounded-full border-2 border-[rgba(37,99,235,0.4)] object-cover"
              />
            ) : (
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold),var(--gold-deep))] font-['Open_Sans',sans-serif] text-2xl font-extrabold text-(--on-gold)">
                {initials}
              </div>
            )}
            <span className="absolute -right-0.5 -bottom-0.5 flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-(--surface-1) bg-(--gold) text-(--on-gold)">
              <CameraIcon size={14} />
            </span>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>

          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <div className="font-['Open_Sans',sans-serif] text-[19px] font-extrabold text-(--text-primary)">
              {form.name}
            </div>
            <div className="text-[13px] text-(--text-tertiary)">
              {form.email} · {form.branch}
            </div>
            <div className="text-[13px] text-(--text-tertiary)">Thành viên từ 12/01/2026</div>
          </div>

          <div className="flex flex-col items-end gap-1 rounded-xl border border-[rgba(37,99,235,0.4)] bg-[rgba(37,99,235,0.14)] px-4.5 py-2.5 font-['Open_Sans',sans-serif] text-sm font-extrabold whitespace-nowrap text-(--gold-bright) max-[640px]:items-start">
            {tierName}
            <span className="font-['Open_Sans',sans-serif] text-[11.5px] font-semibold text-(--text-tertiary)">
              Còn <b className="text-(--gold-bright)">{pointsToNextTier} điểm</b> để lên Hạng Vương Miện
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 max-[720px]:grid-cols-2">
          <div className={statCardClass}>
            <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--gold-bright)">
              {formatPoints(totalPoints)}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Tổng điểm DTR</div>
          </div>
          <div className={statCardClass}>
            <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--positive)">
              {approvedCount}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Minh chứng đã duyệt</div>
          </div>
          <div className={statCardClass}>
            <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--gold-bright)">
              {pendingCount}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Đang chờ duyệt</div>
          </div>
          <div className={statCardClass}>
            <div className="font-['Open_Sans',sans-serif] text-[28px] font-extrabold text-(--text-primary)">
              {approvalRate}%
            </div>
            <div className="mt-1 text-[13px] font-semibold text-(--text-tertiary)">Tỷ lệ được duyệt</div>
          </div>
        </div>

        <div className="grid grid-cols-2 items-start gap-5 max-[960px]:grid-cols-1">
          <form className={profileCardClass} onSubmit={handleSaveProfile}>
            <div className="font-['Open_Sans',sans-serif] text-base font-extrabold text-(--text-primary)">
              Thông tin tài khoản
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

          <form className={profileCardClass} onSubmit={handleChangePassword}>
            <div className="font-['Open_Sans',sans-serif] text-base font-extrabold text-(--text-primary)">
              Đổi mật khẩu
            </div>

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

            <div className="mt-1 flex items-center justify-end gap-3.5">
              {pwSaved && (
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-(--positive)">
                  <CheckCircleIcon size={16} /> Đã đổi mật khẩu
                </span>
              )}
              <button type="submit" className={btnPrimaryClass}>
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
