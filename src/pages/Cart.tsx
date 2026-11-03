import { ArrowRight, MessageCircle, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import CatalogImage from '../components/CatalogImage'
import PageHeader from '../components/PageHeader'
import QtyStepper from '../components/QtyStepper'
import { formatLKR, shop } from '../config/shop'
import { usePageTitle } from '../hooks/ui'
import { useCart } from '../store/cart'

export default function Cart() {
  const { rows, subtotal, unpricedCount, setQty, remove } = useCart()
  usePageTitle('Your cart')
  return (
    <>
      <PageHeader title="Your cart" crumbs={[{ label: 'Cart' }]}>
        <p className="mt-2 max-w-xl text-[15px] text-body">Send your list to us on WhatsApp. We confirm stock, final prices and delivery before you pay anything.</p>
      </PageHeader>
      <div className="container-x pt-6">
        {rows.length === 0 ? (
          <div className="surface mx-auto max-w-md p-10 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-accent" strokeWidth={1.5} />
            <p className="font-display mt-4 text-xl text-ink">Your cart is empty</p>
            <p className="mt-1 text-[15px] text-muted">Insert coin. Or just pick something you like.</p>
            <Link to="/shop" className="btn btn-lime mt-6">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {rows.map(row => (
                <li key={row.key} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                  <Link to={`/product/${row.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24" aria-label={row.product.name}>
                    <CatalogImage src={row.product.cardImage} alt="" sizes="96px" className="h-full w-full object-contain p-1.5" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <Link to={`/product/${row.id}`} className="line-clamp-2 flex-1 text-[15px] font-medium leading-snug text-ink hover:text-accent">{row.product.name}</Link>
                      <button onClick={() => remove(row.key)} aria-label={`Remove ${row.product.name}`} className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center text-muted transition-colors hover:text-rose-400"><Trash2 className="h-5 w-5" /></button>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{row.product.price === null ? 'Price on request' : `${row.product.priceFrom ? 'From ' : ''}${formatLKR(row.product.price)} each`}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <QtyStepper value={row.qty} onChange={value => setQty(row.key, value)} />
                      <span className="price text-base text-accent">{row.lineTotal === null ? 'We’ll confirm' : formatLKR(row.lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="surface p-5 lg:sticky lg:top-24">
              <h2 className="text-xl text-ink">Summary</h2>
              <dl className="mt-3 space-y-2.5 text-[15px]">
                <div className="flex justify-between gap-4"><dt className="text-body">Items{unpricedCount > 0 && ' with a price'}</dt><dd className="price text-ink">{subtotal > 0 ? formatLKR(subtotal) : 'We’ll confirm'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-body">Delivery</dt><dd className="text-right text-ink">We’ll confirm</dd></div>
              </dl>
              {unpricedCount > 0 && <p className="mt-3 rounded-xl border border-lime/40 bg-lime/10 p-3 text-sm text-ink">{unpricedCount} {unpricedCount === 1 ? 'item needs' : 'items need'} a price. We’ll send {unpricedCount === 1 ? 'it' : 'them'} to you on WhatsApp.</p>}
              <p className="mt-3 text-sm leading-relaxed text-muted">Delivery is charged by weight, from {formatLKR(shop.delivery.rates.baseFee)} for the first {shop.delivery.rates.baseKg} kg. Store pickup in {shop.city} is free. No payment is taken on this site.</p>
              <Link to="/checkout" className="btn btn-lime mt-4 w-full"><MessageCircle className="h-5 w-5" /> Continue to order <ArrowRight className="h-5 w-5" /></Link>
              <Link to="/shop" className="btn btn-ghost mt-3 w-full">Keep shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
