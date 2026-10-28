import { ArrowRight, ArrowUpRight, MessageCircle, PackageSearch, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import CatalogCard from '../components/CatalogCard'
import CatalogImage from '../components/CatalogImage'
import { catalogProducts, visibleCatalogCategories } from '../data/catalog'
import { shop, waLink } from '../config/shop'

const featuredPhotos = visibleCatalogCategories
  .slice(0, 4)
  .map(category => catalogProducts.find(product => product.category === category.id))
  .filter((product): product is (typeof catalogProducts)[number] => !!product)

const featuredProducts = catalogProducts.slice(0, 4)

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="grid-bg absolute inset-0 opacity-80" />
        <div className="absolute -left-28 top-8 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-lime/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-12 md:grid-cols-[.95fr_1.05fr] md:py-16 lg:py-20">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              <PackageSearch className="h-3.5 w-3.5" /> Product catalogue preview
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.04] md:text-6xl">
              Explore the <span className="text-lime">Smart Arcade</span> collection.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              Browse gaming gear, audio, charging essentials and everyday tech from our product catalogue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-lime px-6">Browse products <ArrowRight className="h-4 w-4" /></Link>
              <a href={waLink(`Hi ${shop.name}, I have a question about your product catalogue.`)} target="_blank" rel="noreferrer" className="btn border border-white/20 px-6 text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> Contact us
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/75"><PackageSearch className="h-4 w-4 text-lime" /> {catalogProducts.length} named products</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/75"><ShieldCheck className="h-4 w-4 text-lime" /> Warranty details where supplied</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {featuredPhotos.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={`group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white shadow-2xl shadow-black/20 ${index === 0 ? 'col-span-2 aspect-[2/1.08] sm:aspect-[2/1]' : 'aspect-square'}`}
              >
                <CatalogImage src={product.cardImage} alt={product.name} eager={index < 2} className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-[1.04] sm:p-7" />
                <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-navy shadow-sm backdrop-blur">
                  <span className="line-clamp-1">{product.name}</span><ArrowUpRight className="h-4 w-4 shrink-0" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Browse by type</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy md:text-3xl">Find what you’re looking for</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-sm font-semibold text-navy hover:underline sm:inline-flex">View full catalogue <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleCatalogCategories.map(category => {
            const product = catalogProducts.find(item => item.category === category.id)
            if (!product) return null
            return (
              <Link key={category.id} to={`/shop/${category.id}`} className="group relative min-h-48 overflow-hidden rounded-3xl bg-navy text-white">
                <CatalogImage src={product.cardImage} alt="" className="absolute inset-0 h-full w-full object-contain p-5 opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-xs font-semibold text-lime">{category.count} products</p>
                  <h3 className="mt-1 font-bold sm:text-lg">{category.name}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-white/70">{category.blurb}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="container-x py-8 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">From the catalogue</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy md:text-3xl">Take a closer look</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">All {catalogProducts.length} products <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map(product => <CatalogCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  )
}
