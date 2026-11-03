import { useState } from 'react'
import { Link } from 'react-router-dom'
import { load, save } from '../lib/storage'

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => load<boolean>('privacy.notice.dismissed', false))
  if (dismissed) return null
  const dismiss = () => { save('privacy.notice.dismissed', true); setDismissed(true) }
  return (
    <div role="region" aria-label="Privacy notice" className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+var(--safe-bottom))] z-30 p-3 lg:bottom-0 lg:left-auto lg:max-w-md lg:p-6 lg:pr-24">
      <div className="toast-in flex items-center gap-3 rounded-2xl border border-line bg-navy-soft p-3.5 shadow-2xl shadow-black/50 on-dark">
        <p className="flex-1 text-[13px] leading-snug text-body">
          We save your cart on this device. See our <Link to="/policies/privacy" className="font-semibold text-accent underline">Privacy Policy</Link>.
        </p>
        <button className="btn btn-lime shrink-0 px-4 text-[15px]" style={{ minHeight: 44 }} onClick={dismiss}>OK</button>
      </div>
    </div>
  )
}
