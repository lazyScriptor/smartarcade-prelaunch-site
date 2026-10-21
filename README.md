# Pre-launch static site (FR-CMS-12)

Static storefront for PayHere merchant review, before the ECOMPOS storefront goes live in R1.
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
| Shop name, contact, address, hours, colours, delivery fees, payment switches, bank details | `src/config/shop.ts` |
| Products & categories (add `image: '/products/x.jpg'` to show a real photo) | `src/data/products.ts` |
| Policy texts (Terms, Privacy, Returns & Refunds, Delivery, Warranty) | `src/content/policies.tsx` |
| Logo / favicon | `public/logo.jpg` |

Values marked `TBC` in `shop.ts` must be confirmed with the client before going live.

## How orders work (no backend)

Checkout validates details and saves the order in the browser, then the confirmation page asks the
customer to send it on WhatsApp. Bank-transfer orders also show the bank details.
The PayHere option shows "Activating soon" while `payments.payhere.enabled` is `false`.

## Deploy (Cloudflare Pages)

Build command `npm run build`, output directory `dist`. `public/_redirects` sends deep links to `index.html`.
