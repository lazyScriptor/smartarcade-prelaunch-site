import { shop } from '../config/shop'

export type DeliveryMethod = 'delivery' | 'pickup'

// Started kilos above the base weight; worked in whole grams so 0.1 + 0.2 kg style float drift can't add a kilo.
export const extraKg = (kg: number) => Math.ceil(Math.max(0, Math.round(kg * 1000) - shop.delivery.rates.baseKg * 1000) / 1000)

// Rate table: baseFee covers the first baseKg, each started extra kg adds perExtraKg (2.3 kg → 400 + 2 × 100).
export const feeForWeight = (kg: number) => shop.delivery.rates.baseFee + extraKg(kg) * shop.delivery.rates.perExtraKg
