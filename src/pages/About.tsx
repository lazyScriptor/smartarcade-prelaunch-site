import { BadgeCheck, HeartHandshake, ShieldCheck, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { shop } from '../config/shop'
import PageHeader from '../components/PageHeader'

const values = [
  { icon: BadgeCheck, title: 'Genuine only', text: 'We sell original, sealed products and clearly label every pre-owned item.' },
  { icon: ShieldCheck, title: 'Real warranty', text: 'Every unit is recorded by serial number — your invoice is your warranty card.' },
  { icon: Wrench, title: 'Tested by gamers', text: 'Pre-owned consoles are cleaned, tested and reset before they reach you.' },
  { icon: HeartHandshake, title: 'Honest advice', text: 'We’ll recommend what fits your budget, not just the most expensive option.' },
]

export default function About() {
  return (
    <>
      <PageHeader title={`About ${shop.name}`} crumbs={[{ label: 'About us' }]} />
      <section className="container-x grid items-center gap-10 py-12 md:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Our story</span>
          <h2 className="mt-2 text-3xl font-extrabold text-navy">Gamers serving gamers in {shop.city}.</h2>
          <div className="mt-5 space-y-4 text-slate-600">
            <p>{shop.name} is a gaming and smart-gadget store based in {shop.city}, {shop.country}. We stock the latest PlayStation, Nintendo and Xbox consoles, controllers, headsets, accessories and everyday smart gadgets.</p>
            <p>We started with a simple idea: buying a console should feel as exciting as playing on one. That means fair prices, genuine products, a real warranty and people who actually play the games behind the counter.</p>
            <p>Shop online with island-wide delivery, or visit us in {shop.city} to see the products in person.</p>
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
