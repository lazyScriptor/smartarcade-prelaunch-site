# Pre-launch static site (FR-CMS-12)

Static product-catalogue preview for Smart Arcade. Prices are being set manually through a competitive review; stock is not shown in this preview.
React + Vite + Tailwind; deploys to Cloudflare Pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
```

## Where things live

| What | File |
|---|---|
| Shop name, contact, address, hours, colours, delivery rate table, card gateway (`payments.card.provider`), payment switches, bank details | `src/config/shop.ts` |
| Imported product names, Daraz IDs, product photos and available warranty fields | `src/data/darazCatalog.ts` |
| Product catalogue view and broad inferred categories | `src/data/catalog.ts` |
| Daraz workbook importer (standard-library Python; rerun with an optional workbook path) | `scripts/import_daraz_catalog.py` |
| Approved-price importer (standard-library Python; reads only the approved site-price column) | `scripts/import_approved_prices.py` |
| Policy texts (Terms, Privacy, Returns & Refunds, Delivery, Warranty) | `src/content/policies.tsx` |
| Logo / favicon | `public/logo.jpg` |

Values marked `TBC` in `shop.ts` must be confirmed with the client before going live.

## Catalogue preview

The supplied Daraz export has 545 product IDs, including 538 rows with a product name. Seven unnamed rows are retained in the generated source data but hidden from the catalogue. Product images load from Daraz's image host; the workbook contains URLs rather than local image files.

The photo export has no selling price or stock quantity. A separate price export was provided, but none of its Product IDs match the photo catalogue. The manually fillable competitive pricing workbook is `../Smart arcade general details/Smart Arcade Competitive Pricing.xlsx`; it contains all 538 visible products and 44 exact-title match candidates, clearly flagged because the IDs differ. No prices or stock values were copied from that export. Enter final values in `Approved Smart Arcade Price (LKR)`, then run `python3 scripts/import_approved_prices.py` to update the site price data. Product cards and details display the prices in `src/data/approvedPrices.ts`, generated from `scripts/price_sources.json` (116 prices, each with its basis, source and check date: 101 are Smart Arcade's own existing Daraz prices matched by exact title/model, 15 are recommendations from a Sri Lankan retailer listing) and overridden by anything typed in the workbook column. `Smart arcade general details/Smart Arcade Price Proposals.csv` lists them for client approval. Variant ranges show as "From Rs. …". The other 422 products stay "Price to be confirmed". Its numeric Daraz category IDs have no category-name lookup, so the displayed broad product types are inferred from product names. The site has a cart, but no payment checkout. Customers add items, then "Continue to order request" collects name, mobile and delivery details and opens WhatsApp with a prefilled message (`src/lib/orders.ts`). Nothing is sent or stored by the site; the cart itself lives in browser storage. Items without an approved price show "Price to be confirmed" and are quoted on WhatsApp. Delivery is charged by weight and confirmed by the shop, because the catalogue has no product weights.

The importer includes the primary-image columns, white-background image, and additional `<img>` URLs found in each product description. It de-duplicates images per product and accepts only HTTPS images from `static-01.daraz.lk`.

## Deploy (Cloudflare Pages)

Build command `npm run build`, output directory `dist`. `public/_redirects` sends deep links to `index.html`.
