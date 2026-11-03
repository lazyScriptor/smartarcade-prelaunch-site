import { Grid2x2, Home, Menu, MessageCircle, Phone, Search, ShoppingBag, Truck, Store, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { shop, waLink } from '../config/shop'
import { policies } from '../content/policies'
import { visibleCatalogCategories } from '../data/catalog'
import { useCart } from '../store/cart'
import Logo from './Logo'
import SearchBox from './SearchBox'

const contactLink = waLink(`Hi ${shop.name}, I have a question.`)

const desktopNav = [
  { to: '/shop/gaming', label: 'Gaming' },
  { to: '/shop/audio', label: 'Audio' },
  { to: '/shop/power', label: 'Power' },
  { to: '/shop/creator', label: 'Creator' },
  { to: '/shop/wearables', label: 'Wearables' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Sheet({ open, onClose, title, children, fullScreen = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; fullScreen?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={event => { if (event.target === ref.current) onClose() }}
      aria-label={title}
      className={`sheet m-0 w-full max-w-none overflow-y-auto bg-navy p-0 lg:hidden ${fullScreen ? 'h-dvh max-h-none' : 'mt-auto max-h-[88dvh] rounded-t-3xl border-t border-line'}`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-navy px-5 py-3">
        <h2 className="text-lg text-white">{title}</h2>
        <button onClick={onClose} aria-label={`Close ${title.toLowerCase()}`} className="-mr-2 flex h-11 w-11 items-center justify-center text-white"><X className="h-6 w-6" /></button>
      </div>
      <div className="px-5 pb-[calc(24px+var(--safe-bottom))]">{children}</div>
    </dialog>
  )
}

function CartCount({ className }: { className: string }) {
  const { count } = useCart()
  if (!count) return null
  return <span key={count} className={`pop flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-[11px] font-bold text-navy ${className}`}>{count}</span>
}

export default function Header() {
  const [sheet, setSheet] = useState<'menu' | 'search' | null>(null)
  const { pathname, search } = useLocation()
  const { count } = useCart()
  useEffect(() => {
    setSheet(null)
  }, [pathname, search])

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${isActive ? 'text-lime' : 'text-muted'}`
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `hud flex h-11 items-center whitespace-nowrap px-3 text-[15px] transition-colors ${isActive ? 'text-lime' : 'text-white/85 hover:text-lime'}`
  const facts = [
    { icon: Truck, text: `Island-wide delivery with ${shop.delivery.courier}` },
    { icon: Store, text: `Free store pickup in ${shop.city}` },
    { icon: MessageCircle, text: 'Order in minutes on WhatsApp' },
  ]

  return (
    <>
      {/* Announcement strip */}
      <div className="overflow-hidden bg-lime text-navy" aria-label="Store information">
        <div className="marquee hud items-center py-1.5 text-[13px]" aria-hidden="true">
          {[...facts, ...facts, ...facts, ...facts].map((fact, index) => (
            <span key={index} className="flex items-center gap-2 px-6 whitespace-nowrap"><fact.icon className="h-3.5 w-3.5" /> {fact.text}</span>
          ))}
        </div>
        <p className="sr-only">{facts.map(fact => fact.text).join('. ')}.</p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-[rgba(10,10,43,0.92)] backdrop-blur-md">
        <div className="container-x flex h-[60px] items-center gap-3 lg:h-[68px]">
          <Logo />
          <nav className="ml-4 hidden items-center lg:flex" aria-label="Main">
            <NavLink to="/shop" end className={navClass}>Shop all</NavLink>
            {desktopNav.map(item => <NavLink key={item.to} to={item.to} className={navClass}>{item.label}</NavLink>)}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <div className="hidden w-64 lg:block xl:w-80"><SearchBox /></div>
            <button onClick={() => setSheet('search')} aria-label="Search products" className="flex h-11 w-11 items-center justify-center text-white lg:hidden"><Search className="h-6 w-6" /></button>
            <Link to="/cart" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`} className="relative hidden h-11 w-11 items-center justify-center text-white transition-colors hover:text-lime lg:flex">
              <ShoppingBag className="h-6 w-6" />
              <CartCount className="absolute right-0 top-0" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile and tablet tab bar */}
      <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[rgba(17,17,65,0.97)] pb-[var(--safe-bottom)] backdrop-blur-md lg:hidden">
        <div className="flex h-[var(--tabbar-h)]">
          <NavLink to="/" end className={tabClass}><Home className="h-6 w-6" /> Home</NavLink>
          <NavLink to="/shop" className={tabClass}><Grid2x2 className="h-6 w-6" /> Shop</NavLink>
          <NavLink to="/cart" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`} className={tabClass}>
            <span className="relative"><ShoppingBag className="h-6 w-6" /><CartCount className="absolute -right-3 -top-2" /></span> Cart
          </NavLink>
          <a href={contactLink} target="_blank" rel="noreferrer" className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#3ee07e]"><MessageCircle className="h-6 w-6" /> Chat</a>
          <button onClick={() => setSheet('menu')} className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted"><Menu className="h-6 w-6" /> More</button>
        </div>
      </nav>

      <Sheet open={sheet === 'search'} onClose={() => setSheet(null)} title="Search" fullScreen>
        {sheet === 'search' && <SearchBox inline autoFocus onDone={() => setSheet(null)} />}
      </Sheet>

      <Sheet open={sheet === 'menu'} onClose={() => setSheet(null)} title="Menu">
        <p className="eyebrow mt-1">Shop by type</p>
        <div className="mt-2 grid grid-cols-2 gap-x-3">
          {visibleCatalogCategories.map(category => (
            <Link key={category.id} to={`/shop/${category.id}`} onClick={() => setSheet(null)} className="flex min-h-11 items-center text-[15px] text-white">{category.name}</Link>
          ))}
        </div>
        <p className="eyebrow mt-5">Smart Arcade</p>
        <div className="mt-2 grid grid-cols-2 gap-x-3">
          <Link to="/about" onClick={() => setSheet(null)} className="flex min-h-11 items-center text-[15px] text-white">About us</Link>
          <Link to="/contact" onClick={() => setSheet(null)} className="flex min-h-11 items-center text-[15px] text-white">Contact & location</Link>
          <Link to="/faq" onClick={() => setSheet(null)} className="flex min-h-11 items-center text-[15px] text-white">FAQ</Link>
          {policies.map(policy => (
            <Link key={policy.slug} to={`/policies/${policy.slug}`} onClick={() => setSheet(null)} className="flex min-h-11 items-center text-[15px] text-white">{policy.title}</Link>
          ))}
        </div>
        <a href={`tel:${shop.phoneHref}`} className="btn btn-lime mt-5 w-full"><Phone className="h-5 w-5" /> Call {shop.phone}</a>
      </Sheet>
    </>
  )
}
