type IconProps = {
  size?: number
  color?: string
}

export function PlayStoreIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M5 4.3v15.4c0 .5.5.8 1 .6l13-7.7c.4-.3.4-.9 0-1.1L6 3.7c-.5-.2-1 .1-1 .6Z" />
    </svg>
  )
}
