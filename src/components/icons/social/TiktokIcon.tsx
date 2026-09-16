type IconProps = {
  size?: number
  color?: string
}

export function TiktokIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M14 4v10.6a3.2 3.2 0 1 1-2.8-3.2" />
      <path d="M14 4c.3 2.5 2.1 4.2 4.6 4.4" />
    </svg>
  )
}
