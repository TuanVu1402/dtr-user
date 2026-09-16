type IconProps = {
  size?: number
  color?: string
}

export function YoutubeIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M11 9.5v5l4-2.5Z" fill={color} stroke="none" />
    </svg>
  )
}
