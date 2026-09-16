type IconProps = {
  size?: number
  color?: string
}

export function CheckinIcon({ size = 22, color = '#3b7dd8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
      <path d="M17.5 9.5 19 11l3-3" />
    </svg>
  )
}
