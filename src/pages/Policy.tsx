import { Link, useParams } from 'react-router-dom'
import { policies, policyBySlug } from '../content/policies'
import { shop } from '../config/shop'
import PageHeader from '../components/PageHeader'
import NotFound from './NotFound'

export default function Policy() {
  const { slug } = useParams()
  const doc = policyBySlug(slug)
  if (!doc) return <NotFound />
  return (
    <>
      <PageHeader title={doc.title} crumbs={[{ label: 'Policies' }, { label: doc.title }]}>
        <p className="mt-3 text-sm text-white/60">Last updated: {shop.policyUpdated}</p>
      </PageHeader>
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <nav className="h-fit rounded-3xl border border-slate-200/80 bg-white p-3 lg:sticky lg:top-40" aria-label="Policies">
          {policies.map(p => (
            <Link key={p.slug} to={`/policies/${p.slug}`} className={`block rounded-xl px-4 py-2.5 text-sm font-medium ${p.slug === doc.slug ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {p.title}
            </Link>
          ))}
        </nav>
        <article className="prose-policy max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10">
          <p className="!mt-0 text-lg text-slate-500">{doc.summary}</p>
          {doc.body()}
        </article>
      </div>
    </>
  )
}
