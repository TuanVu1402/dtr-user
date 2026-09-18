import { useEffect, useRef, useState } from 'react'
import { BellIcon, CloseIcon } from '../icons'
import {
  initialNotifications,
  notificationAvatarClass,
  type AppNotification,
} from '@/data/notificationsData'
import { useLanguage } from '@/context/LanguageContext'

function senderInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function MailBadge({ unread }: { unread: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        unread ? 'bg-[#2563eb]/12 text-[#2563eb]' : 'bg-[var(--bg-2)] text-[var(--text-muted)]'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="m4.2 7.2 7.8 6.2 7.8-6.2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function DocSnippet({ text }: { text: string }) {
  return (
    <span className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[var(--hairline)] bg-[var(--bg-2)] px-2 py-1 text-[12px] text-[var(--text-secondary)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#2563eb]">
        <path
          d="M7 3.5h7.2L19 8.2V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1.5-1.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M14 3.6V8h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="truncate">{text}</span>
    </span>
  )
}

export default function NotificationsMenu() {
  const { t } = useLanguage()
  const [items, setItems] = useState<AppNotification[]>(initialNotifications)
  const [open, setOpen] = useState(false)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const unreadCount = items.filter((n) => !n.read).length
  const visible = unreadOnly ? items.filter((n) => !n.read) : items

  useEffect(() => {
    if (!open) {
      setMenuOpen(false)
      return
    }
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    setMenuOpen(false)
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(37,99,235,0.22)] bg-[rgba(37,99,235,0.08)] text-(--gold) md:h-10 md:w-10"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('nav.notifications')}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-(--bg-1) bg-(--negative) px-1 text-[10.5px] leading-none font-extrabold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+12px)] right-0 z-[70] flex max-h-[min(480px,calc(100svh-96px))] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] shadow-[0_24px_48px_var(--shadow-strong)] max-[480px]:fixed max-[480px]:top-[72px] max-[480px]:right-3 max-[480px]:left-3 max-[480px]:w-auto max-[480px]:max-w-none">
          <div className="flex items-center gap-2 border-b border-[var(--hairline)] px-3 py-2.5">
            <p className="min-w-0 flex-1 text-[15px] font-bold text-[var(--text-primary)]">{t('notif.title')}</p>
            <label className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
              {t('notif.unread')}
              <button
                type="button"
                role="switch"
                aria-checked={unreadOnly}
                className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
                  unreadOnly ? 'bg-[#2563eb]' : 'bg-[var(--hairline)]'
                }`}
                onClick={() => setUnreadOnly((value) => !value)}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    unreadOnly ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </label>
            <div className="relative">
              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
                aria-label={t('notif.markAll')}
                onClick={() => setMenuOpen((value) => !value)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <circle cx="5" cy="12" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="19" cy="12" r="1.7" />
                </svg>
              </button>
              {menuOpen && unreadCount > 0 ? (
                <button
                  type="button"
                  className="absolute top-[calc(100%+6px)] right-0 z-10 cursor-pointer whitespace-nowrap rounded-lg border border-[var(--hairline)] bg-[var(--surface-1)] px-3 py-2 text-left text-[12px] font-semibold text-[var(--text-primary)] shadow-lg hover:bg-[var(--bg-2)]"
                  onClick={markAllRead}
                >
                  {t('notif.markAll')}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
              aria-label="Đóng"
              onClick={() => setOpen(false)}
            >
              <CloseIcon size={16} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--text-tertiary)]">
                {unreadOnly ? t('notif.emptyUnread') : t('notif.empty')}
              </div>
            ) : (
              visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`flex w-full cursor-pointer gap-3 border-b border-[var(--hairline)] px-3 py-3 text-left last:border-b-0 ${
                    item.read ? 'bg-transparent' : 'bg-[#2563eb]/[0.06]'
                  }`}
                  onClick={() => markRead(item.id)}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${notificationAvatarClass(item.kind)}`}
                  >
                    {senderInitials(item.sender)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] leading-snug text-[var(--text-primary)]">
                      <span className="font-bold">{item.sender}</span>{' '}
                      <span className="font-normal text-[var(--text-secondary)]">{t('notif.sent')}</span>
                    </span>
                    <DocSnippet text={item.snippet || item.title} />
                    <span className="mt-1.5 block text-[11px] text-[var(--text-muted)]">{item.time}</span>
                  </span>
                  <MailBadge unread={!item.read} />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
