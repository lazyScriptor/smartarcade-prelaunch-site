import { formatLKR, shop, waLink } from '../config/shop'
import type { CartRow } from '../store/cart'
import type { DeliveryMethod } from './totals'

export interface OrderRequest {
  name: string
  mobile: string
  delivery: DeliveryMethod
  address: string
  city: string
  district: string
  notes: string
}

const shorten = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text)

// Builds the prefilled WhatsApp message for an order request. Nothing is sent or stored by the site;
// Smart Arcade only receives it if the customer taps Send in WhatsApp.
export function orderRequestMessage(rows: CartRow[], request: OrderRequest) {
  const build = (nameMax: number) => {
    const lines = rows.map((row, index) => {
      const price = row.product.price === null
        ? 'price to be confirmed'
        : `${row.product.priceFrom ? 'from ' : ''}${formatLKR(row.product.price)} each = ${formatLKR(row.product.price * row.qty)}`
      return `${index + 1}. ${row.qty} × ${shorten(row.product.name, nameMax)} (ref ${row.product.id}) – ${price}`
    })
    const priced = rows.filter(row => row.lineTotal !== null)
    const subtotal = priced.reduce((total, row) => total + (row.lineTotal ?? 0), 0)
    const unpriced = rows.length - priced.length
    return [
      `Hi ${shop.name}, I'd like to place this order request:`,
      '',
      ...lines,
      '',
      priced.length ? `Items total${unpriced ? ' (priced items only)' : ''}: ${formatLKR(subtotal)}` : 'Items total: to be confirmed',
      request.delivery === 'pickup'
        ? `Collection: store pickup (${shop.city})`
        : `Delivery to: ${request.address}, ${request.city}, ${request.district}`,
      '',
      `Name: ${request.name}`,
      `Mobile: ${request.mobile}`,
      ...(request.notes ? [`Notes: ${request.notes}`] : []),
      '',
      'Please confirm availability, final prices, the delivery charge and how to pay.',
    ].join('\n')
  }
  // wa.me links break on very long URLs, so shorten product names when the cart is large.
  for (const nameMax of [70, 45, 30]) {
    const text = build(nameMax)
    if (encodeURIComponent(text).length <= 1800) return text
  }
  return build(30)
}

export const orderRequestLink = (rows: CartRow[], request: OrderRequest) => waLink(orderRequestMessage(rows, request))

// Sri Lankan mobile or Colombo landline → E.164 (+94...).
export function normaliseMobile(raw: string) {
  const digits = raw.replace(/[\s\-()]/g, '')
  const colomboLandline = digits.match(/^(?:\+94|94|0)?(11\d{7})$/)
  if (colomboLandline) return `+94${colomboLandline[1]}`
  const m = digits.match(/^(?:\+94|94|0)?(7\d{8})$/)
  return m ? `+94${m[1]}` : null
}

export const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
]
