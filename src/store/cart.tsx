import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { productById, type Product } from '../data/products'
import { load, save } from '../lib/storage'

export interface CartLine { key: string; id: string; variant?: string; qty: number }
export interface CartRow extends CartLine { product: Product; lineTotal: number }

interface CartState {
  rows: CartRow[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (id: string, variant?: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartCtx = createContext<CartState | null>(null)
const KEY = 'cart.v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => load<CartLine[]>(KEY, []))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    save(KEY, lines)
  }, [lines])

  const value = useMemo<CartState>(() => {
    const rows = lines
      .map(l => {
        const product = productById(l.id)
        return product ? { ...l, product, lineTotal: product.price * l.qty } : null
      })
      .filter((r): r is CartRow => r !== null)
    return {
      rows,
      count: rows.reduce((n, r) => n + r.qty, 0),
      subtotal: rows.reduce((n, r) => n + r.lineTotal, 0),
      open,
      setOpen,
      add: (id, variant, qty = 1) => {
        const key = variant ? `${id}::${variant}` : id
        setLines(prev => {
          const hit = prev.find(l => l.key === key)
          if (hit) return prev.map(l => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
          return [...prev, { key, id, variant, qty }]
        })
        setOpen(true)
      },
      setQty: (key, qty) =>
        setLines(prev => (qty <= 0 ? prev.filter(l => l.key !== key) : prev.map(l => (l.key === key ? { ...l, qty: Math.min(qty, 10) } : l)))),
      remove: key => setLines(prev => prev.filter(l => l.key !== key)),
      clear: () => setLines([]),
    }
  }, [lines, open])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
