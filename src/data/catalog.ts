import { darazCatalog } from './darazCatalog'
import { darazCatalogExtra } from './darazCatalogExtra'
import { approvedPrices, fromPriceIds } from './approvedPrices'

export type CatalogCategoryId = 'gaming' | 'audio' | 'power' | 'computing' | 'wearables' | 'mobile' | 'other'

export interface CatalogCategory {
  id: CatalogCategoryId
  name: string
  blurb: string
}

export interface CatalogProduct {
  id: string
  price: number | null
  priceFrom: boolean
  darazCategoryId: string
  name: string
  nameSi: string
  category: CatalogCategoryId
  cardImage: string
  images: string[]
  warrantyPeriod: string
  warrantyType: string
  warrantyPolicy: string
  description: string
  highlights: string[]
}

export const catalogCategories: CatalogCategory[] = [
  { id: 'gaming', name: 'Gaming', blurb: 'Gaming consoles, controls and gear' },
  { id: 'audio', name: 'Audio', blurb: 'Headphones, earbuds and speakers' },
  { id: 'power', name: 'Power & Charging', blurb: 'Chargers, cables and power banks' },
  { id: 'computing', name: 'Computing', blurb: 'Keyboards, mice and computer gear' },
  { id: 'wearables', name: 'Wearables', blurb: 'Watches, bands and smart devices' },
  { id: 'mobile', name: 'Phone Accessories', blurb: 'Phone cases, stands and protection' },
  { id: 'other', name: 'More Gadgets', blurb: 'More accessories and everyday tech' },
]

function categoryFor(name: string): CatalogCategoryId {
  const title = name.toLowerCase()
  if (/playstation|\bps[345]\b|xbox|nintendo|\bswitch\b|gamepad|game pad|controller|gaming|quest|vr headset/.test(title)) return 'gaming'
  if (/headphone|headset|earbud|earphone|neckband|speaker|microphone|\bmic\b|soundbar|audio/.test(title)) return 'audio'
  if (/charger|charging|power ?bank|powerbank|\bgan\b|usb cable|charging cable|car charger/.test(title)) return 'power'
  if (/keyboard|mouse|laptop|notebook|ssd|hard ?drive|webcam|monitor|router|\bpc\b|computer|memory card|card reader|usb hub/.test(title)) return 'computing'
  if (/smart ?watch|fitness band|smart ?band|watch|tracker|wearable/.test(title)) return 'wearables'
  if (/phone|mobile|iphone|screen protector|tempered glass|phone case|phone holder|phone mount/.test(title)) return 'mobile'
  return 'other'
}

export const catalogProducts: CatalogProduct[] = [...darazCatalog, ...darazCatalogExtra]
  .filter(item => (item.nameEn || item.nameSi) && item.cardImage)
  .map(item => {
    const name = item.nameEn || item.nameSi
    return {
      id: item.id,
      price: approvedPrices[item.id] ?? null,
      priceFrom: fromPriceIds.has(item.id),
      darazCategoryId: item.darazCategoryId,
      name,
      nameSi: item.nameSi,
      category: categoryFor(name),
      cardImage: item.cardImage,
      images: item.images,
      warrantyPeriod: item.warrantyPeriod,
      warrantyType: item.warrantyType,
      warrantyPolicy: item.warrantyPolicy,
      description: item.description,
      highlights: item.highlights,
    }
  })

export const visibleCatalogCategories = catalogCategories
  .map(category => ({ ...category, count: catalogProducts.filter(product => product.category === category.id).length }))
  .filter(category => category.count > 0)

export const catalogProductById = (id: string) => catalogProducts.find(product => product.id === id)
