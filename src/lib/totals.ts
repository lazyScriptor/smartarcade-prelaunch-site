import { shop } from '../config/shop'
import { shippingWeightKg, type Product } from '../data/products'

export type DeliveryMethod = 'delivery' | 'pickup'
export interface WeighedLine { product: Product; qty: number }

export const cartWeightKg = (lines: WeighedLine[]) => lines.reduce((kg, l) => kg + shippingWeightKg(l.product) * l.qty, 0)

// Started kilos above the base weight; worked in whole grams so 0.1 + 0.2 kg style float drift can't add a kilo.
export const extraKg = (kg: number) => Math.ceil(Math.max(0, Math.round(kg * 1000) - shop.delivery.rates.baseKg * 1000) / 1000)

// Rate table: baseFee covers the first baseKg, each started extra kg adds perExtraKg (2.3 kg → 400 + 2 × 100).
export const feeForWeight = (kg: number) => shop.delivery.rates.baseFee + extraKg(kg) * shop.delivery.rates.perExtraKg

export function deliveryFee(lines: WeighedLine[], method: DeliveryMethod) {
  if (method === 'pickup' || lines.length === 0) return 0
  return feeForWeight(cartWeightKg(lines))
}

export const formatKg = (kg: number) => `${kg.toLocaleString('en-LK', { maximumFractionDigits: 2 })} kg`
