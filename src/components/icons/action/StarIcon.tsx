type IconProps = {
  size?: number
  color?: string
}

export function StarIcon({ size = 14, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2.5l2.95 6.28 6.85.7-5.13 4.75 1.44 6.77L12 17.77l-6.11 3.23 1.44-6.77L2.2 9.48l6.85-.7Z" />
    </svg>
  )
}
