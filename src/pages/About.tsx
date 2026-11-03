import { ArrowRight, MapPin, MessageCircle, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { shop, waLink } from '../config/shop'
import { catalogProducts, topBrands } from '../data/catalog'
import { usePageTitle } from '../hooks/ui'

const values = [
  { icon: MessageCircle, title: 'Talk to us directly', text: 'Orders and questions go straight to the shop on WhatsApp, not to a call centre.' },
  { icon: Truck, title: 'Delivered or collected', text: `Island-wide delivery with ${shop.delivery.courier}, or free pickup from our ${shop.city} shop.` },
  { icon: ShieldCheck, title: 'Warranty on selected items', text: 'Where a product has a warranty, its period is shown on the product page.' },
]

export default function About() {
  usePageTitle('About us')
  return (
    <>
      <PageHeader title={`About ${shop.name}`} crumbs={[{ label: 'About us' }]} />
      <section className="container-x grid grid-cols-1 items-center gap-8 pt-8 md:grid-cols-[1.3fr_1fr] md:pt-12">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-1.5 text-[1.75rem] leading-tight text-white md:text-4xl">Gaming gear and everyday tech, from {shop.city}.</h2>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-[#d9daf0]">
            <p>{shop.name} is a tech shop in {shop.city}, {shop.country}. We carry {catalogProducts.length} products from {topBrands.length} brands, including {topBrands.slice(0, 4).join(', ')} and more: headsets, speakers, power banks, smart watches, cables and the small things that make your setup work.</p>
            <p>Browse here, build a cart and send it to us on WhatsApp. We confirm what’s in stock, the final price and how you’d like to pay and receive it.</p>
          </div>
          <div className="mt-6 grid gap-3 sm:flex">
            <Link to="/shop" className="btn btn-lime">Shop now <ArrowRight className="h-5 w-5" /></Link>
            <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost"><MapPin className="h-5 w-5" /> Visit the store</a>
          </div>
          <p className="sr-only"><a href={waLink(`Hi ${shop.name}!`)}>Message us on WhatsApp</a></p>
        </div>
        <div className="relative mx-auto w-full max-w-[280px] md:max-w-sm">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-lime/25 blur-2xl" />
          <img src={shop.logo} alt={`${shop.name} logo`} width={500} height={500} className="relative w-full rounded-[2rem] ring-1 ring-white/15" />
        </div>
      </section>
      <section className="container-x pt-10">
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {values.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} index={index}>
              <div className="surface h-full p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-lime text-navy"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-lg text-white">{title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[#d9daf0]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
