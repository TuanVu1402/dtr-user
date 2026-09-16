import { type FormEvent } from 'react'
import { authFieldStyles } from './authStyles'

const { fieldInputClass, fieldLabelClass, authSubmitClass, authLinkBtnClass } = authFieldStyles

type RegisterFormProps = {
  onSubmit: (e: FormEvent) => void
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSubmit, onSwitchToLogin }: RegisterFormProps) {
  return (
    <form className="flex flex-col gap-4.5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="register-name">
          Họ và tên
        </label>
        <input
          id="register-name"
          className={fieldInputClass}
          type="text"
          placeholder="Nguyễn An"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          className={fieldInputClass}
          type="email"
          placeholder="ban@dtr.vn"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabelClass} htmlFor="register-phone">
          Số điện thoại
        </label>
        <input
          id="register-phone"
          className={fieldInputClass}
          type="tel"
          placeholder="09xx xxx xxx"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-[480px]:grid-cols-1">
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="register-password">
            Mật khẩu
          </label>
          <input
            id="register-password"
            className={fieldInputClass}
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="register-password-confirm">
            Xác nhận mật khẩu
          </label>
          <input
            id="register-password-confirm"
            className={fieldInputClass}
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button type="submit" className={authSubmitClass}>
        Tạo tài khoản
      </button>

      <p className="m-0 text-center text-[13.5px] text-(--text-tertiary)">
        Đã có tài khoản?{' '}
        <button type="button" className={authLinkBtnClass} onClick={onSwitchToLogin}>
          Đăng nhập
        </button>
      </p>
    </form>
  )
}
