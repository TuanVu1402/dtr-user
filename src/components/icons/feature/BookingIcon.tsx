type IconProps = {
  size?: number
  color?: string
}

export function BookingIcon({ size = 22, color = '#3b7dd8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M8.5 14.5 4 10l3-3 3.5 3.5" />
      <path d="m11 12 2.5 2.5a1.5 1.5 0 0 0 2-2.24L12 8.5" />
      <path d="M15.5 9.5 20 14l-3 3-3.5-3.5" />
      <path d="M9 11 6.5 8.5" />
    </svg>
  )
}
