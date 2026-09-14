import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import UserNavbar from '../components/UserNavbar'
import Footer from '../components/Footer'
import { CameraIcon, CheckCircleIcon } from '../components/icons'
import { CURRENT_USER_NAME } from '../data/currentUser'
import { useSubmissions } from '../context/SubmissionsContext'
import { formatPoints } from '../utils/format'
import '../styles/shared.css'
import './ProfilePage.css'

// Cùng số liệu minh hoạ với UserHomePage — trang này chưa có API thật nên khai báo lại tại chỗ.
const totalPoints = 128
const tierName = 'Hạng Kim Cương'
const nextTierAt = 160

const branchOptions = ['Chi nhánh Hà Nội', 'Chi nhánh Hồ Chí Minh', 'Chi nhánh Đà Nẵng']

export default function ProfilePage() {
  const { submissions } = useSubmissions()
  const myEntries = useMemo(
    () => submissions.filter((s) => s.userName === CURRENT_USER_NAME),
    [submissions],
  )
  const approvedCount = myEntries.filter((s) => s.status === 'approved').length
  const pendingCount = myEntries.filter((s) => s.status === 'pending').length
  const approvalRate = myEntries.length ? Math.round((approvedCount / myEntries.length) * 100) : 0
  const pointsToNextTier = Math.max(0, nextTierAt - totalPoints)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
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
    <div className="dtr-root page-bg">
      <UserNavbar active="profile" />

      <section className="section-head">
        <div className="pill">HỒ SƠ CỦA BẠN</div>
        <h1 className="section-title">Hồ sơ cá nhân</h1>
        <p className="section-caption">Xem thành tích và cập nhật thông tin tài khoản DTR của bạn.</p>
      </section>

      <section className="profile-section">
        <div className="profile-top-card">
          <label className="profile-avatar-wrap">
            {avatarUrl ? (
              <img src={avatarUrl} alt={form.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-fallback">{initials}</div>
            )}
            <span className="profile-avatar-edit">
              <CameraIcon size={14} />
            </span>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>

          <div className="profile-top-info">
            <div className="profile-top-name">{form.name}</div>
            <div className="profile-top-meta">{form.email} · {form.branch}</div>
            <div className="profile-top-meta">Thành viên từ 12/01/2026</div>
          </div>

          <div className="profile-tier-badge">
            {tierName}
            <span className="profile-tier-sub">
              Còn <b className="gold-text">{pointsToNextTier} điểm</b> để lên Hạng Vương Miện
            </span>
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="stat-card">
            <div className="stat-num gold-text">{formatPoints(totalPoints)}</div>
            <div className="stat-label">Tổng điểm DTR</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: 'var(--positive)' }}>
              {approvedCount}
            </div>
            <div className="stat-label">Minh chứng đã duyệt</div>
          </div>
          <div className="stat-card">
            <div className="stat-num gold-text">{pendingCount}</div>
            <div className="stat-label">Đang chờ duyệt</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: 'var(--text-primary)' }}>
              {approvalRate}%
            </div>
            <div className="stat-label">Tỷ lệ được duyệt</div>
          </div>
        </div>

        <div className="profile-grid">
          <form className="profile-card" onSubmit={handleSaveProfile}>
            <div className="profile-card-title">Thông tin tài khoản</div>

            <div className="profile-form-grid">
              <div className="field">
                <label className="field-label" htmlFor="profile-name">
                  Họ và tên
                </label>
                <input
                  id="profile-name"
                  className="field-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="profile-phone">
                  Số điện thoại
                </label>
                <input
                  id="profile-phone"
                  className="field-input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                className="field-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="profile-branch">
                Chi nhánh
              </label>
              <select
                id="profile-branch"
                className="field-input"
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
              >
                {branchOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-card-actions">
              {savedNote && (
                <span className="profile-saved-note">
                  <CheckCircleIcon size={16} /> Đã lưu thay đổi
                </span>
              )}
              <button type="submit" className="btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>

          <form className="profile-card" onSubmit={handleChangePassword}>
            <div className="profile-card-title">Đổi mật khẩu</div>

            <div className="field">
              <label className="field-label" htmlFor="pw-current">
                Mật khẩu hiện tại
              </label>
              <input
                id="pw-current"
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="pw-next">
                Mật khẩu mới
              </label>
              <input
                id="pw-next"
                className="field-input"
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={pwForm.next}
                onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="pw-confirm">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="pw-confirm"
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                required
              />
            </div>

            {pwError && <div className="field-error">{pwError}</div>}

            <div className="profile-card-actions">
              {pwSaved && (
                <span className="profile-saved-note">
                  <CheckCircleIcon size={16} /> Đã đổi mật khẩu
                </span>
              )}
              <button type="submit" className="btn-primary">
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
