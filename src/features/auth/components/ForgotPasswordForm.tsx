import { useState, type FormEvent } from 'react'
import { authFieldStyles } from './authStyles'

const { fieldInputClass, fieldLabelClass, authSubmitClass, authLinkBtnClass } = authFieldStyles

type ForgotPasswordFormProps = {
  onSubmit: (e: FormEvent) => void
  onBackToLogin: () => void
}

export default function ForgotPasswordForm({ onSubmit, onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="forgot-email">
          Email
        </label>
        <input
          id="forgot-email"
          className={fieldInputClass}
          type="email"
          placeholder="ban@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Submit */}
      <button type="submit" className={authSubmitClass}>
        Gửi liên kết đặt lại
      </button>

      {/* Back Link */}
      <p className="text-center text-sm text-[var(--text-muted)]">
        Nhớ ra mật khẩu rồi?{' '}
        <button type="button" className={authLinkBtnClass} onClick={onBackToLogin}>
          Đăng nhập
        </button>
      </p>
    </form>
  )
}
