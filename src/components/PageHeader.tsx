import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function PageHeader({ title, crumbs = [], children }: { title: string; crumbs?: { label: string; to?: string }[]; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/20 blur-3xl" />
      <div className="container-x relative py-10 md:py-14">
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-white/60" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">Home</Link>
          {crumbs.map(c => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white/90">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        {children}
      </div>
    </section>
  )
}
