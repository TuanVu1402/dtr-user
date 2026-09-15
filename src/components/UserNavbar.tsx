import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons'
import BrandLogo from './BrandLogo'
import NotificationsMenu from './NotificationsMenu'
import UserMenu from './UserMenu'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import '../styles/shared.css'

type UserNavbarProps = {
  active: 'home' | 'history' | 'leaderboard' | 'guide' | 'profile'
}

const navItems: { to: string; label: string; key: UserNavbarProps['active'] }[] = [
  { to: '/', label: 'Trang chủ', key: 'home' },
  { to: '/history', label: 'Lịch sử nộp', key: 'history' },
  { to: '/leaderboard', label: 'Bảng xếp hạng', key: 'leaderboard' },
  { to: '/guide', label: 'Hướng dẫn ghi điểm', key: 'guide' },
]

export default function UserNavbar({ active }: UserNavbarProps) {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="brand">
        <BrandLogo />
      </div>

      <nav className="nav-links">
        {navItems.map((item) => (
          <Link key={item.key} to={item.to} className={`nav-link${active === item.key ? ' active' : ''}`}>
            {item.label}
          </Link>
        ))}
      </nav>

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
        <UserMenu name="Nguyễn An" initials="NA" onLogout={handleLogout} isProfileActive={active === 'profile'} />
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
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`mobile-nav-link${active === item.key ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mobile-nav-divider" />
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
