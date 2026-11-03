import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { shop } from '../config/shop'
import { policies, policyBySlug } from '../content/policies'
import { usePageTitle } from '../hooks/ui'
import NotFound from './NotFound'

export default function Policy() {
  const { slug } = useParams()
  const doc = policyBySlug(slug)
  usePageTitle(doc?.title ?? 'Policies')
  if (!doc) return <NotFound />
  return (
    <>
      <PageHeader title={doc.title} crumbs={[{ label: 'Policies' }, { label: doc.title }]}>
        <p className="mt-2 text-sm text-muted">Last updated: {shop.policyUpdated}</p>
      </PageHeader>
      <nav className="sticky top-[61px] z-30 border-b border-line bg-[rgba(10,10,43,0.95)] backdrop-blur-md lg:top-[69px] on-dark" aria-label="Policies">
        <div className="container-x no-scrollbar flex gap-2 overflow-x-auto py-2">
          {policies.map(policy => (
            <Link key={policy.slug} to={`/policies/${policy.slug}`} aria-current={policy.slug === doc.slug ? 'page' : undefined} className="chip">{policy.title}</Link>
          ))}
        </div>
      </nav>
      <div className="container-x pt-6">
        <article className="prose-policy surface mx-auto max-w-3xl p-4 md:p-9">
          <p className="!mt-0 text-lg">{doc.summary}</p>
          {doc.body()}
        </article>
      </div>
    </>
  )
}
