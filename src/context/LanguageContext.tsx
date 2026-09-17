import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'vi' | 'en'

const STORAGE_KEY = 'dtr-locale-v1'

const copy = {
  vi: {
    'nav.dark': 'Chuyển sang giao diện tối',
    'nav.light': 'Chuyển sang giao diện sáng',
    'nav.notifications': 'Thông báo',
    'nav.messages': 'Tin nhắn',
    'nav.language': 'Đổi ngôn ngữ',
    'nav.account': 'Tài khoản',
    'user.profile': 'Hồ sơ cá nhân',
    'user.logout': 'Đăng xuất',
    'messages.title': 'Tin nhắn',
    'messages.empty': 'Chưa có tin nhắn nào.',
    'messages.back': 'Danh sách tin nhắn',
    'messages.markAll': 'Đánh dấu đã đọc tất cả',
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'board.title': 'BẢNG VÀNG VINH DANH',
    'notif.title': 'Thông báo',
    'notif.markAll': 'Đánh dấu đã đọc tất cả',
    'notif.empty': 'Không có thông báo nào.',
  },
  en: {
    'nav.dark': 'Switch to dark mode',
    'nav.light': 'Switch to light mode',
    'nav.notifications': 'Notifications',
    'nav.messages': 'Messages',
    'nav.language': 'Change language',
    'nav.account': 'Account',
    'user.profile': 'Profile',
    'user.logout': 'Log out',
    'messages.title': 'Messages',
    'messages.empty': 'No messages yet.',
    'messages.back': 'Message list',
    'messages.markAll': 'Mark all as read',
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'board.title': 'GOLD HONOR BOARD',
    'notif.title': 'Notifications',
    'notif.markAll': 'Mark all as read',
    'notif.empty': 'No notifications.',
  },
} as const

export type CopyKey = keyof typeof copy.vi

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: CopyKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'vi'
  return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'vi'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.setAttribute('translate', 'no')
    document.documentElement.classList.add('notranslate')
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  function setLocale(next: Locale) {
    setLocaleState(next)
  }

  function t(key: CopyKey) {
    return copy[locale][key]
  }

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
