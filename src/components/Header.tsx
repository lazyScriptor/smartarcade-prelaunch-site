import { Menu, Phone, ShieldCheck, X, MessageCircle, PackageSearch, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { catalogProducts, visibleCatalogCategories } from '../data/catalog'
import { shop, waLink } from '../config/shop'
import Logo from './Logo'
import SearchBox from './SearchBox'
import { useCart } from '../store/cart'

export default function Header() {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const { count } = useCart()
  useEffect(() => {
    setMenu(false)
  }, [pathname])

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white/10 text-lime' : 'text-white/80 hover:text-white'}`

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-lime text-navy">
        <div className="container-x flex h-9 items-center justify-center gap-6 overflow-hidden text-xs font-semibold md:justify-between">
          <span className="flex items-center gap-1.5"><PackageSearch className="h-3.5 w-3.5" /> <span>{catalogProducts.length} products in the catalogue</span></span>
          <span className="hidden items-center gap-1.5 md:flex"><ShieldCheck className="h-3.5 w-3.5" /> Warranty details where supplied</span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <MessageCircle className="h-3.5 w-3.5" /> Product pricing is being added
          </span>
          <a href={`tel:${shop.phoneHref}`} className="hidden items-center gap-1.5 lg:flex"><Phone className="h-3.5 w-3.5" /> {shop.phone}</a>
        </div>
      </div>

      <div className="bg-navy shadow-lg shadow-navy/20">
        <div className="container-x flex h-[68px] items-center gap-4">
          <button className="text-white md:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <Logo />
          <div className="mx-4 hidden max-w-xl flex-1 md:block">
            <SearchBox />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10" aria-label={`Cart, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-[10px] font-bold text-navy">{count}</span>}
            </Link>
            <a href={`tel:${shop.phoneHref}`} className="hidden items-center gap-2 rounded-xl px-3 py-2 text-white/90 hover:bg-white/5 lg:flex">
              <Phone className="h-5 w-5 text-lime" />
              <span className="text-left leading-tight">
                <span className="block text-[11px] text-white/60">Call or WhatsApp</span>
                <span className="text-sm font-semibold">{shop.phone}</span>
              </span>
            </a>
            <a href={waLink(`Hi ${shop.name}, I have a question about your product catalogue.`)} target="_blank" rel="noreferrer" className="btn btn-lime py-2.5 text-sm"><MessageCircle className="h-4 w-4" /> Contact us</a>
          </div>
        </div>
        <div className="container-x pb-3 md:hidden">
          <SearchBox />
        </div>
        <nav className="hidden border-t border-white/10 md:block" aria-label="Main">
          <div className="container-x no-scrollbar flex h-12 items-center gap-1 overflow-x-auto">
            <NavLink to="/" end className={navCls}>Home</NavLink>
            <NavLink to="/shop" end className={navCls}>All products</NavLink>
            {visibleCatalogCategories.map(c => (
              <NavLink key={c.id} to={`/shop/${c.id}`} className={navCls}>{c.name}</NavLink>
            ))}
            <span className="flex-1" />
            <NavLink to="/about" className={navCls}>About</NavLink>
            <NavLink to="/contact" className={navCls}>Contact</NavLink>
          </div>
        </nav>
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-navy p-5 text-white fade-up">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenu(false)} aria-label="Close menu"><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex flex-col gap-1 text-base">
              <Link className="rounded-lg px-3 py-2.5 hover:bg-white/5" to="/">Home</Link>
              <Link className="rounded-lg px-3 py-2.5 hover:bg-white/5" to="/shop">All products</Link>
              {visibleCatalogCategories.map(c => (
                <Link key={c.id} className="rounded-lg px-3 py-2.5 hover:bg-white/5" to={`/shop/${c.id}`}>{c.name}</Link>
              ))}
              <hr className="my-3 border-white/10" />
              <Link className="rounded-lg px-3 py-2.5 hover:bg-white/5" to="/about">About us</Link>
              <Link className="rounded-lg px-3 py-2.5 hover:bg-white/5" to="/contact">Contact & location</Link>
              <Link className="rounded-lg px-3 py-2.5 hover:bg-white/5" to="/faq">FAQ</Link>
            </nav>
            <a href={`tel:${shop.phoneHref}`} className="btn btn-lime mt-auto"><Phone className="h-4 w-4" /> {shop.phone}</a>
            <a href={`tel:${shop.phoneAltHref}`} className="mt-3 text-center text-sm text-white/70 hover:text-white">or call {shop.phoneAlt}</a>
          </div>
        </div>
      )}
    </header>
  )
}
