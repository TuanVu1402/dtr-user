import { Link, useNavigate } from 'react-router-dom'
import { MoonIcon, SunIcon } from '../icons'
import { BrandLogo } from '../layout'
import NotificationsMenu from './NotificationsMenu'
import LanguageMenu from './LanguageMenu'
import UserMenu from './UserMenu'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import { useSubmissions } from '@/context/SubmissionsContext'
import { CURRENT_USER_NAME } from '@/data/currentUser'

type UserNavbarProps = {
  active: 'home' | 'profile'
}

export default function UserNavbar({ active }: UserNavbarProps) {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const { users } = useSubmissions()
  const navigate = useNavigate()

  const currentUser = users.find((u) => u.name === CURRENT_USER_NAME)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--hairline)] bg-[var(--surface-1)] py-3 pr-4 pl-3 md:py-4 md:pr-6 md:pl-4 lg:px-8 lg:pl-5">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <BrandLogo />
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--bg-2)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-3)] md:h-10 md:w-10"
          aria-label={theme === 'dark' ? t('nav.light') : t('nav.dark')}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <NotificationsMenu />
        <LanguageMenu />
        <UserMenu
          name={CURRENT_USER_NAME}
          initials="NT"
          avatarUrl={currentUser?.avatarUrl}
          onLogout={handleLogout}
          isProfileActive={active === 'profile'}
        />
      </div>
    </header>
  )
}
