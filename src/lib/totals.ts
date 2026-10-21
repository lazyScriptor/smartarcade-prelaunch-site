import { shop } from '../config/shop'

export type DeliveryMethod = 'delivery' | 'pickup'

export function deliveryFee(subtotal: number, method: DeliveryMethod) {
  if (method === 'pickup' || subtotal === 0) return 0
  return subtotal >= shop.delivery.freeAbove ? 0 : shop.delivery.flatFee
}
