type IconProps = {
  size?: number
  color?: string
}

export function OfficeIcon({ size = 22, color = '#3b7dd8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M4 21V6l7-3 7 3v15" />
      <path d="M4 21h16" />
      <path d="M9 21v-5h4v5" />
      <path d="M9 10h.01M13.99 10h.01M9 14h.01M13.99 14h.01" />
    </svg>
  )
}
