import { useEffect, useRef, useState } from 'react'
import { useLanguage, type Locale } from '@/context/LanguageContext'

const options: { value: Locale; native: string }[] = [
  { value: 'vi', native: 'Tiếng Việt' },
  { value: 'en', native: 'English' },
]

export default function LanguageMenu() {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative" ref={rootRef}>
      <button
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(37,99,235,0.22)] bg-[rgba(37,99,235,0.08)] text-[11px] font-extrabold tracking-wide text-(--gold) md:h-10 md:w-10"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('nav.language')}
        aria-expanded={open}
      >
        {locale.toUpperCase()}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 z-[70] flex min-w-[160px] flex-col gap-0.5 rounded-lg border border-[rgba(37,99,235,0.28)] bg-[linear-gradient(160deg,var(--surface-1),var(--surface-2))] p-1.5 shadow-[0_20px_40px_var(--shadow-strong)]">
          {options.map((option) => (
            <button
              className={`block w-full cursor-pointer rounded-lg border-none px-3 py-2.5 text-left text-[13.5px] ${
                locale === option.value
                  ? 'bg-[rgba(37,99,235,0.1)] font-bold text-(--gold-bright)'
                  : 'bg-transparent text-(--text-primary) hover:bg-[rgba(37,99,235,0.08)]'
              }`}
              key={option.value}
              type="button"
              onClick={() => {
                setLocale(option.value)
                setOpen(false)
              }}
            >
              {option.native}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
