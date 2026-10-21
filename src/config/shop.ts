// Every shop-specific value lives here (P-6: configuration, not customisation).
// Items marked TBC are open with the client (foundation §13) — confirm before go-live.

export const shop = {
  name: 'Smart Arcade',
  tagline: 'Level up your game.',
  legalName: 'Smart Arcade', // TBC: registered business name + BR no. (PayHere checks these match)
  brNumber: '', // TBC
  city: 'Moratuwa',
  country: 'Sri Lanka',
  address: 'Moratuwa, Sri Lanka', // TBC: full street address
  mapsUrl: 'https://share.google/pgPW86KHI2AsnZXnh',
  mapsEmbedQuery: 'Smart Arcade Moratuwa',
  phone: '+94 76 664 2226',
  phoneHref: '+94766642226',
  whatsapp: '94766642226',
  email: 'smartarcade.lk@gmail.com',
  hours: [
    { days: 'Monday – Saturday', time: '9.30 am – 8.00 pm' }, // TBC
    { days: 'Sunday & Poya days', time: '10.00 am – 6.00 pm' }, // TBC
  ],
  social: {
    facebook: '', // TBC
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
    flatFee: 500, // TBC
    freeAbove: 30000, // TBC
    days: '1–3 working days', // TBC with courier
    courier: 'our courier partner', // TBC
  },
  payments: {
    payhere: {
      // Turned on once PayHere approves the merchant account and the checkout hash function is live.
      enabled: false,
      maxPerPayment: 50000, // PayHere LITE cap (FR-PAY-11)
    },
    bankTransfer: {
      enabled: true,
      bank: 'TBC', // TBC: bank, branch, account name and number
      branch: 'TBC',
      accountName: 'TBC',
      accountNumber: 'TBC',
    },
    cod: { enabled: true, max: 100000 }, // TBC
    whatsapp: { enabled: true },
  },
  returns: { changeOfMindDays: 7 }, // TBC
  policyUpdated: '21 October 2026',
} as const

export const formatLKR = (n: number) => 'Rs. ' + n.toLocaleString('en-LK', { maximumFractionDigits: 0 })

export const waLink = (text: string) => `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`
