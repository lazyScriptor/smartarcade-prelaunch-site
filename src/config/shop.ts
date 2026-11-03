// Every shop-specific value lives here (P-6: configuration, not customisation).
// Items marked TBC are open with the client (foundation §13) — confirm before go-live.

export type CardProvider = 'PayHere' | 'Payable'

// Facts about each online card gateway that the customer-facing text depends on.
// maxPerPayment = null → no per-payment cap.
const cardGateways: Record<CardProvider, { name: string; maxPerPayment: number | null }> = {
  PayHere: { name: 'PayHere', maxPerPayment: 50000 }, // PayHere LITE cap (FR-PAY-11)
  Payable: { name: 'Payable', maxPerPayment: null }, // Payments.lk by Payable: no per-payment cap published
}

export const shop = {
  name: 'Smart Arcade',
  tagline: 'Level up your setup.',
  legalName: 'Smart Arcade', // TBC: exact registered business name for public display
  brNumber: '', // TBC for the payment-provider application; do not publish unless required
  city: 'Moratuwa',
  country: 'Sri Lanka',
  address: 'Moratuwa, Sri Lanka', // TBC: full street address
  mapsUrl: 'https://share.google/uY3YKH88aoadaSrAP',
  mapsEmbedQuery: 'Smart Arcade Moratuwa',
  phone: '+94 76 664 2226',
  phoneHref: '+94766642226',
  phoneAlt: '+94 77 003 4488', // alternative hotline
  phoneAltHref: '+94770034488',
  whatsapp: '94766642226',
  email: 'smartarcade.lk@gmail.com',
  // Hours are placeholders until the client confirms them (OI-02); flip this to show them on the Contact page.
  hoursConfirmed: false as boolean,
  hours: [
    { days: 'Monday – Saturday', time: '9.30 am – 8.00 pm' }, // TBC
    { days: 'Sunday & Poya days', time: '10.00 am – 6.00 pm' }, // TBC
  ],
  social: {
    facebook: 'https://web.facebook.com/smartarcade.lk',
    instagram: '', // TBC
    tiktok: '', // TBC
  },
  logo: '/logo.jpg',
  colors: {
    primary: '#111141',
    primarySoft: '#1d1d5c',
    accent: '#bfff31',
  },
  currency: 'LKR',
  delivery: {
    // Weight-based rate table (kick-off 21 Oct 2026): baseFee covers the first baseKg,
    // each started extra kg adds perExtraKg. Store pickup is free. Free delivery only via promo codes.
    rates: { baseKg: 1, baseFee: 400, perExtraKg: 100 },
    days: '1–3 working days', // TBC with courier
    courier: 'Prompt Xpress',
  },
  payments: {
    card: {
      // Online card gateway — the client may choose Payable (Payments.lk) instead of PayHere.
      // Turned on once the gateway approves the merchant account and the checkout integration is live.
      provider: 'PayHere' as CardProvider,
      enabled: false as boolean,
    },
    bankTransfer: {
      // Enable only after the client supplies and verifies the public account details.
      enabled: false as boolean,
      bank: 'TBC', // TBC: bank, branch, account name and number
      branch: 'TBC',
      accountName: 'TBC',
      accountNumber: 'TBC',
    },
    cod: { enabled: false as boolean, max: 100000 }, // no cash on delivery for now (kick-off 21 Oct 2026)
    payAtStore: { enabled: false as boolean }, // pay when collecting a store-pickup order (settling web orders at the POS is R2)
    whatsapp: { enabled: true as boolean },
  },
  // No change-of-mind returns or exchanges for now (kick-off 21 Oct 2026); return rules come in R2.
  returns: { reportProblemHours: 48 },
  policyUpdated: '2026-10-28',
} as const

export const cardGateway = cardGateways[shop.payments.card.provider]

export const formatLKR = (n: number) => 'Rs. ' + n.toLocaleString('en-LK', { maximumFractionDigits: 0 })

export const waLink = (text: string) => `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`

const listOr = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}` : items[0] ?? '')

// Ways to pay, following the switches above — e.g. "card (PayHere) or bank transfer".
export const payWays = ({ card = shop.payments.card.enabled } = {}) =>
  listOr(
    [
      card && `card (${cardGateway.name})`,
      shop.payments.bankTransfer.enabled && 'bank transfer',
      shop.payments.cod.enabled && 'cash on delivery',
      shop.payments.payAtStore.enabled && 'pay at the store',
    ].filter((w): w is string => !!w),
  )
