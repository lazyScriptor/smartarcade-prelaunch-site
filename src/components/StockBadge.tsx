import type { Product } from '../data/products'

const map = {
  in: ['bg-emerald-500', 'text-emerald-700', 'In stock'],
  low: ['bg-amber-500', 'text-amber-700', 'Only a few left'],
  out: ['bg-slate-400', 'text-slate-500', 'Out of stock'],
} as const

export default function StockBadge({ stock }: { stock: Product['stock'] }) {
  const [dot, text, label] = map[stock]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
    </span>
  )
}
