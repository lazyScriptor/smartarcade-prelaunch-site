import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { shop, waLink } from '../config/shop'
import PageHeader from '../components/PageHeader'

export default function Contact() {
  const [f, setF] = useState({ name: '', phone: '', message: '' })
  const send = (e: FormEvent) => {
    e.preventDefault()
    window.open(waLink(`Hi ${shop.name}, I'm ${f.name} (${f.phone}).\n${f.message}`), '_blank', 'noopener')
  }
  const cards = [
    { icon: Phone, title: 'Call us', value: shop.phone, href: `tel:${shop.phoneHref}` },
    { icon: MessageCircle, title: 'WhatsApp', value: shop.phone, href: waLink(`Hi ${shop.name}!`) },
    { icon: Mail, title: 'Email', value: shop.email, href: `mailto:${shop.email}` },
    { icon: MapPin, title: 'Visit', value: shop.address, href: shop.mapsUrl },
  ]
  return (
    <>
      <PageHeader title="Contact & location" crumbs={[{ label: 'Contact' }]}>
        <p className="mt-3 max-w-xl text-white/70">Questions about a product, an order or a warranty? We usually reply on WhatsApp within minutes during opening hours.</p>
      </PageHeader>
      <section className="container-x py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, value, href }) => (
            <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group rounded-3xl border border-slate-200/80 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-lime transition group-hover:bg-lime group-hover:text-navy"><Icon className="h-6 w-6" /></div>
              <p className="mt-4 text-sm text-slate-500">{title}</p>
              <p className="break-words font-semibold text-navy">{value}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
            <iframe
              title={`${shop.name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(shop.mapsEmbedQuery)}&output=embed`}
              className="h-80 w-full lg:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold text-navy">{shop.name}</p>
                <p className="text-sm text-slate-500">{shop.address}</p>
              </div>
              <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-navy"><Navigation className="h-4 w-4" /> Get directions</a>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl bg-navy p-6 text-white">
              <h2 className="flex items-center gap-2 text-lg font-bold"><Clock className="h-5 w-5 text-lime" /> Opening hours</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {shop.hours.map(h => (
                  <div key={h.days} className="flex justify-between gap-4 border-b border-white/10 pb-3 last:border-0"><dt className="text-white/70">{h.days}</dt><dd className="font-semibold">{h.time}</dd></div>
                ))}
              </dl>
            </div>
            <form onSubmit={send} className="rounded-3xl border border-slate-200/80 bg-white p-6">
              <h2 className="text-lg font-bold text-navy">Send us a message</h2>
              <div className="mt-4 space-y-3">
                <input required className="input" placeholder="Your name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} aria-label="Your name" />
                <input required className="input" type="tel" placeholder="Mobile number" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} aria-label="Mobile number" />
                <textarea required rows={4} className="input" placeholder="How can we help?" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} aria-label="Message" />
              </div>
              <button className="btn btn-wa mt-4 w-full"><Send className="h-4 w-4" /> Send via WhatsApp</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
