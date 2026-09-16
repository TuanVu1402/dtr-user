import { useState, type FormEvent } from 'react'
import { MoonIcon, SunIcon, BrandLogo } from '@/components'
import { useTheme } from '@/context/ThemeContext'
import { type Role } from '@/types/dtr'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'

type AuthTab = 'login' | 'register' | 'forgot'

type AuthPageProps = {
  onAuthenticated: (role: Role) => void
}

export default function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [tab, setTab] = useState<AuthTab>('login')
  const [resetSent, setResetSent] = useState(false)
  const { theme, toggleTheme } = useTheme()

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    onAuthenticated('user')
  }

  function handleRegister(e: FormEvent) {
    e.preventDefault()
    onAuthenticated('user')
  }

  function handleForgotPassword(e: FormEvent) {
    e.preventDefault()
    setResetSent(true)
  }

  function backToLogin() {
    setTab('login')
    setResetSent(false)
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-[radial-gradient(1100px_480px_at_85%_-10%,var(--bg-glow),transparent_60%),linear-gradient(180deg,var(--bg-1)_0%,var(--bg-2)_40%,var(--bg-3)_100%)] px-5 py-10 text-(--text-primary)">
      <button
        type="button"
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(37,99,235,0.22)] bg-[rgba(37,99,235,0.08)] text-(--gold)"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="flex w-full max-w-[420px] flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-1.5">
          <BrandLogo height={56} />
        </div>

        <div className="flex w-full flex-col gap-5.5 rounded-xl border border-[rgba(37,99,235,0.28)] bg-(--surface-1) p-8 shadow-[0_30px_60px_var(--shadow)] dark:bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface-1)_60%,transparent),color-mix(in_srgb,var(--surface-2)_60%,transparent))]">
          {tab === 'forgot' ? (
            <div className="flex flex-col gap-2">
              <h1 className="m-0 font-['Open_Sans',sans-serif] text-[22px] font-extrabold text-(--text-primary)">
                Quên mật khẩu
              </h1>
              <p className="m-0 text-[13.5px] leading-[1.55] text-(--text-tertiary)">
                Nhập email đã đăng ký, mình sẽ gửi liên kết đặt lại mật khẩu cho bạn.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="m-0 font-['Open_Sans',sans-serif] text-[22px] font-extrabold text-(--text-primary)">
                Chào mừng bạn quay lại
              </h1>
              <p className="m-0 text-[13.5px] leading-[1.55] text-(--text-tertiary)">
                Đăng nhập để nộp minh chứng, theo dõi điểm DTR và nhận thông báo mới nhất.
              </p>
            </div>
          )}

          {tab !== 'forgot' && (
            <div className="flex rounded-full border border-[rgba(37,99,235,0.2)] bg-(--surface-tint) p-1.5">
              <button
                type="button"
                className={`flex-1 cursor-pointer rounded-full border-none p-2.5 font-['Open_Sans',sans-serif] text-[13.5px] font-bold ${
                  tab === 'login' ? 'bg-(--gold) text-(--on-gold)' : 'bg-transparent text-(--text-secondary)'
                }`}
                onClick={() => setTab('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={`flex-1 cursor-pointer rounded-full border-none p-2.5 font-['Open_Sans',sans-serif] text-[13.5px] font-bold ${
                  tab === 'register' ? 'bg-(--gold) text-(--on-gold)' : 'bg-transparent text-(--text-secondary)'
                }`}
                onClick={() => setTab('register')}
              >
                Đăng ký
              </button>
            </div>
          )}

          {tab === 'login' ? (
            <LoginForm
              onSubmit={handleLogin}
              onQuickLogin={onAuthenticated}
              onForgotPassword={() => setTab('forgot')}
              onSwitchToRegister={() => setTab('register')}
            />
          ) : tab === 'register' ? (
            <RegisterForm onSubmit={handleRegister} onSwitchToLogin={() => setTab('login')} />
          ) : resetSent ? (
            <div className="flex flex-col gap-4.5">
              <p className="m-0 text-[13.5px] leading-[1.55] text-(--text-tertiary)">
                Đã gửi liên kết đặt lại mật khẩu tới email của bạn (giả lập — chưa nối email thật).
                Kiểm tra hộp thư để tiếp tục.
              </p>
              <button type="button" className="min-h-[46px] cursor-pointer rounded-[10px] border-none bg-[linear-gradient(90deg,var(--gold-deep),var(--gold))] px-5 py-[13px] font-['Open_Sans',sans-serif] text-sm font-bold text-(--on-gold) shadow-[0_6px_16px_rgba(169,127,47,0.25)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(169,127,47,0.35)]" onClick={backToLogin}>
                Quay lại đăng nhập
              </button>
            </div>
          ) : (
            <ForgotPasswordForm onSubmit={handleForgotPassword} onBackToLogin={backToLogin} />
          )}
        </div>

        <div className="text-center text-xs text-(--text-muted)">© 2026 DTR — Your Time Has Come</div>
      </div>
    </div>
  )
}
