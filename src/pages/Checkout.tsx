import { Banknote, CreditCard, Landmark, Lock, MessageCircle, Store, Truck } from 'lucide-react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { cardGateway, formatLKR, shop } from '../config/shop'
import { useCart } from '../store/cart'
import { cartWeightKg, deliveryFee, formatKg, type DeliveryMethod } from '../lib/totals'
import { districts, newOrderRef, normaliseMobile, saveOrder, type PaymentMethod } from '../lib/orders'
import PageHeader from '../components/PageHeader'
import ProductArt from '../components/ProductArt'

export default function Checkout() {
  const { rows, subtotal, clear } = useCart()
  const [delivery, setDelivery] = useState<DeliveryMethod>('delivery')
  const [payment, setPayment] = useState<PaymentMethod | ''>('')
  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '', city: '', district: 'Colombo', notes: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  // Set once the order is saved, so emptying the cart doesn't bounce us to /cart before the confirmation page loads.
  const placed = useRef<string | null>(null)

  if (placed.current) return <Navigate to={`/order/${placed.current}`} replace />
  if (rows.length === 0) return <Navigate to="/cart" replace />

  const weight = cartWeightKg(rows)
  const courierFee = deliveryFee(rows, 'delivery')
  const fee = deliveryFee(rows, delivery)
  const total = subtotal + fee
  const { card, bankTransfer, cod, payAtStore, whatsapp } = shop.payments
  const cardCap = cardGateway.maxPerPayment
  const overCardCap = cardCap !== null && total > cardCap
  const overCod = total > cod.max

  const allMethods: { id: PaymentMethod; icon: ReactNode; title: string; text: string; disabled?: string; show: boolean }[] = [
    {
      id: 'card', icon: <CreditCard className="h-5 w-5" />, title: `Credit / debit card (${cardGateway.name})`,
      text: `Visa, Mastercard, Amex — secure payment page by ${cardGateway.name}.`,
      disabled: !card.enabled ? 'Activating soon' : overCardCap ? `Card payments up to ${formatLKR(cardCap)} per order` : undefined,
      show: true,
    },
    { id: 'bank', icon: <Landmark className="h-5 w-5" />, title: 'Bank transfer', text: 'Transfer to our account and send us the slip. Dispatched once funds arrive.', show: bankTransfer.enabled },
    {
      id: 'cod', icon: <Banknote className="h-5 w-5" />, title: 'Cash on delivery', text: 'Pay the courier in cash when your parcel arrives.',
      disabled: overCod ? `COD available up to ${formatLKR(cod.max)}` : undefined,
      show: cod.enabled && delivery === 'delivery',
    },
    { id: 'store', icon: <Store className="h-5 w-5" />, title: 'Pay at the store', text: 'Pay by cash or card when you collect.', show: payAtStore.enabled && delivery === 'pickup' },
    { id: 'whatsapp', icon: <MessageCircle className="h-5 w-5" />, title: 'Confirm on WhatsApp', text: 'Send us your order on WhatsApp and we’ll confirm payment and delivery with you.', show: whatsapp.enabled },
  ]
  const methods = allMethods.filter(m => m.show)

  const clearError = (k: string) => setErrors(({ [k]: _, ...rest }) => rest)
  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    clearError(k)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (form.name.trim().length < 2) err.name = 'Please enter your full name.'
    const mobile = normaliseMobile(form.mobile)
    if (!mobile) err.mobile = 'Enter a valid Sri Lankan mobile number, e.g. 077 123 4567.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Please check your email address.'
    if (delivery === 'delivery' && form.address.trim().length < 5) err.address = 'Please enter your delivery address.'
    if (delivery === 'delivery' && !form.city.trim()) err.city = 'Please enter your city.'
    const chosen = methods.find(m => m.id === payment) // only shown methods count, so switching delivery type can't keep a hidden one
    if (!chosen || chosen.disabled) err.payment = 'Please choose an available payment method.'
    if (!agree) err.agree = 'Please accept the terms to continue.'
    setErrors(err)
    if (Object.keys(err).length) {
      document.getElementById(`f-${Object.keys(err)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const ref = newOrderRef()
    saveOrder({
      ref,
      createdAt: new Date().toISOString(),
      customer: { ...form, mobile: mobile! },
      delivery,
      payment: payment as PaymentMethod,
      items: rows.map(r => ({ name: r.product.name, variant: r.variant, qty: r.qty, price: r.product.price })),
      subtotal,
      deliveryFee: fee,
      total,
    })
    placed.current = ref
    clear()
  }

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <form onSubmit={submit} noValidate className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card step={1} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}><input id="f-name" className="input" autoComplete="name" value={form.name} onChange={upd('name')} /></Field>
              <Field id="mobile" label="Mobile number" error={errors.mobile}><input id="f-mobile" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" value={form.mobile} onChange={upd('mobile')} /></Field>
              <Field id="email" label="Email (optional — for your receipt)" error={errors.email} wide><input id="f-email" className="input" type="email" autoComplete="email" value={form.email} onChange={upd('email')} /></Field>
            </div>
          </Card>

          <Card step={2} title="Delivery">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice checked={delivery === 'delivery'} onChange={() => setDelivery('delivery')} name="delivery" icon={<Truck className="h-5 w-5" />}
                title={`Island-wide delivery – ${shop.delivery.courier}`} text={`${formatLKR(courierFee)} for your ${formatKg(weight)} order · charged by weight`} />
              <Choice checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} name="delivery" icon={<Store className="h-5 w-5" />}
                title={`Store pickup – ${shop.city}`} text="Free · we’ll message you when it’s ready" />
            </div>
            {delivery === 'delivery' && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id="address" label="Address" error={errors.address} wide><input id="f-address" className="input" autoComplete="street-address" placeholder="House no., street" value={form.address} onChange={upd('address')} /></Field>
                <Field id="city" label="City" error={errors.city}><input id="f-city" className="input" autoComplete="address-level2" value={form.city} onChange={upd('city')} /></Field>
                <Field id="district" label="District"><select id="f-district" className="input" value={form.district} onChange={upd('district')}>{districts.map(d => <option key={d}>{d}</option>)}</select></Field>
              </div>
            )}
            <div className="mt-4">
              <Field id="notes" label="Order notes (optional)" wide><textarea id="f-notes" rows={2} className="input" placeholder="Landmark, preferred delivery time…" value={form.notes} onChange={upd('notes')} /></Field>
            </div>
          </Card>

          <Card step={3} title="Payment">
            <div id="f-payment" className="grid gap-3">
              {methods.map(m => (
                <Choice key={m.id} name="payment" checked={payment === m.id} onChange={() => { setPayment(m.id); clearError('payment') }} icon={m.icon} title={m.title} text={m.text} disabled={m.disabled} />
              ))}
            </div>
            {errors.payment && <p className="mt-2 text-sm text-rose-600">{errors.payment}</p>}
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Lock className="h-3.5 w-3.5" /> Card details are entered only on {cardGateway.name}’s secure page — we never see or store them.</p>
          </Card>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-40">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
            <h2 className="text-lg font-bold text-navy">Order summary</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {rows.map(r => (
                <li key={r.key} className="flex gap-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <ProductArt product={r.product} size="sm" />
                    <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-[10px] font-bold text-navy">{r.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="line-clamp-2 font-medium text-slate-800">{r.product.name}</span>
                    {r.variant && <span className="text-xs text-slate-500">{r.variant}</span>}
                  </span>
                  <span className="text-sm font-semibold">{formatLKR(r.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd className="font-semibold">{formatLKR(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">{delivery === 'pickup' ? 'Store pickup' : `Delivery (${formatKg(weight)})`}</dt><dd className="font-semibold">{fee ? formatLKR(fee) : 'Free'}</dd></div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-display text-2xl font-extrabold text-navy">{formatLKR(total)}</dd></div>
            </dl>
            <label id="f-agree" className="mt-5 flex cursor-pointer gap-3 text-sm text-slate-600">
              <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-navy" checked={agree} onChange={e => { setAgree(e.target.checked); clearError('agree') }} />
              <span>I agree to the <Link to="/policies/terms" className="font-semibold text-navy underline">Terms & Conditions</Link> and <Link to="/policies/refunds" className="font-semibold text-navy underline">Returns & Refunds Policy</Link>.</span>
            </label>
            {errors.agree && <p className="mt-2 text-sm text-rose-600">{errors.agree}</p>}
            <button type="submit" className="btn btn-lime mt-5 w-full text-base">Place order · {formatLKR(total)}</button>
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

function Choice({ name, checked, onChange, icon, title, text, disabled }: { name: string; checked: boolean; onChange: () => void; icon: ReactNode; title: string; text: string; disabled?: string }) {
  return (
    <label className={`flex gap-3 rounded-2xl border-2 p-4 transition ${disabled ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-70' : checked ? 'cursor-pointer border-navy bg-navy/[0.03]' : 'cursor-pointer border-slate-200 hover:border-slate-300'}`}>
      <input type="radio" name={name} aria-label={title} className="sr-only" checked={checked} onChange={onChange} disabled={!!disabled} />
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${checked && !disabled ? 'bg-navy text-lime' : 'bg-slate-100 text-slate-500'}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
          {title}
          {disabled && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">{disabled}</span>}
        </span>
        <span className="block text-sm text-slate-500">{text}</span>
      </span>
      <span className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${checked && !disabled ? 'border-[6px] border-navy' : 'border-slate-300'}`} />
    </label>
  )
}
