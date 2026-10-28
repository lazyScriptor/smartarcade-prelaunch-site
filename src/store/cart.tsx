import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { catalogProductById, type CatalogProduct } from '../data/catalog'
import { load, save } from '../lib/storage'

export interface CartLine { key: string; id: string; qty: number }
export interface CartRow extends CartLine { product: CatalogProduct; lineTotal: number | null }

interface CartState {
  rows: CartRow[]
  count: number
  subtotal: number
  unpricedCount: number
  add: (id: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartCtx = createContext<CartState | null>(null)
const KEY = 'catalog-cart.v1'
const maxQuantity = 10

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => load<CartLine[]>(KEY, []))

  useEffect(() => {
    save(KEY, lines)
  }, [lines])

  const value = useMemo<CartState>(() => {
    const rows = lines
      .map(line => {
        const product = catalogProductById(line.id)
        if (!product) return null
        return { ...line, product, lineTotal: product.price === null ? null : product.price * line.qty }
      })
      .filter((row): row is CartRow => row !== null)

    return {
      rows,
      count: rows.reduce((total, row) => total + row.qty, 0),
      subtotal: rows.reduce((total, row) => total + (row.lineTotal ?? 0), 0),
      unpricedCount: rows.filter(row => row.lineTotal === null).reduce((total, row) => total + row.qty, 0),
      add: (id, qty = 1) => setLines(previous => {
        const key = id
        const existing = previous.find(line => line.key === key)
        if (existing) return previous.map(line => line.key === key ? { ...line, qty: Math.min(line.qty + qty, maxQuantity) } : line)
        return [...previous, { key, id, qty: Math.max(1, Math.min(qty, maxQuantity)) }]
      }),
      setQty: (key, qty) => setLines(previous => qty <= 0
        ? previous.filter(line => line.key !== key)
        : previous.map(line => line.key === key ? { ...line, qty: Math.min(qty, maxQuantity) } : line)),
      remove: key => setLines(previous => previous.filter(line => line.key !== key)),
      clear: () => setLines([]),
    }
  }, [lines])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const context = useContext(CartCtx)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
