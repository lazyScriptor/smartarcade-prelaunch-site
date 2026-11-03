import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import CatalogCard from '../components/CatalogCard'
import PageHeader from '../components/PageHeader'
import { formatLKR } from '../config/shop'
import { catalogProducts, categoryById, matchesQuery, topBrands, visibleCatalogCategories } from '../data/catalog'
import { usePageTitle } from '../hooks/ui'
import NotFound from './NotFound'

const pageSize = 24
const sorts = { featured: 'Featured', 'price-asc': 'Lowest price', 'price-desc': 'Highest price', name: 'Name A–Z' } as const
type SortKey = keyof typeof sorts

export default function CatalogPage() {
  const { category: categoryParam } = useParams<{ category?: string }>()
  const [params, setParams] = useSearchParams()
  const gridTop = useRef<HTMLDivElement>(null)
  const category = categoryById(categoryParam)
  const query = params.get('q') ?? ''
  const brand = params.get('brand') ?? ''
  const pricedOnly = params.get('priced') === '1'
  const max = Number(params.get('max') ?? '') || 0
  const sort: SortKey = (params.get('sort') as SortKey) in sorts ? (params.get('sort') as SortKey) : 'featured'
  const requestedPage = Math.max(1, Number(params.get('page') ?? '1') || 1)

  const filtered = useMemo(() => {
    const list = catalogProducts.filter(product =>
      (!category || product.category === category.id) &&
      matchesQuery(product, query) &&
      (!brand || product.brand === brand) &&
      (!pricedOnly || product.price !== null) &&
      (!max || (product.price !== null && product.price <= max)),
    )
    const priceOf = (price: number | null, missing: number) => price ?? missing
    if (sort === 'price-asc') return [...list].sort((a, b) => priceOf(a.price, Infinity) - priceOf(b.price, Infinity))
    if (sort === 'price-desc') return [...list].sort((a, b) => priceOf(b.price, -1) - priceOf(a.price, -1))
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name))
    return [...list].sort((a, b) => Number(b.price !== null) - Number(a.price !== null))
  }, [category, query, brand, pricedOnly, max, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(requestedPage, totalPages)
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: key !== 'page' })
  }
  const goToPage = (value: number) => {
    update('page', String(value))
    const top = (gridTop.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 76
    window.scrollTo({ top, behavior: 'instant' })
  }

  const title = category?.name ?? (query ? `Results for “${query}”` : 'All products')
  usePageTitle(category?.name ?? 'Shop all products')
  if (categoryParam && !category) return <NotFound />

  const activeFilters = [
    query && { key: 'q', label: `“${query}”` },
    brand && { key: 'brand', label: brand },
    max > 0 && { key: 'max', label: `Up to ${formatLKR(max)}` },
  ].filter((item): item is { key: string; label: string } => !!item)
  const keepQuery = (() => {
    const next = new URLSearchParams(params)
    next.delete('page')
    const text = next.toString()
    return text ? `?${text}` : ''
  })()

  return (
    <>
      <PageHeader title={title} crumbs={[{ label: 'Shop', to: category ? '/shop' : undefined }, ...(category ? [{ label: category.name }] : [])]}>
        {category && <p className="mt-2 max-w-2xl text-[15px] text-[#d9daf0] md:text-base">{category.blurb}</p>}
      </PageHeader>

      <nav aria-label="Product types" className="sticky top-[61px] z-30 border-b border-line bg-[rgba(10,10,43,0.95)] backdrop-blur-md lg:top-[69px]">
        <div className="container-x no-scrollbar flex gap-2 overflow-x-auto py-2">
          <Link to={`/shop${keepQuery}`} aria-current={!category ? 'page' : undefined} className="chip">All</Link>
          {visibleCatalogCategories.map(item => (
            <Link key={item.id} to={`/shop/${item.id}${keepQuery}`} aria-current={category?.id === item.id ? 'page' : undefined} className="chip">{item.name}</Link>
          ))}
        </div>
      </nav>

      <section className="container-x pt-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_210px_180px] md:items-end">
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="shop-search" className="sr-only md:not-sr-only md:mb-1 md:block md:text-[13px] md:text-muted">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input id="shop-search" type="search" enterKeyHint="search" value={query} onChange={event => update('q', event.target.value)} placeholder="Product or brand" className="input pl-11" />
            </div>
          </div>
          <div>
            <label htmlFor="shop-sort" className="mb-1 block text-[13px] text-muted">Sort by</label>
            <select id="shop-sort" className="input" value={sort} onChange={event => update('sort', event.target.value === 'featured' ? '' : event.target.value)}>
              {Object.entries(sorts).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="shop-brand" className="mb-1 block text-[13px] text-muted">Brand</label>
            <select id="shop-brand" className="input" value={brand} onChange={event => update('brand', event.target.value)}>
              <option value="">All brands</option>
              {topBrands.map(item => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div ref={gridTop} className="mb-4 mt-4 flex flex-wrap items-center gap-2">
          <p className="hud mr-auto text-[15px] text-white" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</p>
          <button type="button" aria-pressed={pricedOnly} onClick={() => update('priced', pricedOnly ? '' : '1')} className="chip">With price only</button>
          {activeFilters.map(item => (
            <button key={item.key} onClick={() => update(item.key, '')} aria-label={`Remove filter ${item.label}`} className="chip border-lime/60 text-lime">
              {item.label} <X className="h-4 w-4" />
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((product, index) => <CatalogCard key={product.id} product={product} eager={index < 4} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/30 p-10 text-center">
            <p className="font-display text-xl text-white">Nothing matches that</p>
            <p className="mt-1 text-[15px] text-muted">Try fewer filters, or ask us on WhatsApp.</p>
            <button className="btn btn-lime mt-4" onClick={() => setParams({}, { replace: true })}>Clear all filters</button>
          </div>
        )}

        {filtered.length > pageSize && (
          <nav className="mt-7 flex items-center justify-between gap-3 md:justify-center" aria-label="Pages">
            <button className="btn btn-ghost" disabled={page <= 1} onClick={() => goToPage(page - 1)}><ChevronLeft className="h-5 w-5" /> Prev</button>
            <span className="hud text-[15px] tabular-nums text-white">Page {page} of {totalPages}</span>
            <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Next <ChevronRight className="h-5 w-5" /></button>
          </nav>
        )}
      </section>
    </>
  )
}
