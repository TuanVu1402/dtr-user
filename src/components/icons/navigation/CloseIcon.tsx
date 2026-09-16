type IconProps = {
  size?: number
  color?: string
}

export function CloseIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke={color}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}
