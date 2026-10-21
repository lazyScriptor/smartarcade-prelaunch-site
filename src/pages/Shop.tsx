import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { brands, categories, products, type CategoryId } from '../data/products'
import ProductCard from '../components/ProductCard'
import PageHeader from '../components/PageHeader'

const sorts = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name A–Z',
} as const
type SortKey = keyof typeof sorts

const priceBands = [
  { id: 'u25', label: 'Under Rs. 25,000', test: (p: number) => p < 25000 },
  { id: '25-100', label: 'Rs. 25,000 – 100,000', test: (p: number) => p >= 25000 && p <= 100000 },
  { id: 'o100', label: 'Over Rs. 100,000', test: (p: number) => p > 100000 },
]

export default function Shop() {
  const { category } = useParams<{ category?: CategoryId }>()
  const [params, setParams] = useSearchParams()
  const [panel, setPanel] = useState(false)
  const q = params.get('q') ?? ''
  const condition = params.get('condition') ?? ''
  const brand = params.get('brand') ?? ''
  const band = params.get('price') ?? ''
  const inStock = params.get('stock') === '1'
  const sort = (params.get('sort') as SortKey) || 'featured'
  const cat = categories.find(c => c.id === category)

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    let r = products.filter(p =>
      (!category || p.category === category) &&
      (!t || `${p.name} ${p.brand} ${p.short}`.toLowerCase().includes(t)) &&
      (!condition || p.condition === condition) &&
      (!brand || p.brand === brand) &&
      (!band || priceBands.find(b => b.id === band)!.test(p.price)) &&
      (!inStock || p.stock !== 'out'),
    )
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') r = [...r].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    return r
  }, [category, q, condition, brand, band, inStock, sort])

  const active = [q && ['q', `“${q}”`], condition && ['condition', condition], brand && ['brand', brand], band && ['price', priceBands.find(b => b.id === band)?.label], inStock && ['stock', 'In stock']].filter(Boolean) as [string, string][]

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Condition">
        {['', 'Brand New', 'Pre-owned'].map(c => (
          <Radio key={c || 'all'} name="condition" checked={condition === c} onChange={() => set('condition', c)} label={c || 'All'} />
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        <Radio name="price" checked={!band} onChange={() => set('price', '')} label="Any price" />
        {priceBands.map(b => <Radio key={b.id} name="price" checked={band === b.id} onChange={() => set('price', b.id)} label={b.label} />)}
      </FilterGroup>
      <FilterGroup title="Brand">
        <select className="input" value={brand} onChange={e => set('brand', e.target.value)} aria-label="Brand">
          <option value="">All brands</option>
          {brands.map(b => <option key={b}>{b}</option>)}
        </select>
      </FilterGroup>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
        <input type="checkbox" className="h-4 w-4 accent-navy" checked={inStock} onChange={e => set('stock', e.target.checked ? '1' : '')} />
        Hide out-of-stock items
      </label>
    </div>
  )

  return (
    <>
      <PageHeader title={cat ? cat.name : q ? `Search: ${q}` : 'All products'} crumbs={[{ label: 'Shop', to: cat ? '/shop' : undefined }, ...(cat ? [{ label: cat.name }] : [])]}>
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {[{ id: '', name: 'All' }, ...categories].map(c => {
            const on = (category ?? '') === c.id
            return (
              <Link
                key={c.id || 'all'}
                to={c.id ? `/shop/${c.id}` : '/shop'}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${on ? 'border-lime bg-lime text-navy' : 'border-white/20 text-white/80 hover:border-white/50'}`}
              >
                {c.name}
              </Link>
            )
          })}
        </div>
      </PageHeader>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button className="btn btn-ghost py-2 text-sm lg:hidden" onClick={() => setPanel(true)}><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <p className="text-sm text-slate-500">{list.length} {list.length === 1 ? 'product' : 'products'}</p>
            <div className="ml-auto">
              <select className="input py-2 text-sm" value={sort} onChange={e => set('sort', e.target.value === 'featured' ? '' : e.target.value)} aria-label="Sort by">
                {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          {active.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {active.map(([k, label]) => (
                <button key={k} onClick={() => set(k, '')} className="flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
                  {label} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
          {list.length ? (
            <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3">
              {list.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="font-semibold text-navy">No products match your filters.</p>
              <button className="btn btn-navy mt-4" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {panel && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanel(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 fade-up">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">Filters</h2>
              <button onClick={() => setPanel(false)} aria-label="Close filters"><X className="h-6 w-6" /></button>
            </div>
            {filters}
            <button className="btn btn-navy mt-8 w-full" onClick={() => setPanel(false)}>Show {list.length} products</button>
          </div>
        </div>
      )}
    </>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  )
}

function Radio({ name, checked, onChange, label }: { name: string; checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-navy" />
      {label}
    </label>
  )
}
