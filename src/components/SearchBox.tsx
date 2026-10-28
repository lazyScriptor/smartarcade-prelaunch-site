import { Search } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogProducts, catalogCategories } from '../data/catalog'
import CatalogImage from './CatalogImage'

export default function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const navigate = useNavigate()
  const blurTimer = useRef<number>(0)

  const hits = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    return catalogProducts.filter(p => `${p.name} ${p.nameSi} ${p.category}`.toLowerCase().includes(t)).slice(0, 5)
  }, [q])

  const go = (path: string) => {
    setQ('')
    setFocus(false)
    onDone?.()
    navigate(path)
  }

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={e => {
        e.preventDefault()
        if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`)
      }}
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => (blurTimer.current = window.setTimeout(() => setFocus(false), 150))}
        placeholder="Search the product catalogue…"
        aria-label="Search products"
        className="w-full rounded-xl border border-white/10 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-lime"
      />
      {focus && hits.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {hits.map(p => (
            <button
              type="button"
              key={p.id}
              onMouseDown={() => go(`/product/${p.id}`)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
            >
              <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                <CatalogImage src={p.cardImage} alt="" className="h-full w-full object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">{p.name}</span>
                <span className="text-xs capitalize text-slate-500">{catalogCategories.find(c => c.id === p.category)?.name}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            onMouseDown={() => go(`/shop?q=${encodeURIComponent(q.trim())}`)}
            className="w-full border-t border-slate-100 px-3 py-2 text-left text-sm font-semibold text-navy hover:bg-slate-50"
          >
            See all results for “{q.trim()}”
          </button>
        </div>
      )}
    </form>
  )
}
