import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons'
import BrandLogo from './BrandLogo'
import NotificationsMenu from './NotificationsMenu'
import UserMenu from './UserMenu'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSubmissions } from '../context/SubmissionsContext'
import { CURRENT_USER_NAME } from '../data/currentUser'

const iconBtnClass =
  'flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(37,99,235,0.22)] bg-[rgba(37,99,235,0.08)] text-(--gold)'
const mobileNavLinkClass =
  'block w-full cursor-pointer border-none border-b border-(--hairline) bg-none px-1 py-3.5 text-left font-inherit text-sm font-bold tracking-[0.5px] text-(--text-secondary) uppercase no-underline last-of-type:border-b-0'

type UserNavbarProps = {
  active: 'home' | 'profile'
}

export default function UserNavbar({ active }: UserNavbarProps) {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { users } = useSubmissions()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentUser = users.find((u) => u.name === CURRENT_USER_NAME)

  function handleLogout() {
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className="relative flex items-center justify-between gap-6 border-b border-[rgba(37,99,235,0.16)] px-11 py-[22px] max-[640px]:px-5 max-[480px]:gap-2.5 max-[480px]:py-4">
      <Link to="/" className="flex items-center gap-4.5">
        <BrandLogo />
      </Link>

      <div className="flex items-center gap-5.5 max-[480px]:gap-2">
        <button
          className={iconBtnClass}
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <NotificationsMenu />
        <UserMenu
          name={CURRENT_USER_NAME}
          initials="NT"
          avatarUrl={currentUser?.avatarUrl}
          onLogout={handleLogout}
          isProfileActive={active === 'profile'}
        />
        <button
          className={`hidden max-[960px]:flex ${iconBtnClass}`}
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-(--scrim) min-[961px]:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute inset-x-0 top-full z-[56] flex flex-col border-b border-[rgba(37,99,235,0.28)] bg-[linear-gradient(160deg,var(--surface-1),var(--surface-2))] px-5 pt-3 pb-5 shadow-[0_24px_48px_var(--shadow-strong)] min-[961px]:hidden">
            <Link
              to="/profile"
              className={`${mobileNavLinkClass} ${active === 'profile' ? 'text-(--gold-bright)' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Hồ sơ cá nhân
            </Link>
            <button type="button" className={`${mobileNavLinkClass} text-(--negative)`} onClick={handleLogout}>
              Đăng xuất
            </button>
          </nav>
        </>
      )}
    </header>
  )
}
