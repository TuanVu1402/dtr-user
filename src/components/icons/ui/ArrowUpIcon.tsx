type IconProps = {
  size?: number
  color?: string
}

export function ArrowUpIcon({ size = 18, color = '#ffffff' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  )
}
