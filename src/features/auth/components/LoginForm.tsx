import { type FormEvent } from 'react'
import { authFieldStyles } from './authStyles'

const { fieldInputClass, fieldLabelClass, authSubmitClass, authLinkBtnClass } = authFieldStyles

type LoginFormProps = {
  onSubmit: (e: FormEvent) => void
  onQuickLogin: (role: 'user') => void
  onForgotPassword: () => void
}

export default function LoginForm({ onSubmit, onQuickLogin, onForgotPassword }: LoginFormProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {/* Quick Login */}
      <button
        type="button"
        className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] py-2.5 text-sm font-medium text-[var(--text-secondary)]"
        onClick={() => onQuickLogin('user')}
      >
        Đăng nhập nhanh (Demo)
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <div className="h-px flex-1 bg-[var(--hairline)]" />
        <span>hoặc</span>
        <div className="h-px flex-1 bg-[var(--hairline)]" />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className={fieldInputClass}
          type="email"
          placeholder="ban@email.com"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="login-password">
          Mật khẩu
        </label>
        <input
          id="login-password"
          className={fieldInputClass}
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" className="accent-[var(--gold)]" />
          Ghi nhớ
        </label>
        <button type="button" className={authLinkBtnClass} onClick={onForgotPassword}>
          <span className="text-sm">Quên mật khẩu</span>
        </button>
      </div>

      {/* Submit */}
      <button type="submit" className={authSubmitClass}>
        Đăng nhập
      </button>
    </form>
  )
}
