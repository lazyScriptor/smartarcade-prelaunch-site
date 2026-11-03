import { Search, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatLKR } from '../config/shop'
import { catalogProducts, matchesQuery } from '../data/catalog'
import CatalogImage from './CatalogImage'

const priceLabel = (price: number | null, from: boolean) => (price === null ? 'Price on request' : `${from ? 'From ' : ''}${formatLKR(price)}`)

export default function SearchBox({ onDone, autoFocus = false, inline = false }: { onDone?: () => void; autoFocus?: boolean; inline?: boolean }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const listId = useId()
  const term = q.trim()

  // Inside a modal dialog the browser focuses the first control when it opens, so focus the field just after.
  useEffect(() => {
    if (!autoFocus) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(timer)
  }, [autoFocus])

  const hits = useMemo(() => {
    if (term.length < 2) return []
    const matches = catalogProducts.filter(product => matchesQuery(product, term))
    return [...matches].sort((a, b) => Number(b.price !== null) - Number(a.price !== null)).slice(0, 6)
  }, [term])

  // Close the dropdown when the visitor presses anywhere else on the page.
  useEffect(() => {
    if (inline) return
    const onPointerDown = (event: PointerEvent) => {
      if (!formRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [inline])

  const finish = () => {
    setQ('')
    setOpen(false)
    onDone?.()
  }
  const showList = (inline || open) && term.length >= 2

  return (
    <form
      ref={formRef}
      role="search"
      className="relative w-full"
      onSubmit={event => {
        event.preventDefault()
        if (!term) return
        finish()
        navigate(`/shop?q=${encodeURIComponent(term)}`)
      }}
      onBlur={event => {
        // Tabbing away closes it. Mouse and touch are handled above: Safari reports no target when a
        // link is clicked, so closing here would hide the results before the click lands.
        const next = event.relatedTarget as Node | null
        if (next && !event.currentTarget.contains(next)) setOpen(false)
      }}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          value={q}
          onChange={event => { setQ(event.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={event => { if (event.key === 'Escape' && !inline) setOpen(false) }}
          type="search"
          enterKeyHint="search"
          placeholder="Search JBL, power bank, smart watch…"
          aria-label="Search products"
          aria-controls={listId}
          className="input pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button type="button" onClick={() => { setQ(''); inputRef.current?.focus() }} aria-label="Clear search" className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {/* Keeps focus in the field while a result is pressed, so the list and on-screen keyboard stay put until the click lands. */}
      <div id={listId} onMouseDown={event => event.preventDefault()} className={showList ? (inline ? 'mt-3' : 'absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line bg-navy shadow-2xl shadow-black/50') : 'hidden'}>
        {hits.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} onClick={finish} className="flex min-h-14 items-center gap-3 px-3 py-2 transition-colors hover:bg-tint">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
              <CatalogImage src={product.cardImage} alt="" sizes="48px" className="h-full w-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-medium text-ink">{product.name}</span>
              <span className="price text-sm text-accent">{priceLabel(product.price, product.priceFrom)}</span>
            </span>
          </Link>
        ))}
        {hits.length === 0 && <p className="px-4 py-4 text-[15px] text-muted">Nothing found for “{term}”. Try a brand or product type.</p>}
        {hits.length > 0 && (
          <Link to={`/shop?q=${encodeURIComponent(term)}`} onClick={finish} className="hud flex min-h-12 items-center border-t border-line px-4 text-[15px] text-accent hover:bg-tint">
            See all results for “{term}”
          </Link>
        )}
      </div>
    </form>
  )
}
