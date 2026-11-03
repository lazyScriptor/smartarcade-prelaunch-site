import { approvedPrices, fromPriceIds } from './approvedPrices'
import { catalogIndex } from './catalogIndex'

export type CatalogCategoryId = 'gaming' | 'audio' | 'power' | 'creator' | 'wearables' | 'computing' | 'mobile' | 'home' | 'other'

export interface CatalogCategory {
  id: CatalogCategoryId
  name: string
  blurb: string
}

export interface CatalogProduct {
  id: string
  price: number | null
  priceFrom: boolean
  name: string
  nameSi: string
  brand: string
  category: CatalogCategoryId
  cardImage: string
  warranty: string
}

export interface ProductDetails {
  images: string[]
  description: string
  highlights: string[]
  warrantyPolicy: string
}

export const catalogCategories: CatalogCategory[] = [
  { id: 'gaming', name: 'Gaming', blurb: 'Headsets, keyboards and gear for your setup' },
  { id: 'audio', name: 'Audio', blurb: 'Headphones, earbuds and speakers' },
  { id: 'power', name: 'Power & Charging', blurb: 'Power banks, chargers and charging cables' },
  { id: 'creator', name: 'Cameras & Creator', blurb: 'Gimbals, cameras, lights and mics' },
  { id: 'wearables', name: 'Wearables', blurb: 'Smart watches, bands and trackers' },
  { id: 'computing', name: 'Computing & Cables', blurb: 'Keyboards, mice, hubs, storage and networking' },
  { id: 'mobile', name: 'Phone Accessories', blurb: 'Cases, screen protection and holders' },
  { id: 'home', name: 'Home & Car', blurb: 'Dash cams, car gear and home gadgets' },
  { id: 'other', name: 'More Gadgets', blurb: 'Everyday tech and accessories' },
]

// Daraz's category IDs have no name lookup, so groups are inferred from the product name. Order matters.
function categoryFor(name: string): CatalogCategoryId {
  const title = name.toLowerCase()
  const isCableOrAdapter = /\bcable\b|adapter|converter|\bhub\b|splitter|extension/.test(title)
  if (/capture card/.test(title)) return 'gaming'
  if (!isCableOrAdapter && !/charger|power ?bank|earbud|\bssd\b/.test(title) && /playstation|\bps[345]\b|xbox|nintendo|gamepad|game pad|game console|game controller|gaming (headset|headphones?|keyboard|mouse)|\bg\d{3}\b.*(gaming|surround)/.test(title)) return 'gaming'
  if (/smart ?watch|fitness|smart ?band|\bwatch\b|tracker|wearable|chest strap|smart glasses/.test(title) && !/charger|charging|case|tag|card tracker|wallet/.test(title)) return 'wearables'
  if (/lavalier|microphone/.test(title) && !/headphone|headset|earbud|earphone|neckband|speaker|webcam/.test(title)) return 'creator'
  if (!isCableOrAdapter && /headphone|headset|earbud|earphone|neckband|speaker|soundbar|\baudio\b|earpods?\b/.test(title)) return 'audio'
  if (/voice ?tracer|voice recorder|gimbal|vlog|softbox|ring light|\bdji\b|photography/.test(title)) return 'creator'
  if (/\bssd\b|hard ?drive|enclosure|flash drive|micro ?sd|memory card/.test(title)) return 'computing'
  if (/keyboard|\bmouse\b/.test(title)) return 'computing'
  if (isCableOrAdapter) return /charg/.test(title) ? 'power' : 'computing'
  if (/tripod|selfie|lavalier|microphone|\bmic\b|webcam/.test(title)) return 'creator'
  if (/dash ?cam|tire|tyre|inflator|jump starter|vacuum|\bfan\b|shaver|trimmer|hair|baby monitor|security camera|kitchen|food|\bscale\b|fridge|refrigerator|chopper|lamp|compressor|inverter|attendance|barcode|luggage/.test(title)) return 'home'
  if (/power ?bank|charger|charging|\bgan\b|power strip|socket|wall plug/.test(title)) return 'power'
  if (/case|cover|screen protector|tempered glass|phone holder|phone mount|holder|\bmount\b|\bstand\b|stylus|iphone|ipad|sleeve/.test(title)) return 'mobile'
  if (/laptop|notebook|\bssd\b|hard ?drive|enclosure|monitor|router|wi-?fi|ethernet|\bpc\b|computer|memory card|micro ?sd|flash drive|card reader|usb|hdmi|dock|tv stick|tv box/.test(title)) return 'computing'
  return 'other'
}

