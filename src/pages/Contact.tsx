import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import PageHeader from '../components/PageHeader'
import { shop, waLink } from '../config/shop'
import { usePageTitle } from '../hooks/ui'

export default function Contact() {
  usePageTitle('Contact & location')
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const send = (event: FormEvent) => {
    event.preventDefault()
    window.open(waLink(`Hi ${shop.name}, I'm ${form.name} (${form.phone}).\n${form.message}`), '_blank', 'noopener')
  }
  const cards = [
    { icon: Phone, title: 'Call us', value: shop.phone, href: `tel:${shop.phoneHref}`, sub: `or ${shop.phoneAlt}` },
    { icon: MessageCircle, title: 'WhatsApp', value: shop.phone, href: waLink(`Hi ${shop.name}!`) },
    { icon: Mail, title: 'Email', value: shop.email, href: `mailto:${shop.email}` },
    { icon: MapPin, title: 'Visit', value: shop.address, href: shop.mapsUrl },
  ]
  return (
    <>
      <PageHeader title="Contact & location" crumbs={[{ label: 'Contact' }]}>
        <p className="mt-2 max-w-xl text-[15px] text-[#d9daf0] md:text-base">Questions about a product, an order or a warranty? Message us on WhatsApp or give us a call.</p>
      </PageHeader>
      <section className="container-x pt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, value, href, sub }) => (
            <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="surface group flex items-center gap-3 p-4 transition-colors hover:border-lime lg:block">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-lime text-navy"><Icon className="h-5 w-5" /></span>
              <span className="block min-w-0 lg:mt-3">
                <span className="block text-[13px] text-muted">{title}</span>
                <span className="block break-words font-semibold text-white">{value}</span>
                {sub && <span className="block text-sm text-[#d9daf0]">{sub}</span>}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="surface overflow-hidden">
            <iframe
              title={`${shop.name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(shop.mapsEmbedQuery)}&output=embed`}
              className="h-72 w-full border-0 lg:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-white">{shop.name}</p>
                <p className="text-sm text-[#d9daf0]">{shop.address}</p>
              </div>
              <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-lime"><Navigation className="h-5 w-5" /> Get directions</a>
            </div>
          </div>
          <div className="space-y-5">
            {shop.hoursConfirmed && (
              <div className="surface p-5">
                <h2 className="flex items-center gap-2 text-lg text-white"><Clock className="h-5 w-5 text-lime" /> Opening hours</h2>
                <dl className="mt-3 space-y-2 text-[15px]">
                  {shop.hours.map(hour => (
                    <div key={hour.days} className="flex justify-between gap-4"><dt className="text-[#d9daf0]">{hour.days}</dt><dd className="font-semibold text-white">{hour.time}</dd></div>
                  ))}
                </dl>
              </div>
            )}
            <form onSubmit={send} className="surface p-4 md:p-5">
              <h2 className="text-xl text-white">Send us a message</h2>
              <p className="mt-1 text-sm text-muted">This opens WhatsApp with your message ready to send.</p>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-[15px] font-medium text-[#e4e5f7]">Your name</label>
                  <input id="c-name" required autoComplete="name" className="input" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
                </div>
                <div>
                  <label htmlFor="c-phone" className="mb-1.5 block text-[15px] font-medium text-[#e4e5f7]">Mobile number</label>
                  <input id="c-phone" required type="tel" inputMode="tel" autoComplete="tel" className="input" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} />
                </div>
                <div>
                  <label htmlFor="c-message" className="mb-1.5 block text-[15px] font-medium text-[#e4e5f7]">How can we help?</label>
                  <textarea id="c-message" required rows={4} className="input" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} />
                </div>
              </div>
              <button className="btn btn-wa mt-4 w-full"><Send className="h-5 w-5" /> Send on WhatsApp</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
