type IconProps = {
  size?: number
  color?: string
}

export function FacebookIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.9V12H8v3h2v6h3v-6h2.4l.4-3H13v-1.7c0-.7.3-1.3 1.1-1.3Z" />
    </svg>
  )
}
