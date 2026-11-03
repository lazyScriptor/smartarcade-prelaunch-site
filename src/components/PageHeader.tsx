import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function PageHeader({ title, crumbs = [], children }: { title: string; crumbs?: { label: string; to?: string }[]; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-navy on-dark">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime/15 blur-3xl" />
      <div className="container-x relative py-7 md:py-11">
        <nav className="mb-2 flex flex-wrap items-center gap-1 text-[13px] text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link>
          {crumbs.map(crumb => (
            <span key={crumb.label} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {crumb.to ? <Link to={crumb.to} className="hover:text-ink">{crumb.label}</Link> : <span className="text-ink">{crumb.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-[1.75rem] leading-tight text-ink md:text-5xl">{title}</h1>
        {children}
      </div>
    </section>
  )
}
