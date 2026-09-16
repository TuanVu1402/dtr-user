type IconProps = {
  size?: number
  color?: string
}

export function AppleIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M16.5 12.3c0-2 1.6-3 1.7-3.1-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.1 1.9-1.3 2.3-.3 5.8 1 7.7.6.9 1.4 2 2.4 1.9 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6c1 0 1.7-.9 2.3-1.9.5-.7.7-1.1 1.1-2-2.9-1.1-3.2-3.2-3.2-3Z" />
      <path d="M14.6 6.8c.5-.6.9-1.5.8-2.4-.8.1-1.7.5-2.2 1.1-.5.6-.9 1.5-.8 2.3.9.1 1.7-.4 2.2-1Z" />
    </svg>
  )
}
