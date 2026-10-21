import { CheckCircle2, Landmark, MessageCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { cardGateway, formatLKR, shop, waLink } from '../config/shop'
import { findOrder } from '../lib/orders'
import NotFound from './NotFound'

const payLabel = { card: `Card (${cardGateway.name})`, bank: 'Bank transfer', cod: 'Cash on delivery', store: 'Pay at the store', whatsapp: 'Confirm on WhatsApp' }

export default function OrderPlaced() {
  const { ref = '' } = useParams()
  const order = findOrder(ref)
  if (!order) return <NotFound />

  const msg = [
    `Hi ${shop.name}, I'd like to confirm my order ${order.ref}:`,
    ...order.items.map(i => `• ${i.qty} × ${i.name}${i.variant ? ` (${i.variant})` : ''} – ${formatLKR(i.price * i.qty)}`),
    `Delivery: ${order.delivery === 'pickup' ? `Store pickup (${shop.city})` : `${order.customer.address}, ${order.customer.city}, ${order.customer.district}`}`,
    `Total: ${formatLKR(order.total)}`,
    `Payment: ${payLabel[order.payment]}`,
    `Name: ${order.customer.name} · ${order.customer.mobile}`,
    order.customer.notes && `Notes: ${order.customer.notes}`,
  ].filter(Boolean).join('\n')

  const { bankTransfer: bank } = shop.payments

  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-navy p-8 text-center text-white">
          <CheckCircle2 className="mx-auto h-14 w-14 text-lime" />
          <h1 className="mt-4 text-3xl font-extrabold">Thank you, {order.customer.name.split(' ')[0]}!</h1>
          <p className="mt-2 text-white/70">Your order reference is</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-wider text-lime">{order.ref}</p>
        </div>

        <div className="mt-6 rounded-3xl border-2 border-[#25d366] bg-white p-6">
          <h2 className="text-lg font-bold text-navy">One last step: send your order to us</h2>
          <p className="mt-1 text-sm text-slate-600">Tap below to send the order details on WhatsApp. We’ll confirm stock, payment and delivery with you right away.</p>
          <a href={waLink(msg)} target="_blank" rel="noreferrer" className="btn btn-wa mt-4 w-full"><MessageCircle className="h-5 w-5" /> Send order on WhatsApp</a>
        </div>

        {order.payment === 'bank' && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-navy"><Landmark className="h-5 w-5" /> Bank transfer details</h2>
            <dl className="mt-4 grid grid-cols-[130px_1fr] gap-y-2 text-sm">
              <dt className="text-slate-500">Bank</dt><dd className="font-semibold">{bank.bank}</dd>
              <dt className="text-slate-500">Branch</dt><dd className="font-semibold">{bank.branch}</dd>
              <dt className="text-slate-500">Account name</dt><dd className="font-semibold">{bank.accountName}</dd>
              <dt className="text-slate-500">Account no.</dt><dd className="font-semibold">{bank.accountNumber}</dd>
              <dt className="text-slate-500">Amount</dt><dd className="font-semibold">{formatLKR(order.total)}</dd>
              <dt className="text-slate-500">Reference</dt><dd className="font-semibold">{order.ref}</dd>
            </dl>
            <p className="mt-4 text-sm text-slate-600">Please send the transfer slip on WhatsApp. Your order ships once the funds reach our account.</p>
          </div>
        )}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-navy">Order summary</h2>
          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {order.items.map(i => (
              <li key={i.name + i.variant} className="flex justify-between gap-4 py-2.5">
                <span>{i.qty} × {i.name}{i.variant && <span className="text-slate-500"> ({i.variant})</span>}</span>
                <span className="font-semibold">{formatLKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{formatLKR(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">{order.delivery === 'pickup' ? 'Store pickup' : 'Delivery'}</dt><dd>{order.deliveryFee ? formatLKR(order.deliveryFee) : 'Free'}</dd></div>
            <div className="flex justify-between text-base font-bold text-navy"><dt>Total</dt><dd>{formatLKR(order.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Payment</dt><dd>{payLabel[order.payment]}</dd></div>
          </dl>
        </div>

        <div className="mt-6 text-center">
          <Link to="/shop" className="btn btn-navy">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}
