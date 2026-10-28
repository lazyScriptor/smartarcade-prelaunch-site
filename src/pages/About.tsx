import { BadgeCheck, HeartHandshake, ShieldCheck, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { shop } from '../config/shop'
import PageHeader from '../components/PageHeader'

const values = [
  { icon: BadgeCheck, title: 'Browse the catalogue', text: 'Product photos and descriptions are grouped into easy-to-browse categories.' },
  { icon: ShieldCheck, title: 'Warranty shown where supplied', text: 'Product pages display warranty details included in the catalogue.' },
  { icon: Wrench, title: 'Product details', text: 'Open a product page to view its available photos and listed details.' },
  { icon: HeartHandshake, title: 'Pricing review underway', text: 'Prices are being set through a manual competitive review; contact us to confirm availability.' },
]

export default function About() {
  return (
    <>
      <PageHeader title={`About ${shop.name}`} crumbs={[{ label: 'About us' }]} />
      <section className="container-x grid items-center gap-10 py-12 md:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Our story</span>
          <h2 className="mt-2 text-3xl font-extrabold text-navy">Gaming and everyday tech in {shop.city}.</h2>
          <div className="mt-5 space-y-4 text-slate-600">
            <p>{shop.name} is a retail shop based in {shop.city}, {shop.country}. This pre-launch catalogue preview brings together the products and photos supplied from the shop’s Daraz catalogue.</p>
            <p>Prices are being set through a manual competitive review. Stock counts are not shown in this preview; contact Smart Arcade to confirm current availability.</p>
            <p>Visit or contact us in {shop.city} with questions about a product.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-navy">Shop now</Link>
            <Link to="/contact" className="btn btn-ghost">Visit the store</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-lime/30 blur-2xl" />
          <img src={shop.logo} alt={`${shop.name} logo`} className="relative w-full rounded-[2rem] shadow-2xl shadow-navy/30" />
        </div>
      </section>
      <section className="container-x">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-slate-200/80 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-navy"><Icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-bold text-navy">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
