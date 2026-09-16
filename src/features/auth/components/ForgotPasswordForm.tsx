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
    <form className="flex flex-col gap-4.5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="forgot-email">
          Email
        </label>
        <input
          id="forgot-email"
          className={fieldInputClass}
          type="email"
          placeholder="ban@dtr.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={authSubmitClass}>
        Gửi liên kết đặt lại mật khẩu
      </button>

      <p className="m-0 text-center text-[13.5px] text-(--text-tertiary)">
        Nhớ ra mật khẩu rồi?{' '}
        <button type="button" className={authLinkBtnClass} onClick={onBackToLogin}>
          Quay lại đăng nhập
        </button>
      </p>
    </form>
  )
}
