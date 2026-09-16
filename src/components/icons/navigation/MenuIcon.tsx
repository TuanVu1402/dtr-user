type IconProps = {
  size?: number
  color?: string
}

export function MenuIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}
