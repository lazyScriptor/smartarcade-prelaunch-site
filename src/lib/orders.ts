import { load, save } from './storage'
import type { DeliveryMethod } from './totals'

export type PaymentMethod = 'card' | 'bank' | 'cod' | 'store' | 'whatsapp'

export interface PlacedOrder {
  ref: string
  createdAt: string
  customer: { name: string; mobile: string; email: string; address: string; city: string; district: string; notes: string }
  delivery: DeliveryMethod
  payment: PaymentMethod
  items: { name: string; variant?: string; qty: number; price: number }[]
  subtotal: number
  deliveryFee: number
  total: number
}

const KEY = 'orders.v1'

export const newOrderRef = () => {
  const d = new Date()
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `WEB-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export const saveOrder = (o: PlacedOrder) => save(KEY, [o, ...load<PlacedOrder[]>(KEY, [])].slice(0, 20))
export const findOrder = (ref: string) => load<PlacedOrder[]>(KEY, []).find(o => o.ref === ref)

// Sri Lankan mobile: 07XXXXXXXX, 7XXXXXXXX, 947XXXXXXXX or +947XXXXXXXX → +947XXXXXXXX
export function normaliseMobile(raw: string) {
  const digits = raw.replace(/[\s\-()]/g, '')
  const m = digits.match(/^(?:\+94|94|0)?(7\d{8})$/)
  return m ? `+94${m[1]}` : null
}

export const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
]
