import { Facebook, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cardGateway, payWays, shop } from '../config/shop'
import { policies } from '../content/policies'
import { visibleCatalogCategories } from '../data/catalog'
import Logo from './Logo'
import PaymentBadges from './PaymentBadges'

export default function Footer() {
  const columnTitle = 'hud mb-3 text-[13px] uppercase tracking-[0.16em] text-lime'
  const linkClass = 'flex min-h-9 items-center text-[15px] text-[#d9daf0] hover:text-white'
  return (
    <footer className="page-bottom mt-16 border-t border-line bg-navy">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-9 py-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-14">
        <div className="col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#d9daf0]">
            Gaming gear, audio, charging and smart tech from {shop.city}, {shop.country}.
          </p>
          <div className="mt-4"><PaymentBadges dark /></div>
        </div>
        <div>
          <h2 className={columnTitle}>Shop</h2>
          <Link className={linkClass} to="/shop">All products</Link>
          {visibleCatalogCategories.map(category => <Link key={category.id} className={linkClass} to={`/shop/${category.id}`}>{category.name}</Link>)}
        </div>
        <div>
          <h2 className={columnTitle}>Help</h2>
          {policies.map(policy => <Link key={policy.slug} className={linkClass} to={`/policies/${policy.slug}`}>{policy.title}</Link>)}
          <Link className={linkClass} to="/faq">FAQ</Link>
          <Link className={linkClass} to="/about">About us</Link>
          <Link className={linkClass} to="/contact">Contact</Link>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <h2 className={columnTitle}>Reach us</h2>
          <ul className="space-y-1 text-[15px] text-[#d9daf0]">
            <li><a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="flex min-h-9 items-center gap-2.5 hover:text-white"><MapPin className="h-4 w-4 shrink-0 text-lime" /> {shop.address}</a></li>
            <li><a href={`tel:${shop.phoneHref}`} className="flex min-h-9 items-center gap-2.5 hover:text-white"><Phone className="h-4 w-4 shrink-0 text-lime" /> {shop.phone}</a></li>
            <li><a href={`tel:${shop.phoneAltHref}`} className="flex min-h-9 items-center gap-2.5 hover:text-white"><Phone className="h-4 w-4 shrink-0 text-lime" /> {shop.phoneAlt}</a></li>
            <li><a href={`mailto:${shop.email}`} className="flex min-h-9 items-center gap-2.5 break-all hover:text-white"><Mail className="h-4 w-4 shrink-0 text-lime" /> {shop.email}</a></li>
            {shop.social.facebook && <li><a href={shop.social.facebook} target="_blank" rel="noreferrer" className="flex min-h-9 items-center gap-2.5 hover:text-white"><Facebook className="h-4 w-4 shrink-0 text-lime" /> Follow us on Facebook</a></li>}
          </ul>
        </div>
      </div>
      <div className="overflow-hidden" aria-hidden="true">
        <p className="font-display whitespace-nowrap text-center text-[11.4vw] leading-[1] text-white/[0.07]">{shop.name.toUpperCase()}</p>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-1 py-5 text-[13px] text-muted md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {shop.legalName}. All rights reserved.</span>
          <span>{shop.payments.card.enabled ? `Secure card payments processed by ${cardGateway.name}.` : payWays() ? `Payment options: ${payWays()}.` : 'We confirm how to pay with you on WhatsApp.'}</span>
        </div>
      </div>
    </footer>
  )
}
