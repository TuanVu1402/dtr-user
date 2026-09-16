import { type FormEvent } from 'react'
import { PersonIcon } from '@/components/icons/feature'
import { roleLabels, type Role } from '@/types/dtr'
import { authFieldStyles } from './authStyles'

const { fieldInputClass, fieldLabelClass, authSubmitClass, authLinkBtnClass } = authFieldStyles

const quickRoles: { role: Role; icon: typeof PersonIcon }[] = [{ role: 'user', icon: PersonIcon }]

type LoginFormProps = {
  onSubmit: (e: FormEvent) => void
  onQuickLogin: (role: Role) => void
  onForgotPassword: () => void
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSubmit, onQuickLogin, onForgotPassword, onSwitchToRegister }: LoginFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
        {quickRoles.map(({ role, icon: Icon }) => (
          <button
            key={role}
            type="button"
            className="flex min-h-11 items-center gap-2 rounded-[10px] border border-[rgba(37,99,235,0.28)] bg-(--surface-tint) px-3 py-[11px] text-left font-['Open_Sans',sans-serif] text-[12.5px] font-bold text-(--text-primary) transition-[transform,box-shadow,background,border-color] duration-150 hover:-translate-y-0.5 hover:border-(--gold) hover:bg-[rgba(37,99,235,0.12)] hover:shadow-[0_8px_18px_var(--shadow)]"
            onClick={() => onQuickLogin(role)}
          >
            <Icon size={18} />
            Vào với tài khoản {roleLabels[role]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[11px] font-bold tracking-[1px] text-(--text-muted) before:h-px before:flex-1 before:bg-[rgba(37,99,235,0.18)] before:content-[''] after:h-px after:flex-1 after:bg-[rgba(37,99,235,0.18)] after:content-['']">
        <span>HOẶC ĐĂNG NHẬP THỦ CÔNG</span>
      </div>

      <form className="flex flex-col gap-4.5" onSubmit={onSubmit}>
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="login-email">
            Email
          </label>
          <input id="login-email" className={fieldInputClass} type="email" placeholder="ban@dtr.vn" required />
        </div>

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

        <div className="-mt-1.5 flex flex-wrap items-center justify-between gap-2.5">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-(--text-secondary)">
            <input type="checkbox" className="accent-(--gold)" />
            Ghi nhớ đăng nhập
          </label>
          <button type="button" className={authLinkBtnClass} onClick={onForgotPassword}>
            Quên mật khẩu?
          </button>
        </div>

        <button type="submit" className={authSubmitClass}>
          Đăng nhập
        </button>

        <p className="m-0 text-center text-[13.5px] text-(--text-tertiary)">
          Chưa có tài khoản?{' '}
          <button type="button" className={authLinkBtnClass} onClick={onSwitchToRegister}>
            Đăng ký ngay
          </button>
        </p>
      </form>
    </>
  )
}
