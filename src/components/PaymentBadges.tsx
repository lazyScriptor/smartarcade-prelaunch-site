import { cardGateway, shop } from '../config/shop'

// Neutral text badges. Swap for the card gateway's official payment-methods banner once the merchant account is approved.
export default function PaymentBadges({ dark = false }: { dark?: boolean }) {
  const base = dark ? 'border-white/15 bg-tint text-white/90' : 'border-slate-200 bg-white text-slate-700'
  const { card, bankTransfer, cod, payAtStore } = shop.payments
  const items = [
    card.enabled && 'VISA',
    card.enabled && 'Mastercard',
    card.enabled && 'AMEX',
    card.enabled && cardGateway.name,
    bankTransfer.enabled && 'Bank Transfer',
    cod.enabled && 'Cash on Delivery',
    payAtStore.enabled && 'Pay at Store',
  ].filter((i): i is string => !!i)
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(i => (
        <span key={i} className={`rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-wide ${base}`}>{i}</span>
      ))}
    </div>
  )
}
