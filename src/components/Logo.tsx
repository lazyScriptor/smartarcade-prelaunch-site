import { Link } from 'react-router-dom'
import { shop } from '../config/shop'

export default function Logo({ compact = false }: { compact?: boolean }) {
  const [first, ...rest] = shop.name.split(' ')
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={`${shop.name} home`}>
      <img src={shop.logo} alt="" className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10" />
      {!compact && (
        <span className="font-display text-lg font-extrabold leading-none tracking-wide text-white">
          {first.toUpperCase()} <span className="text-lime">{rest.join(' ').toUpperCase()}</span>
        </span>
      )}
    </Link>
  )
}
