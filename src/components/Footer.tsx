import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import { shop } from '../config/shop'
import { policies } from '../content/policies'
import Logo from './Logo'
import PaymentBadges from './PaymentBadges'

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Gaming consoles, accessories and smart gadgets from {shop.city}. Genuine products, honest prices and warranty on every item.
          </p>
          <div className="mt-5"><PaymentBadges dark /></div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-lime">Shop</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link className="hover:text-white" to="/shop">All products</Link></li>
            {categories.map(c => (
              <li key={c.id}><Link className="hover:text-white" to={`/shop/${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-lime">Customer care</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            {policies.map(p => (
              <li key={p.slug}><Link className="hover:text-white" to={`/policies/${p.slug}`}>{p.title}</Link></li>
            ))}
            <li><Link className="hover:text-white" to="/faq">FAQ</Link></li>
            <li><Link className="hover:text-white" to="/about">About us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-lime">Visit or reach us</h3>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
              <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-white">{shop.address}</a></li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
              <a href={`tel:${shop.phoneHref}`} className="hover:text-white">{shop.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
              <a href={`mailto:${shop.email}`} className="break-all hover:text-white">{shop.email}</a></li>
            {shop.hours.map(h => (
              <li key={h.days} className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-lime" /><span>{h.days}<br /><span className="text-white/90">{h.time}</span></span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 md:flex-row">
          <span>© {new Date().getFullYear()} {shop.legalName}. All rights reserved. Prices in Sri Lankan Rupees (LKR).</span>
          <span>Secure card payments processed by PayHere.</span>
        </div>
      </div>
    </footer>
  )
}
