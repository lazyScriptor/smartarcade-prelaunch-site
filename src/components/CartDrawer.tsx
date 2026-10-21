import { ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatLKR, shop } from '../config/shop'
import { useCart } from '../store/cart'
import ProductArt from './ProductArt'
import QtyStepper from './QtyStepper'

export default function CartDrawer() {
  const { open, setOpen, rows, subtotal, setQty, remove } = useCart()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])
  if (!open) return null

  const toFree = shop.delivery.freeAbove - subtotal
  const pct = Math.min(100, (subtotal / shop.delivery.freeAbove) * 100)

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-navy">Your cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart"><X className="h-6 w-6 text-slate-500" /></button>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100"><ShoppingBag className="h-9 w-9 text-slate-400" /></div>
            <p className="text-slate-600">Your cart is empty.</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="btn btn-navy">Start shopping</Link>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-sm text-slate-600">
                {toFree > 0 ? <>Add <b className="text-navy">{formatLKR(toFree)}</b> more for free delivery</> : <b className="text-emerald-600">You’ve unlocked free island-wide delivery!</b>}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-lime transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {rows.map(r => (
                <li key={r.key} className="flex gap-4 py-4">
                  <Link to={`/product/${r.id}`} onClick={() => setOpen(false)} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <ProductArt product={r.product} size="sm" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">{r.product.name}</p>
                    {r.variant && <p className="text-xs text-slate-500">Colour: {r.variant}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper small value={r.qty} onChange={n => setQty(r.key, n)} />
                      <span className="text-sm font-bold text-navy">{formatLKR(r.lineTotal)}</span>
                    </div>
                  </div>
                  <button onClick={() => remove(r.key)} className="self-start text-slate-400 hover:text-rose-500" aria-label="Remove item"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-slate-100 p-5">
              <div className="flex justify-between text-base"><span className="text-slate-600">Subtotal</span><b className="text-navy">{formatLKR(subtotal)}</b></div>
              <p className="text-xs text-slate-500">Delivery calculated at checkout.</p>
              <Link to="/checkout" onClick={() => setOpen(false)} className="btn btn-lime w-full">Checkout</Link>
              <Link to="/cart" onClick={() => setOpen(false)} className="btn btn-ghost w-full">View cart</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
