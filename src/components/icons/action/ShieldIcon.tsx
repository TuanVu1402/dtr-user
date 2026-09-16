type IconProps = {
  size?: number
  color?: string
}

export function ShieldIcon({ size = 18, color = '#3b7dd8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M12 3.5 5 6v6c0 4.5 3 7.5 7 8.5 4-1 7-4 7-8.5V6Z" />
    </svg>
  )
}
