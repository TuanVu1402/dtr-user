import { useEffect, useRef, useState } from 'react'
import { ChatIcon } from '../icons'
import { initialThreads, type MessageThread } from '@/data/messagesData'
import { useLanguage } from '@/context/LanguageContext'

export default function MessagesMenu() {
  const { t } = useLanguage()
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads)
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const unreadCount = threads.filter((item) => item.unread).length
  const activeThread = threads.find((item) => item.id === activeId) ?? null

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function openInbox() {
    setActiveId(null)
    setOpen((value) => !value)
  }

  function openThread(id: string) {
    setActiveId(id)
    setThreads((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)))
  }

  function markAllRead() {
    setThreads((prev) => prev.map((item) => ({ ...item, unread: false })))
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(37,99,235,0.22)] bg-[rgba(37,99,235,0.08)] text-(--gold) md:h-10 md:w-10"
        type="button"
        onClick={openInbox}
        aria-label={t('nav.messages')}
      >
        <ChatIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-(--bg-1) bg-(--negative) px-1 text-[10.5px] leading-none font-extrabold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+12px)] right-0 z-[70] flex max-h-[420px] w-[340px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl border border-[rgba(37,99,235,0.28)] bg-[linear-gradient(160deg,var(--surface-1),var(--surface-2))] shadow-[0_24px_48px_var(--shadow-strong)] max-[480px]:fixed max-[480px]:top-[72px] max-[480px]:right-3 max-[480px]:left-3 max-[480px]:w-auto max-[480px]:max-w-none max-[480px]:max-h-[min(420px,calc(100svh-96px))]">
          <div className="flex items-center justify-between gap-2.5 border-b border-(--hairline) px-4 py-3.5 text-[13.5px] font-extrabold text-(--text-primary)">
            {activeThread ? (
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 text-left text-[13.5px] font-extrabold text-(--text-primary)"
                onClick={() => setActiveId(null)}
              >
                ← {activeThread.sender}
              </button>
            ) : (
              <span>{t('messages.title')}</span>
            )}
            {!activeThread && unreadCount > 0 && (
              <button
                type="button"
                className="cursor-pointer border-none bg-none p-0 text-[11.5px] font-bold text-(--gold-bright)"
                onClick={markAllRead}
              >
                {t('messages.markAll')}
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {activeThread ? (
              <div className="flex flex-col gap-2.5 px-4 py-3">
                {activeThread.messages.map((message) => (
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                      message.fromMe
                        ? 'self-end rounded-br-md bg-(--gold) text-(--on-gold)'
                        : 'self-start rounded-bl-md bg-[var(--bg-2)] text-(--text-primary)'
                    }`}
                    key={message.id}
                  >
                    <p className="m-0">{message.text}</p>
                    <p className={`m-0 mt-1 text-[10px] ${message.fromMe ? 'text-white/80' : 'text-(--text-muted)'}`}>
                      {message.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : threads.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-(--text-tertiary)">{t('messages.empty')}</div>
            ) : (
              <div className="flex flex-col">
                {threads.map((thread) => (
                  <button
                    className={`flex w-full cursor-pointer gap-3 border-b border-(--hairline) px-4 py-3 text-left last:border-b-0 ${
                      thread.unread ? 'bg-[rgba(37,99,235,0.06)]' : 'bg-transparent'
                    }`}
                    key={thread.id}
                    type="button"
                    onClick={() => openThread(thread.id)}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(37,99,235,0.12)] text-[11px] font-bold text-(--gold)">
                      {thread.sender
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-bold text-(--text-primary)">{thread.sender}</span>
                        <span className="shrink-0 text-[11px] text-(--text-muted)">{thread.time}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-(--text-tertiary)">
                        {thread.preview}
                      </span>
                    </span>
                    {thread.unread && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--gold)" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
