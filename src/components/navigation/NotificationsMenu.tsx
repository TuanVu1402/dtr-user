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
        unread ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-[#e8edf2] text-[#9aa4b2]'
      }`}
    >
      {unread ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
          <path d="M3 7 12 2l9 5-9 5-9-5Z" />
        </svg>
      )}
    </span>
  )
}

export default function NotificationsMenu() {
  const { t } = useLanguage()
  const [items, setItems] = useState<AppNotification[]>(initialNotifications)
  const [open, setOpen] = useState(false)
  const [showRead, setShowRead] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const unreadCount = items.filter((n) => !n.read).length
  const visible = showRead ? items.filter((item) => item.read) : items
  const selected = items.find((item) => item.id === selectedId) ?? null
  const filterLabel = showRead ? t('notif.read') : t('notif.all')

  useEffect(() => {
    if (!open) {
      setSelectedId(null)
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

  function openItem(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setSelectedId(id)
  }

  function toggleReadStatus(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
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
        <div className="absolute top-[calc(100%+12px)] right-0 z-[70] flex max-h-[min(560px,calc(100svh-88px))] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] shadow-[0_24px_48px_var(--shadow-strong)] max-[480px]:fixed max-[480px]:top-[72px] max-[480px]:right-3 max-[480px]:left-3 max-[480px]:w-auto max-[480px]:max-w-none">
          <div className="flex items-center gap-2 border-b border-[var(--hairline)] px-3 py-2.5">
            {selected ? (
              <button
                type="button"
                className="min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent p-0 text-left text-[15px] font-bold text-[var(--text-primary)]"
                onClick={() => setSelectedId(null)}
              >
                ← {selected.sender}
              </button>
            ) : (
              <>
                <p className="min-w-0 flex-1 text-[15px] font-bold text-[var(--text-primary)]">{t('notif.title')}</p>
                <label className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
                  {filterLabel}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showRead}
                    aria-label={filterLabel}
                    className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
                      showRead ? 'bg-[#2563eb]' : 'bg-[var(--hairline)]'
                    }`}
                    onClick={() => setShowRead((value) => !value)}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        showRead ? 'translate-x-4' : ''
                      }`}
                    />
                  </button>
                </label>
              </>
            )}
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-2)]"
              aria-label="Đóng"
              onClick={() => setOpen(false)}
            >
              <CloseIcon size={16} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {selected ? (
              <div className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${notificationAvatarClass(selected.kind)}`}
                  >
                    {senderInitials(selected.sender)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-[14px] font-bold text-[var(--text-primary)]">{selected.sender}</p>
                    <p className="mt-0.5 m-0 text-[12px] text-[var(--text-muted)]">{selected.time}</p>
                  </div>
                </div>
                <h4 className="m-0 text-[15px] font-semibold text-[var(--text-primary)]">{selected.title}</h4>
                {selected.imageUrl ? (
                  <img
                    src={selected.imageUrl}
                    alt={selected.snippet || selected.title}
                    className="h-40 w-full rounded-xl border border-[var(--hairline)] bg-[var(--bg-2)] object-cover"
                  />
                ) : null}
                <p className="m-0 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">{selected.description}</p>
                {selected.link ? (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] font-medium text-[var(--gold)] underline"
                  >
                    {t('notif.viewEvidence')}
                  </a>
                ) : null}
              </div>
            ) : visible.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--text-tertiary)]">
                {showRead ? t('notif.emptyRead') : t('notif.empty')}
              </div>
            ) : (
              visible.map((item) => (
                <div
                  key={item.id}
                  className={`flex w-full items-start gap-3 border-b border-[var(--hairline)] px-3 py-3 last:border-b-0 ${
                    item.read ? 'bg-transparent' : 'bg-[#2563eb]/[0.06]'
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 cursor-pointer gap-3 border-none bg-transparent p-0 text-left"
                    onClick={() => openItem(item.id)}
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
                      <span className="mt-0.5 block truncate text-[13px] text-[var(--text-secondary)]">{item.title}</span>
                      <span className="mt-1.5 block text-[11px] text-[var(--text-muted)]">{item.time}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 cursor-pointer border-none bg-transparent p-0"
                    aria-label={item.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                    title={item.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                    onClick={() => toggleReadStatus(item.id)}
                  >
                    <MailBadge unread={!item.read} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
