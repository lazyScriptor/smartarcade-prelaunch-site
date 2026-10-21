import { Cookie } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { load, save } from '../lib/storage'

export default function CookieBanner() {
  const [choice, setChoice] = useState<string | null>(() => load<string | null>('cookie.choice', null))
  if (choice) return null
  const pick = (v: string) => { save('cookie.choice', v); setChoice(v) }
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4">
      <div className="container-x">
        <div className="fade-up flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl md:flex-row md:items-center">
          <Cookie className="hidden h-8 w-8 shrink-0 text-navy md:block" />
          <p className="flex-1 text-sm text-slate-600">
            We use essential cookies to keep your cart and checkout working. With your permission we may also use analytics cookies to improve the store.
            See our <Link to="/policies/privacy" className="font-semibold text-navy underline">Privacy Policy</Link>.
          </p>
          <div className="flex gap-2">
            <button className="btn btn-ghost py-2 text-sm" onClick={() => pick('essential')}>Essential only</button>
            <button className="btn btn-navy py-2 text-sm" onClick={() => pick('all')}>Accept all</button>
          </div>
        </div>
      </div>
    </div>
  )
}
