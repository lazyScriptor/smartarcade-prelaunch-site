import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatLKR, shop } from '../config/shop'
import { useCart } from '../store/cart'
import CatalogImage from '../components/CatalogImage'
import PageHeader from '../components/PageHeader'
import QtyStepper from '../components/QtyStepper'

export default function Cart() {
  const { rows, subtotal, unpricedCount, setQty, remove } = useCart()
  return (
    <>
      <PageHeader title="Your cart" crumbs={[{ label: 'Cart' }]}>
        <p className="mt-3 max-w-xl text-sm text-white/65">Build your list, then send it to us on WhatsApp. We confirm stock, final prices and delivery before anything is charged.</p>
      </PageHeader>
      <div className="container-x py-8">
        {rows.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 font-semibold text-navy">Your cart is empty</p>
            <Link to="/shop" className="btn btn-navy mt-6">Browse products</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white px-5">
              {rows.map(r => (
                <li key={r.key} className="flex gap-4 py-5">
                  <Link to={`/product/${r.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                    <CatalogImage src={r.product.cardImage} alt={r.product.name} className="h-full w-full object-contain p-1.5" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${r.id}`} className="line-clamp-2 font-semibold text-slate-900 hover:text-navy">{r.product.name}</Link>
                      <p className="mt-1 text-sm text-slate-500">{r.product.price === null ? 'Price to be confirmed' : `${r.product.priceFrom ? 'From ' : ''}${formatLKR(r.product.price)} each`}</p>
                    </div>
                    <QtyStepper small value={r.qty} onChange={n => setQty(r.key, n)} />
                    <span className="w-28 font-bold text-navy sm:text-right">{r.lineTotal === null ? 'To be confirmed' : formatLKR(r.lineTotal)}</span>
                  </div>
                  <button onClick={() => remove(r.key)} className="self-start text-slate-400 hover:text-rose-500" aria-label={`Remove ${r.product.name}`}><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6">
              <h2 className="text-lg font-bold text-navy">Order summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-slate-600">Items{unpricedCount > 0 && ' (priced only)'}</dt><dd className="font-semibold">{subtotal > 0 ? formatLKR(subtotal) : 'To be confirmed'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-600">Delivery</dt><dd className="text-right font-semibold">Confirmed by us</dd></div>
              </dl>
              {unpricedCount > 0 && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{unpricedCount} {unpricedCount === 1 ? 'item has' : 'items have'} no price yet. We will confirm {unpricedCount === 1 ? 'it' : 'them'} on WhatsApp.</p>}
              <p className="mt-3 text-xs text-slate-500">Delivery is charged by weight (from Rs. {shop.delivery.rates.baseFee} for the first {shop.delivery.rates.baseKg} kg). Store pickup in {shop.city} is free. No payment is taken on this site.</p>
              <Link to="/checkout" className="btn btn-lime mt-5 w-full">Continue to order request <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/shop" className="btn btn-ghost mt-3 w-full">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
