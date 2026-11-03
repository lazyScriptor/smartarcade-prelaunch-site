import { ArrowLeft, ArrowRight, MapPin, MessageCircle, Package, ShoppingBag, Store, Truck, ShieldCheck, Send } from 'lucide-react'
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import CatalogCard, { priceText } from '../components/CatalogCard'
import CatalogImage from '../components/CatalogImage'
import Clip from '../components/Clip'
import Reveal from '../components/Reveal'
import { formatLKR, shop, waLink } from '../config/shop'
import { catalogProductById, catalogProducts, pricedProducts, topBrands, visibleCatalogCategories } from '../data/catalog'
import { categorySampleIds, heroClip, modes, topPickIds } from '../data/home'
import { prefersReducedMotion, usePageTitle } from '../hooks/ui'

const productsOfMode = (id: string) => catalogProducts.filter(product => product.category === id)

function SectionHead({ eyebrow, title, link, linkLabel }: { eyebrow: string; title: string; link?: string; linkLabel?: string }) {
  return (
    <Reveal className="mb-5 flex items-end justify-between gap-4 md:mb-7">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1.5 text-[1.625rem] leading-tight text-white md:text-4xl">{title}</h2>
      </div>
      {link && <Link to={link} className="hud flex min-h-11 shrink-0 items-center gap-1 text-[15px] text-lime hover:underline">{linkLabel} <ArrowRight className="h-4 w-4" /></Link>}
    </Reveal>
  )
}

