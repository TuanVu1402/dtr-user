type IconProps = {
  size?: number
  color?: string
}

export function PersonIcon({ size = 18, color = '#3b7dd8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-3.87 3.36-7 7.5-7s7.5 3.13 7.5 7" />
    </svg>
  )
}
