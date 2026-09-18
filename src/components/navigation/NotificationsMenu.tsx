import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { BellIcon, CloseIcon } from '../icons'
import { useLanguage } from '@/context/LanguageContext'
import { useNotifications } from '@/context/NotificationsContext'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { MailBadge, NotificationAvatar, senderInitials } from '@/features/notifications/notificationUi'
import { notificationAvatarClass } from '@/data/notificationsData'

const PREVIEW_COUNT = 5

type PanelPos = {
  top: number
  left?: number
  right?: number
  width?: number
}

export default function NotificationsMenu() {
  const { t } = useLanguage()
  const { items, unreadCount, markRead, toggleReadStatus } = useNotifications()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showRead, setShowRead] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelPos, setPanelPos] = useState<PanelPos | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const visible = showRead ? items.filter((item) => item.read) : items
  const preview = visible.slice(0, PREVIEW_COUNT)
  const selected = items.find((item) => item.id === selectedId) ?? null
  const filterLabel = showRead ? t('notif.read') : t('notif.all')
  useLockBodyScroll(open)

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setPanelPos(null)
      return
    }

    function place() {
      const button = buttonRef.current
      if (!button) return
      const rect = button.getBoundingClientRect()
      const gap = 10
      const compact = window.innerWidth < 640
      if (compact) {
        setPanelPos({ top: rect.bottom + gap, left: 12, right: 12 })
        return
      }
      const width = Math.min(360, window.innerWidth - 24)
      const right = Math.max(12, window.innerWidth - rect.right)
      setPanelPos({ top: rect.bottom + gap, right, width })
    }

    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open])

  useEffect(() => {
    if (!open) {
      setSelectedId(null)
      return
    }
    function handlePointer(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null
      if (!target) return
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
    }
  }, [open])

  function openItem(id: string) {
    markRead(id)
    setSelectedId(id)
  }

  function goToAll() {
    setOpen(false)
    navigate('/notifications')
  }

  const panel =
    open && panelPos
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[80] cursor-default overscroll-none bg-black/25"
              aria-label="Đóng thông báo"
              onClick={() => setOpen(false)}
            />
            <div
              ref={panelRef}
              className="fixed z-[90] flex max-h-[min(560px,calc(100svh-88px))] flex-col overflow-hidden overscroll-none rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] shadow-[0_24px_48px_var(--shadow-strong)]"
              style={{
                top: panelPos.top,
                left: panelPos.left,
                right: panelPos.right,
                width: panelPos.width,
                maxWidth: 'calc(100vw - 24px)',
              }}
            >
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

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
                ) : preview.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[13px] text-[var(--text-tertiary)]">
                    {showRead ? t('notif.emptyRead') : t('notif.empty')}
                  </div>
                ) : (
                  preview.map((item) => (
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
                        <span className="mt-0.5">
                          <NotificationAvatar item={item} />
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

              {!selected ? (
                <button
                  type="button"
                  className="border-t border-[var(--hairline)] bg-[var(--surface-1)] px-3 py-2.5 text-center text-[13px] font-semibold text-[var(--gold-bright)] hover:bg-[var(--bg-2)]"
                  onClick={goToAll}
                >
                  {t('notif.seeMore')}
                </button>
              ) : null}
            </div>
          </>,
          document.body,
        )
      : null

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(37,99,235,0.22)] bg-[rgba(37,99,235,0.08)] text-(--gold) md:h-10 md:w-10"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('nav.notifications')}
        aria-expanded={open}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-(--bg-1) bg-(--negative) px-1 text-[10.5px] leading-none font-extrabold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {panel}
    </div>
  )
}
