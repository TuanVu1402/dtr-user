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
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--bg-1)] px-4 py-8">
      {/* Theme Toggle */}
      <button
        type="button"
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] text-[var(--text-secondary)]"
        onClick={toggleTheme}
        aria-label="Chuyển giao diện"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Logo */}
      <div className="mb-6">
        <BrandLogo height={48} />
      </div>

      {/* Card */}
      <div className="w-full max-w-[360px] rounded-xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        {tab === 'forgot' ? (
          <>
            <h1 className="mb-1 text-xl font-semibold text-[var(--text-primary)]">Quên mật khẩu</h1>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-xl font-semibold text-[var(--text-primary)]">Chào mừng bạn</h1>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              Đăng nhập để nộp minh chứng và theo dõi điểm DTR.
            </p>
          </>
        )}

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="mb-5 flex rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] p-1">
            <button
              type="button"
              className={`flex-1 cursor-pointer rounded-md py-2 text-sm font-medium ${
                tab === 'login' ? 'bg-[var(--gold)] text-[var(--on-gold)]' : 'text-[var(--text-secondary)]'
              }`}
              onClick={() => setTab('login')}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`flex-1 cursor-pointer rounded-md py-2 text-sm font-medium ${
                tab === 'register' ? 'bg-[var(--gold)] text-[var(--on-gold)]' : 'text-[var(--text-secondary)]'
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
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              Đã gửi liên kết đặt lại mật khẩu tới email của bạn.
            </p>
            <button
              type="button"
              className="w-full rounded-lg bg-[var(--gold)] py-2.5 text-sm font-medium text-[var(--on-gold)]"
              onClick={backToLogin}
            >
              Quay lại đăng nhập
            </button>
          </div>
        ) : (
          <ForgotPasswordForm onSubmit={handleForgotPassword} onBackToLogin={backToLogin} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-[var(--text-muted)]">© 2026 DTR</div>
    </div>
  )
}
