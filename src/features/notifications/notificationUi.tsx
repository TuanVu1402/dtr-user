import { notificationAvatarClass, type AppNotification } from '@/data/notificationsData'

export function senderInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function MailBadge({ unread }: { unread: boolean }) {
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
          <path d="M3 7 12 2l9 5-9 5-9-5Z" />
        </svg>
      )}
    </span>
  )
}

export function NotificationAvatar({ item, size = 'md' }: { item: AppNotification; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-11 w-11 text-[12px]' : 'h-10 w-10 text-[11px]'
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-bold ${box} ${notificationAvatarClass(item.kind)}`}>
      {senderInitials(item.sender)}
    </span>
  )
}
