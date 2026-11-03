import { Link } from 'react-router-dom'
import { shop } from '../config/shop'

export default function Logo() {
  const [first, ...rest] = shop.name.split(' ')
  return (
    <Link to="/" className="flex min-h-11 items-center gap-2.5" aria-label={`${shop.name} home`}>
      <img src={shop.logo} alt="" width={40} height={40} className="h-10 w-10 rounded-[10px] object-cover ring-1 ring-white/15" />
      <span className="font-display text-[15px] leading-none tracking-wide text-white sm:text-lg">
        {first.toUpperCase()} <span className="text-lime">{rest.join(' ').toUpperCase()}</span>
      </span>
    </Link>
  )
}
