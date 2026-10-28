import { CheckCircle2, MessageCircle, Store, Truck } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { formatLKR, shop } from '../config/shop'
import { useCart } from '../store/cart'
import { districts, normaliseMobile, orderRequestLink, type OrderRequest } from '../lib/orders'
import type { DeliveryMethod } from '../lib/totals'
import CatalogImage from '../components/CatalogImage'
import PageHeader from '../components/PageHeader'

export default function Checkout() {
  const { rows, subtotal, unpricedCount, clear } = useCart()
  const [delivery, setDelivery] = useState<DeliveryMethod>('delivery')
  const [form, setForm] = useState({ name: '', mobile: '', address: '', city: '', district: 'Colombo', notes: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [link, setLink] = useState<string | null>(null)

  if (link) {
    return (
      <>
        <PageHeader title="Request ready" crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Order request' }]} />
        <div className="container-x py-12">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200/80 bg-white p-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-extrabold text-navy">Your request is ready in WhatsApp</h2>
            <p className="mt-2 text-slate-600">Tap <b>Send</b> in WhatsApp to place the request. Nothing reaches us until you do. We will reply to confirm stock, final prices, delivery and how to pay.</p>
            <a href={link} target="_blank" rel="noreferrer" className="btn btn-wa mt-6 w-full"><MessageCircle className="h-5 w-5" /> Open WhatsApp again</a>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link to="/cart" className="btn btn-ghost">Back to cart</Link>
              <button className="btn btn-navy" onClick={() => { clear(); setLink(null) }}>Done — clear cart</button>
            </div>
          </div>
        </div>
      </>
    )
  }
  if (rows.length === 0) return <Navigate to="/cart" replace />

  const clearError = (key: string) => setErrors(({ [key]: _removed, ...rest }) => rest)
  const upd = (key: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    clearError(key)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (form.name.trim().length < 2) err.name = 'Please enter your name.'
    const mobile = normaliseMobile(form.mobile)
    if (!mobile) err.mobile = 'Enter a valid Sri Lankan mobile number, e.g. 077 123 4567.'
    if (delivery === 'delivery' && form.address.trim().length < 5) err.address = 'Please enter your delivery address.'
    if (delivery === 'delivery' && !form.city.trim()) err.city = 'Please enter your city.'
    if (!agree) err.agree = 'Please accept the terms to continue.'
    setErrors(err)
    const first = Object.keys(err)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const request: OrderRequest = {
      name: form.name.trim(), mobile: mobile!, delivery,
      address: form.address.trim(), city: form.city.trim(), district: form.district, notes: form.notes.trim(),
    }
    const url = orderRequestLink(rows, request)
    setLink(url)
    window.open(url, '_blank', 'noopener')
  }

  return (
    <>
      <PageHeader title="Order request" crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Order request' }]}>
        <p className="mt-3 max-w-xl text-sm text-white/65">Tell us where to send it. We will open WhatsApp with your request ready to send.</p>
      </PageHeader>
      <form onSubmit={submit} noValidate className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card step={1} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}><input id="f-name" className="input" autoComplete="name" value={form.name} onChange={upd('name')} /></Field>
              <Field id="mobile" label="Mobile number" error={errors.mobile}><input id="f-mobile" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" value={form.mobile} onChange={upd('mobile')} /></Field>
            </div>
          </Card>

          <Card step={2} title="Delivery">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice checked={delivery === 'delivery'} onChange={() => setDelivery('delivery')} icon={<Truck className="h-5 w-5" />} title="Island-wide delivery" text="Charged by weight; we confirm the amount" />
              <Choice checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} icon={<Store className="h-5 w-5" />} title={`Store pickup – ${shop.city}`} text="Free · we’ll message you when it’s ready" />
            </div>
            {delivery === 'delivery' && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id="address" label="Address" error={errors.address} wide><input id="f-address" className="input" autoComplete="street-address" placeholder="House no., street" value={form.address} onChange={upd('address')} /></Field>
                <Field id="city" label="City" error={errors.city}><input id="f-city" className="input" autoComplete="address-level2" value={form.city} onChange={upd('city')} /></Field>
                <Field id="district" label="District"><select id="f-district" className="input" value={form.district} onChange={upd('district')}>{districts.map(d => <option key={d}>{d}</option>)}</select></Field>
              </div>
            )}
            <div className="mt-4">
              <Field id="notes" label="Notes (optional)" wide><textarea id="f-notes" rows={2} className="input" placeholder="Landmark, preferred delivery time…" value={form.notes} onChange={upd('notes')} /></Field>
            </div>
          </Card>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-40">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
            <h2 className="text-lg font-bold text-navy">Your request</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {rows.map(r => (
                <li key={r.key} className="flex gap-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                    <CatalogImage src={r.product.cardImage} alt="" className="h-full w-full object-contain p-1" />
                    <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-[10px] font-bold text-navy">{r.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-slate-800"><span className="line-clamp-2">{r.product.name}</span></span>
                  <span className="text-right text-sm font-semibold">{r.lineTotal === null ? 'TBC' : formatLKR(r.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Items{unpricedCount > 0 && ' (priced only)'}</dt><dd className="font-semibold">{subtotal > 0 ? formatLKR(subtotal) : 'To be confirmed'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">{delivery === 'pickup' ? 'Store pickup' : 'Delivery'}</dt><dd className="font-semibold">{delivery === 'pickup' ? 'Free' : 'Confirmed by us'}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">This is a request, not a payment. Final prices, stock and the way to pay are confirmed on WhatsApp.</p>
            <label id="f-agree" className="mt-4 flex cursor-pointer gap-3 text-sm text-slate-600">
              <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-navy" checked={agree} onChange={e => { setAgree(e.target.checked); clearError('agree') }} />
              <span>I agree to the <Link to="/policies/terms" className="font-semibold text-navy underline">Terms & Conditions</Link> and <Link to="/policies/refunds" className="font-semibold text-navy underline">Returns & Refunds Policy</Link>.</span>
            </label>
            {errors.agree && <p className="mt-2 text-sm text-rose-600">{errors.agree}</p>}
            <button type="submit" className="btn btn-wa mt-5 w-full text-base"><MessageCircle className="h-5 w-5" /> Send request on WhatsApp</button>
          </div>
        </aside>
      </form>
    </>
  )
}

function Card({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-navy">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-sm text-lime">{step}</span>{title}
      </h2>
      {children}
    </section>
  )
}

function Field({ id, label, error, wide, children }: { id: string; label: string; error?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={`f-${id}`} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
    </div>
  )
}

function Choice({ checked, onChange, icon, title, text }: { checked: boolean; onChange: () => void; icon: ReactNode; title: string; text: string }) {
  return (
    <label className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition ${checked ? 'border-navy bg-navy/[0.03]' : 'border-slate-200 hover:border-slate-300'}`}>
      <input type="radio" name="delivery" aria-label={title} className="sr-only" checked={checked} onChange={onChange} />
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${checked ? 'bg-navy text-lime' : 'bg-slate-100 text-slate-500'}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="block text-sm text-slate-500">{text}</span>
      </span>
      <span className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${checked ? 'border-[6px] border-navy' : 'border-slate-300'}`} />
    </label>
  )
}
