import {
  BatteryCharging, Briefcase, Gamepad2, Glasses, HardDrive, Headphones, Headset, Keyboard,
  Mouse, PlugZap, Speaker, Watch, type LucideIcon, type LucideProps,
} from 'lucide-react'
import { forwardRef } from 'react'
import type { ArtIcon, Product } from '../data/products'

// Lucide has no games-console glyph; this one follows its 24px stroke style.
const Console = forwardRef<SVGSVGElement, LucideProps>(({ strokeWidth = 2, className, ...rest }, ref) => (
  <svg ref={ref} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...(rest as object)}>
    <rect x="2" y="7" width="20" height="10" rx="2.5" />
    <path d="M5.5 12h7" />
    <circle cx="17.5" cy="12" r="1.2" />
    <path d="M5 17v2M19 17v2" />
  </svg>
)) as LucideIcon

export const artIcons: Record<ArtIcon, LucideIcon> = {
  console: Console,
  handheld: Gamepad2,
  controller: Gamepad2,
  headset: Headset,
  earbuds: Headphones,
  drive: HardDrive,
  charger: PlugZap,
  watch: Watch,
  speaker: Speaker,
  powerbank: BatteryCharging,
  keyboard: Keyboard,
  mouse: Mouse,
  case: Briefcase,
  vr: Glasses,
}

// Generated artwork until the client's product photos arrive.
export default function ProductArt({ product, size = 'md' }: { product: Product; size?: 'sm' | 'md' | 'lg' }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className="h-full w-full object-contain bg-white" loading="lazy" />
  }
  const Icon = artIcons[product.art.icon]
  const iconSize = size === 'lg' ? 'h-40 w-40 md:h-56 md:w-56' : size === 'sm' ? 'h-10 w-10' : 'h-24 w-24'
  return (
    <div
      role="img"
      aria-label={product.name}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: `radial-gradient(120% 90% at 30% 20%, ${product.art.from}, ${product.art.to})` }}
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute -right-10 -bottom-10 h-2/3 w-2/3 rounded-full bg-lime/20 blur-3xl" />
      {size !== 'sm' && (
        <span className="absolute bottom-3 left-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          {product.brand}
        </span>
      )}
      <Icon className={`${iconSize} relative text-white drop-shadow-[0_10px_30px_rgba(0,0,0,.45)]`} strokeWidth={1.25} />
      {size !== 'sm' && <div className="absolute bottom-0 left-0 h-1 w-full bg-lime/80" />}
    </div>
  )
}
