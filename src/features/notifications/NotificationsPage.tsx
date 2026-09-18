import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer, UserNavbar, SearchIcon } from '@/components'
import { useLanguage } from '@/context/LanguageContext'
import { useNotifications } from '@/context/NotificationsContext'
import { topicLabels } from '@/data/notificationsData'
import { MailBadge, NotificationAvatar } from './notificationUi'

type StatusFilter = 'all' | 'unread' | 'read'

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
  { id: 'read', label: 'Đã đọc' },
]

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-full border px-2 py-1.5 text-center text-xs font-medium transition-colors md:w-auto md:px-3 md:text-sm ${
        active
          ? 'border-[var(--gold)] bg-[var(--gold)]/[0.12] text-[var(--gold-bright)]'
          : 'border-[var(--hairline)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:bg-[var(--bg-2)]'
      }`}
    >
      {children}
    </button>
  )
}

export default function NotificationsPage() {
  const { t } = useLanguage()
  const { items, markRead, toggleReadStatus } = useNotifications()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = normalizeText(query)
    return items.filter((item) => {
      if (status === 'unread' && item.read) return false
      if (status === 'read' && !item.read) return false
      if (!needle) return true
      return [item.sender, item.title, item.description, item.snippet ?? ''].some((field) =>
        normalizeText(field).includes(needle),
      )
    })
  }, [items, query, status])

  const selected = items.find((item) => item.id === selectedId) ?? null

  function openItem(id: string) {
    markRead(id)
    setSelectedId(id)
  }

  return (
    <div className="min-h-svh bg-[var(--bg-1)] pb-4">
      <UserNavbar active="home" />

      <div className="mx-auto max-w-3xl px-4 pt-5 md:px-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ← Trang chủ
        </Link>

        <h1 className="mb-4 text-lg font-semibold text-[var(--text-primary)] lg:text-xl">Tất cả thông báo</h1>

        <form className="mb-4 flex h-10 items-center rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] p-1 pl-4 shadow-[0_6px_18px_var(--shadow)] md:h-11 md:pl-5" onSubmit={(event) => event.preventDefault()}>
          <input
            className="min-w-0 flex-1 bg-transparent py-0 text-sm leading-none text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] [&::-webkit-search-cancel-button]:hidden"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm thông báo..."
            aria-label="Tìm thông báo"
          />
          <button
            className="inline-flex h-full shrink-0 items-center gap-1 rounded-full bg-[var(--gold)] px-2.5 text-sm font-semibold leading-none text-[var(--on-gold)] md:px-[18px]"
            type="submit"
            aria-label="Tìm kiếm"
          >
            <span className="hidden md:inline">Tìm kiếm</span>
            <SearchIcon size={16} color="currentColor" />
          </button>
        </form>

        <div className="mb-5 grid grid-cols-3 gap-2 md:flex md:flex-wrap">
          {STATUS_FILTERS.map((item) => (
            <Chip key={item.id} active={status === item.id} onClick={() => setStatus(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-8 md:px-6">
        {selected ? (
          <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-4 shadow-[0_8px_24px_var(--shadow)] md:p-5">
            <button
              type="button"
              className="mb-4 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              onClick={() => setSelectedId(null)}
            >
              ← {t('notif.back')}
            </button>
            <div className="flex items-start gap-3">
              <NotificationAvatar item={selected} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[14px] font-bold text-[var(--text-primary)]">{selected.sender}</p>
                <p className="mt-0.5 m-0 text-[12px] text-[var(--text-muted)]">{selected.time}</p>
                <span className="mt-2 inline-flex rounded-full bg-[var(--gold)]/[0.1] px-2 py-0.5 text-[10px] font-medium text-[var(--gold-bright)]">
                  {topicLabels[selected.topic]}
                </span>
              </div>
              <button
                type="button"
                className="shrink-0 cursor-pointer border-none bg-transparent p-0"
                aria-label={selected.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                onClick={() => toggleReadStatus(selected.id)}
              >
                <MailBadge unread={!selected.read} />
              </button>
            </div>
            <h2 className="mt-4 mb-2 text-[16px] font-semibold text-[var(--text-primary)]">{selected.title}</h2>
            {selected.imageUrl ? (
              <img
                src={selected.imageUrl}
                alt={selected.snippet || selected.title}
                className="mb-3 h-44 w-full rounded-xl border border-[var(--hairline)] bg-[var(--bg-2)] object-cover"
              />
            ) : null}
            <p className="m-0 text-[14px] leading-relaxed text-[var(--text-secondary)]">{selected.description}</p>
            {selected.link ? (
              <a
                href={selected.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[13px] font-medium text-[var(--gold)] underline"
              >
                {t('notif.viewEvidence')}
              </a>
            ) : null}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-10 text-center text-sm text-[var(--text-tertiary)]">
            Không tìm thấy thông báo phù hợp.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`flex w-full items-start gap-3 border-b border-[var(--hairline)] px-3 py-3 last:border-b-0 md:px-4 ${
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
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] leading-snug text-[var(--text-primary)] md:text-sm">
                        <span className="font-bold">{item.sender}</span>{' '}
                        <span className="font-normal text-[var(--text-secondary)]">{t('notif.sent')}</span>
                      </span>
                      <span className="rounded-full bg-[var(--bg-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                        {topicLabels[item.topic]}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-[var(--text-secondary)]">{item.title}</span>
                    <span className="mt-1.5 block text-[11px] text-[var(--text-muted)]">{item.time}</span>
                  </span>
                </button>
                <button
                  type="button"
                  className="mt-0.5 shrink-0 cursor-pointer border-none bg-transparent p-0"
                  aria-label={item.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                  onClick={() => toggleReadStatus(item.id)}
                >
                  <MailBadge unread={!item.read} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
