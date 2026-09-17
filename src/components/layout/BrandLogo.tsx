import logo from '@/assets/dong-tay-land-logo.png'

type BrandLogoProps = {
  height?: number
}

export default function BrandLogo({ height = 38 }: BrandLogoProps) {
  return (
    <div className="inline-flex items-center rounded-[10px] bg-transparent py-1.5 pr-1.5 pl-0">
      <img className="block w-auto" src={logo} alt="Dong Tay Land" style={{ height }} />
    </div>
  )
}