function HeroStats({ className }: { className: string }) {
  const stats = [[String(catalogProducts.length), 'products'], [String(topBrands.length), 'brands'], ['Free', 'store pickup']]
  return (
    <dl className={`max-w-lg grid-cols-3 divide-x divide-line border-y border-line py-3 ${className}`}>
      {stats.map(([value, label]) => (
        <div key={label} className="flex flex-col-reverse px-3 first:pl-0">
          <dt className="text-[13px] text-muted">{label}</dt>
          <dd className="price text-2xl text-white">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Hero() {
  const [first, ...rest] = shop.tagline.split(' ')
  const panel = useRef<HTMLDivElement>(null)
  const words = [first, ...rest]
  const lastWord = words.pop()
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !panel.current || prefersReducedMotion()) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    panel.current.style.transform = `perspective(1100px) rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg)`
  }
  return (
    <section onPointerMove={onMove} onPointerLeave={() => { if (panel.current) panel.current.style.transform = '' }} className="relative overflow-hidden border-b border-line bg-navy">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-lime/15 blur-3xl" />
      <div className="container-x relative grid grid-cols-1 items-center gap-7 pb-8 pt-7 lg:grid-cols-[1.08fr_.92fr] lg:gap-10 lg:py-16">
        <div>
          <p className="eyebrow flex items-center gap-2"><span className="blink inline-block h-2 w-2 rounded-[2px] bg-lime" aria-hidden="true" /> Press start</p>
          <h1 className="mt-3 text-[2.75rem] leading-[1.02] text-white sm:text-6xl xl:text-7xl">
            <span className="rise-mask" style={{ '--i': 0 } as CSSProperties}><span>{words.join(' ')}</span></span>
            <span className="rise-mask" style={{ '--i': 1 } as CSSProperties}><span className="text-lime">{lastWord}</span></span>
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#dcddf3]">
            Gaming gear, audio, charging and smart tech from {shop.city}. Fill your cart, send it on WhatsApp, and we confirm the rest with you.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex">
            <Link to="/shop" className="btn btn-lime">Shop now <ArrowRight className="h-5 w-5" /></Link>
            <a href="#modes" className="btn btn-ghost">Pick a mode</a>
          </div>
          <HeroStats className="mt-7 hidden lg:grid" />
        </div>
        <div ref={panel} className="relative mx-auto w-full max-w-[420px] transition-transform duration-200 ease-out lg:max-w-[460px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/20 bg-[#0a0a2b] shadow-2xl shadow-black/60">
            <Clip name={heroClip.name} label={heroClip.label} className="absolute inset-0 h-full w-full" />
            <div className="scanline" aria-hidden="true" />
          </div>
        </div>
        <HeroStats className="grid lg:hidden" />
      </div>
      <div className="relative overflow-hidden border-t border-line py-3" aria-label={`Brands: ${topBrands.slice(0, 16).join(', ')}`}>
        <div className="marquee" style={{ '--speed': '48s' } as CSSProperties} aria-hidden="true">
          {[...topBrands.slice(0, 16), ...topBrands.slice(0, 16)].map((brand, index) => (
            <span key={index} className="font-display px-5 text-lg text-white/55 md:text-xl">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ModeSelect() {
  const [active, setActive] = useState(0)
  const mode = modes[active]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { items, priced, picks } = useMemo(() => {
    const items = productsOfMode(mode.id)
    const priced = items.filter(product => product.price !== null)
    const unpriced = items.filter(product => product.price === null)
    const picks = [...[...priced].sort((a, b) => (b.price as number) - (a.price as number)), ...unpriced].slice(0, 3)
    return { items, priced, picks }
  }, [mode.id])
  const lowest = priced.length ? Math.min(...priced.map(product => product.price as number)) : null

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (active + step + modes.length) % modes.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="modes" className="container-x scroll-mt-20 pt-12 md:pt-20">
      <SectionHead eyebrow="Select your mode" title="What are you into?" />
      <div role="tablist" aria-label="Product modes" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:px-0">
        {modes.map((item, index) => (
          <button
            key={item.id}
            ref={node => { tabRefs.current[index] = node }}
            role="tab"
            id={`mode-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls="mode-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onKeyDown}
            className={`hud min-h-12 shrink-0 grow rounded-xl border px-5 text-base transition-colors duration-150 md:grow-0 md:px-7 ${index === active ? 'border-lime bg-lime text-navy' : 'border-white/25 text-white hover:border-lime'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id="mode-panel" role="tabpanel" aria-labelledby={`mode-tab-${mode.id}`} className="mt-4 grid grid-cols-1 overflow-hidden rounded-3xl border border-line bg-navy lg:grid-cols-[minmax(0,420px)_1fr]">
        <div key={mode.id} className="page-in relative aspect-[4/3] overflow-hidden bg-[#0a0a2b] lg:aspect-auto lg:min-h-[480px]">
          <Clip name={mode.clip} label={mode.clipLabel} className="absolute inset-0 h-full w-full" />
          <span className="hud absolute left-4 top-4 rounded-md bg-lime px-2.5 py-1 text-[13px] text-navy">{mode.player}</span>
        </div>
        <div className="flex min-w-0 flex-col p-4 md:p-7">
          <h3 className="text-2xl text-white md:text-3xl">{mode.label}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-[#d9daf0] md:text-base">{mode.line}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line p-3"><dt className="text-[13px] text-muted">Products</dt><dd className="price text-xl text-white">{items.length}</dd></div>
            <div className="rounded-xl border border-line p-3"><dt className="text-[13px] text-muted">Priced from</dt><dd className="price text-xl text-lime">{lowest === null ? 'On request' : formatLKR(lowest)}</dd></div>
          </dl>
          {picks.length > 0 && (
            <ul className="mt-4 space-y-2">
              {picks.map(product => (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`} className="group flex min-h-16 items-center gap-3 rounded-xl border border-line p-2 transition-colors hover:border-lime">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white"><CatalogImage src={product.cardImage} alt="" sizes="56px" className="h-full w-full object-contain p-1" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-[15px] text-white group-hover:text-lime">{product.name}</span>
                      <span className={`price text-sm ${product.price === null ? 'text-muted' : 'text-lime'}`}>{priceText(product)}</span>
                    </span>
                    <ArrowRight className="mr-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/shop/${mode.id}`} className="btn btn-lime mt-5 w-full sm:w-auto sm:self-start lg:mt-auto">See all {items.length} <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </div>
    </section>
  )
}

function TopPicks() {
  const rail = useRef<HTMLUListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const picks = topPickIds.map(catalogProductById).filter(product => product !== undefined)
  const onScroll = () => {
    const node = rail.current
    if (!node || !bar.current) return
    const max = node.scrollWidth - node.clientWidth
    bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.08, node.scrollLeft / max) : 1})`
  }
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  return (
    <section className="container-x pt-12 md:pt-20">
      <SectionHead eyebrow="High score" title="Top picks" link="/shop" linkLabel="All products" />
      <ul ref={rail} onScroll={onScroll} tabIndex={0} aria-label="Top picks, scroll sideways for more" className="snap-x-rail no-scrollbar -mx-4 flex gap-3 overflow-x-auto scroll-px-4 px-4 py-2 md:mx-0 md:gap-4 md:scroll-px-0 md:px-0">
        {picks.map(product => (
          <li key={product.id} className="w-[62vw] max-w-[250px] shrink-0 sm:w-[260px] sm:max-w-none"><CatalogCard product={product} /></li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/15" aria-hidden="true"><span ref={bar} className="block h-full origin-left scale-x-[0.08] rounded-full bg-lime transition-transform duration-150" /></span>
        <button onClick={() => move(-1)} aria-label="Previous picks" className="hidden h-11 w-11 items-center justify-center rounded-[10px] border border-white/25 text-white hover:border-lime md:flex"><ArrowLeft className="h-5 w-5" /></button>
        <button onClick={() => move(1)} aria-label="More picks" className="hidden h-11 w-11 items-center justify-center rounded-[10px] border border-white/25 text-white hover:border-lime md:flex"><ArrowRight className="h-5 w-5" /></button>
      </div>
    </section>
  )
}

function BudgetPicker() {
  const min = 2000, max = 50000, step = 1000
  const [budget, setBudget] = useState(15000)
  const fits = useMemo(() => pricedProducts.filter(product => (product.price as number) <= budget).sort((a, b) => (b.price as number) - (a.price as number)), [budget])
  const fill = ((budget - min) / (max - min)) * 100
  return (
    <section className="container-x pt-12 md:pt-20">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-navy p-4 md:p-8">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <p className="eyebrow">Set your budget</p>
          <h2 className="mt-1.5 text-[1.625rem] leading-tight text-white md:text-4xl">What can you spend?</h2>
          <label htmlFor="budget" className="mt-5 block text-[15px] text-[#d9daf0]">Slide to your budget</label>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <output htmlFor="budget" className="price text-4xl text-lime md:text-5xl">{formatLKR(budget)}</output>
            <p className="hud text-right text-[15px] text-white" aria-live="polite"><span key={fits.length} className="pop inline-block">{fits.length}</span> {fits.length === 1 ? 'product fits' : 'products fit'}</p>
          </div>
          <input
            id="budget"
            type="range"
            className="range mt-2"
            min={min}
            max={max}
            step={step}
            value={budget}
            onChange={event => setBudget(Number(event.target.value))}
            aria-valuetext={formatLKR(budget)}
            style={{ '--fill': `${fill}%` } as CSSProperties}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {fits.slice(0, 4).map(product => <CatalogCard key={product.id} product={product} />)}
          </div>
          {fits.length === 0 && <p className="mt-4 text-muted">Nothing priced under this yet. Try sliding up, or ask us on WhatsApp.</p>}
          <Link to={`/shop?max=${budget}`} className="btn btn-lime mt-5 w-full sm:w-auto">See all {fits.length} under {formatLKR(budget)} <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: ShoppingBag, title: 'Fill your cart', text: 'Browse, compare and add what you want. No account needed.' },
    { icon: Send, title: 'Send on WhatsApp', text: 'We prepare your order message. You just tap Send.' },
    { icon: Package, title: 'We confirm, you get it', text: `We confirm stock, price, delivery and payment with you. Delivered or ready for pickup in ${shop.city}.` },
  ]
  return (
    <section className="container-x pt-12 md:pt-20">
      <SectionHead eyebrow="How to order" title="Three levels. That’s the game." />
      <ol className="grid gap-3 md:grid-cols-3 md:gap-4">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title}>
            <Reveal index={index} className="h-full">
              <div className="surface h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="hud text-[15px] text-lime">Level {index + 1}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-lime text-navy"><Icon className="h-5 w-5" /></span>
                </div>
                <h3 className="mt-3 text-xl text-white">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#d9daf0]">{text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Categories() {
  return (
    <section className="container-x pt-12 md:pt-20">
      <SectionHead eyebrow="The full arcade" title="Browse everything" link="/shop" linkLabel="Shop all" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
        {visibleCatalogCategories.map((category, index) => {
          const sampleId = categorySampleIds[category.id]
          const sample = (sampleId && catalogProductById(sampleId)) || catalogProducts.find(product => product.category === category.id && product.price !== null) || catalogProducts.find(product => product.category === category.id)
          return (
            <Reveal key={category.id} index={index % 4}>
              <Link to={`/shop/${category.id}`} className="hud-frame group flex h-full flex-col overflow-visible rounded-2xl border border-line bg-navy">
                <span className="block aspect-[4/3] overflow-hidden rounded-t-[15px] bg-white p-3">
                  {sample && <CatalogImage src={sample.cardImage} alt="" className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105" />}
                </span>
                <span className="block p-3">
                  <span className="font-display block text-[15px] leading-tight text-white md:text-lg">{category.name}</span>
                  <span className="hud mt-1 block text-[13px] text-lime">{category.count} products</span>
                </span>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Promises() {
  const items = [
    { icon: Truck, title: 'Island-wide delivery', text: `Sent with ${shop.delivery.courier}. Charged by weight, from ${formatLKR(shop.delivery.rates.baseFee)} for the first ${shop.delivery.rates.baseKg} kg.`, to: '/policies/delivery' },
    { icon: Store, title: 'Free store pickup', text: `Choose pickup and collect from our ${shop.city} shop when your order is ready.`, to: '/contact' },
    { icon: ShieldCheck, title: 'Warranty shown up front', text: 'Warranty on selected items. Where a product has one, its period is on the product page.', to: '/policies/warranty' },
  ]
  return (
    <section className="container-x pt-12 md:pt-20">
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {items.map(({ icon: Icon, title, text, to }, index) => (
          <Reveal key={title} index={index}>
            <Link to={to} className="surface group flex h-full gap-4 p-5 transition-colors hover:border-lime">
              <Icon className="mt-0.5 h-7 w-7 shrink-0 text-lime" />
              <span>
                <span className="font-display block text-lg text-white">{title}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-[#d9daf0]">{text}</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function StoreCta() {
  return (
    <section className="container-x pt-12 md:pt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-lime p-6 text-navy md:p-12">
          <p className="hud text-[13px] uppercase tracking-[0.16em]">Continue?</p>
          <h2 className="mt-2 max-w-2xl text-3xl leading-tight md:text-5xl">Questions first? Talk to a real person.</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-navy/85">Message us about a product, or come and see it at our {shop.city} shop.</p>
          <div className="mt-6 grid gap-3 sm:flex">
            <a href={waLink(`Hi ${shop.name}, I have a question about a product.`)} target="_blank" rel="noreferrer" className="btn bg-navy text-white hover:bg-navy-soft"><MessageCircle className="h-5 w-5" /> Chat on WhatsApp</a>
            <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="btn border-2 border-navy text-navy hover:bg-navy/10"><MapPin className="h-5 w-5" /> Get directions</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  usePageTitle('Gaming Gear, Audio & Smart Gadgets in Moratuwa')
  return (
    <>
      <Hero />
      <ModeSelect />
      <TopPicks />
      <BudgetPicker />
      <HowItWorks />
      <Categories />
      <Promises />
      <StoreCta />
    </>
  )
}
