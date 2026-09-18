import { createContext, useContext, useState, type ReactNode } from 'react'
import { initialNotifications, type AppNotification } from '@/data/notificationsData'

type NotificationsContextValue = {
  items: AppNotification[]
  unreadCount: number
  markRead: (id: string) => void
  toggleReadStatus: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>(initialNotifications)
  const unreadCount = items.filter((item) => !item.read).length

  function markRead(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  function toggleReadStatus(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
  }

  return (
    <NotificationsContext.Provider value={{ items, unreadCount, markRead, toggleReadStatus }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
