type IconProps = {
  size?: number
  color?: string
}

export function ZaloIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1.1 0-2.1-.2-3-.6L4 20l1.1-4.2A7.9 7.9 0 0 1 4 12Z" />
    </svg>
  )
}