const BRANDS: [RegExp, string][] = [
  [/\bugreen\b|\bug\b/i, 'UGREEN'], [/\banker\b/i, 'Anker'], [/\bsoundcore\b/i, 'Soundcore'], [/\bbaseus\b|\bencok\b/i, 'Baseus'],
  [/\byesido\b/i, 'Yesido'], [/\bgreen lion\b/i, 'Green Lion'], [/\bwiwu\b/i, 'WiWU'], [/\bjbl\b/i, 'JBL'], [/\bremax\b/i, 'Remax'],
  [/\blogitech\b/i, 'Logitech'], [/\btp[- ]?link\b/i, 'TP-Link'], [/\bldnio\b/i, 'LDNIO'], [/\bxiaomi\b|\bredmi\b|^mi\b/i, 'Xiaomi'],
  [/\bsandisk\b/i, 'SanDisk'], [/\bsamsung\b/i, 'Samsung'], [/\bjoyroom\b/i, 'Joyroom'], [/\bporodo\b/i, 'Porodo'], [/\bplokama\b/i, 'Plokama'],
  [/\bphilips\b/i, 'Philips'], [/\bvgr\b/i, 'VGR'], [/\bdji\b/i, 'DJI'], [/\bkingston\b/i, 'Kingston'], [/\bsony\b/i, 'Sony'],
  [/\b70mai\b/i, '70mai'], [/\bhavit\b/i, 'Havit'], [/\brecci\b/i, 'Recci'],
]
const brandFor = (name: string) => BRANDS.find(([pattern]) => pattern.test(name))?.[1] ?? ''

function warrantyFor(period = '', type = '') {
  if (/no warranty/i.test(type) || /no warranty/i.test(period)) return ''
  return [period, type].filter(value => value && !/^n\/?a$/i.test(value)).join(' · ')
}

export const catalogProducts: CatalogProduct[] = catalogIndex.map(item => ({
  id: item.id,
  price: approvedPrices[item.id] ?? null,
  priceFrom: fromPriceIds.has(item.id),
  name: item.name,
  nameSi: item.nameSi ?? '',
  brand: brandFor(item.name),
  category: categoryFor(item.name),
  cardImage: item.cardImage,
  warranty: warrantyFor(item.warrantyPeriod, item.warrantyType),
}))

const byId = new Map(catalogProducts.map(product => [product.id, product]))
export const catalogProductById = (id: string) => byId.get(id)

export const pricedProducts = catalogProducts.filter(product => product.price !== null)

export const visibleCatalogCategories = catalogCategories
  .map(category => ({ ...category, count: catalogProducts.filter(product => product.category === category.id).length }))
  .filter(category => category.count > 0)

export const categoryById = (id?: string) => catalogCategories.find(category => category.id === id)

// Brands with enough products to be worth filtering by, most products first.
export const topBrands = Object.entries(
  catalogProducts.reduce<Record<string, number>>((counts, product) => {
    if (product.brand) counts[product.brand] = (counts[product.brand] ?? 0) + 1
    return counts
  }, {}),
).sort((a, b) => b[1] - a[1]).map(([brand]) => brand)

// Every word typed must appear somewhere, so "jbl flip" finds "JBL Flip 7 Portable…".
export function matchesQuery(product: CatalogProduct, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const haystack = `${product.name} ${product.nameSi} ${product.brand} ${categoryById(product.category)?.name ?? ''}`.toLowerCase()
  return words.every(word => haystack.includes(word))
}

const detailsCache = new Map<string, ProductDetails>()
export async function loadProductDetails(id: string): Promise<ProductDetails> {
  const cached = detailsCache.get(id)
  if (cached) return cached
  const response = await fetch(`/data/products/${id}.json`)
  if (!response.ok) throw new Error(`Product details failed: ${response.status}`)
  const details = (await response.json()) as ProductDetails
  detailsCache.set(id, details)
  return details
}
