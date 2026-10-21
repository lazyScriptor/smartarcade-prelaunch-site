// Neutral text badges. Swap for PayHere's official payment-methods banner once the merchant account is approved.
export default function PaymentBadges({ dark = false }: { dark?: boolean }) {
  const base = dark ? 'border-white/15 bg-white/5 text-white/90' : 'border-slate-200 bg-white text-slate-700'
  const items = ['VISA', 'Mastercard', 'AMEX', 'PayHere', 'Bank Transfer', 'Cash on Delivery']
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(i => (
        <span key={i} className={`rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-wide ${base}`}>{i}</span>
      ))}
    </div>
  )
}
