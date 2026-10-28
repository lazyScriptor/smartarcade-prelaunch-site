import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import CatalogCard from '../components/CatalogCard'
import PageHeader from '../components/PageHeader'
import { catalogCategories, catalogProducts, visibleCatalogCategories } from '../data/catalog'

const pageSize = 24

export default function CatalogPage() {
  const { category: categoryParam } = useParams<{ category?: string }>()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const requestedPage = Math.max(1, Number(params.get('page') ?? '1') || 1)
  const category = catalogCategories.find(item => item.id === categoryParam)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return catalogProducts.filter(product =>
      (!category || product.category === category.id) &&
      (!term || `${product.name} ${product.nameSi} ${product.warrantyType}`.toLowerCase().includes(term)),
    )
  }, [category, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(requestedPage, totalPages)
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: true })
  }

  const pageTitle = category?.name ?? (query ? `Search results` : 'Product catalogue')

  return (
    <>
      <PageHeader title={pageTitle} crumbs={[{ label: 'Product catalogue', to: '/shop' }, ...(category ? [{ label: category.name }] : [])]}>
        <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
          Browse product photos and details from the current catalogue.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <CategoryLink to="/shop" active={!category} label="All products" count={catalogProducts.length} />
          {visibleCatalogCategories.map(item => (
            <CategoryLink key={item.id} to={`/shop/${item.id}`} active={category?.id === item.id} label={item.name} count={item.count} />
          ))}
        </div>
      </PageHeader>

      <section className="container-x py-8">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Pricing review:</strong> prices are being set through a manual competitive review. Stock counts are not shown; contact Smart Arcade to confirm availability. Product groups are approximate, inferred from product names.
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={event => update('q', event.target.value)}
              placeholder="Search product names"
              aria-label="Search product catalogue"
              className="input pl-10"
            />
          </label>
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal className="h-4 w-4" /> {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {visible.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {visible.map(product => <CatalogCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-semibold text-navy">No products match that search.</p>
            <button className="btn btn-navy mt-4" onClick={() => setParams({}, { replace: true })}>Clear search</button>
          </div>
        )}

        {filtered.length > pageSize && (
          <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Catalogue pages">
            <button
              className="btn btn-ghost px-3 py-2 text-sm"
              disabled={page <= 1}
              onClick={() => update('page', String(page - 1))}
              aria-label="Previous page"
            ><ChevronLeft className="h-4 w-4" /> Previous</button>
            <span className="text-sm tabular-nums text-slate-600">Page {page} of {totalPages}</span>
            <button
              className="btn btn-ghost px-3 py-2 text-sm"
              disabled={page >= totalPages}
              onClick={() => update('page', String(page + 1))}
              aria-label="Next page"
            >Next <ChevronRight className="h-4 w-4" /></button>
          </nav>
        )}
      </section>
    </>
  )
}

function CategoryLink({ to, active, label, count }: { to: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      to={to}
      className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${active ? 'border-lime bg-lime text-navy' : 'border-white/20 bg-white/5 text-white/80 hover:border-white/50 hover:text-white'}`}
    >
      {label} <span className={active ? 'ml-1 text-navy/60' : 'ml-1 text-white/45'}>{count}</span>
    </Link>
  )
}
