import { Info } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { load, save } from '../lib/storage'

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => load<boolean>('privacy.notice.dismissed', false))
  if (dismissed) return null
  const dismiss = () => { save('privacy.notice.dismissed', true); setDismissed(true) }
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4">
      <div className="container-x">
        <div className="fade-up flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl md:flex-row md:items-center">
          <Info className="hidden h-8 w-8 shrink-0 text-navy md:block" />
          <p className="flex-1 text-sm text-slate-600">
            Product photos load from Daraz’s image host. WhatsApp links open with a prefilled message; WhatsApp/Meta processes it, and Smart Arcade receives it only if you tap Send. See our <Link to="/policies/privacy" className="font-semibold text-navy underline">Privacy Policy</Link>.
          </p>
          <div className="flex gap-2">
            <button className="btn btn-navy py-2 text-sm" onClick={dismiss}>Got it</button>
          </div>
        </div>
      </div>
    </div>
  )
}
