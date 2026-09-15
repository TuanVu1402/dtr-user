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
import '../styles/shared.css'

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
    <header className="navbar">
      <Link to="/" className="brand">
        <BrandLogo />
      </Link>

      <div className="nav-right">
        <button
          className="icon-btn"
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
          className="icon-btn hamburger-btn"
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
          <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} />
          <nav className="mobile-nav-panel">
            <Link
              to="/profile"
              className={`mobile-nav-link${active === 'profile' ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Hồ sơ cá nhân
            </Link>
            <button type="button" className="mobile-nav-link mobile-nav-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </nav>
        </>
      )}
    </header>
  )
}
