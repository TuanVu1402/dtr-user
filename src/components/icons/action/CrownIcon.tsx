type IconProps = {
  size?: number
  color?: string
}

export function CrownIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="m2 8 4 3 6-7 6 7 4-3-2 11H4Z" />
    </svg>
  )
}
