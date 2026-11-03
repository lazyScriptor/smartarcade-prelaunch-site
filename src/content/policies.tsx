// Policy templates drafted by tadXweb for the client's approval (not legal advice) — FR-CMS-11 / FR-CMS-12.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cardGateway, formatLKR, payWays, shop } from '../config/shop'
import { extraKg, feeForWeight } from '../lib/totals'

export interface PolicyDoc { slug: string; title: string; summary: string; body: () => ReactNode }

const Contact = () => (
  <ul>
    <li>Phone / WhatsApp: <a href={`tel:${shop.phoneHref}`}>{shop.phone}</a> or <a href={`tel:${shop.phoneAltHref}`}>{shop.phoneAlt}</a></li>
    <li>Email: <a href={`mailto:${shop.email}`}>{shop.email}</a></li>
    <li>Shop: {shop.address}</li>
  </ul>
)

const currentPaymentWays = payWays()

export const policies: PolicyDoc[] = [
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    summary: 'The rules for using our website and buying from us.',
    body: () => (
      <>
        <p>These terms apply to every order placed on this website, by phone or by WhatsApp with {shop.legalName} (“we”, “us”), {shop.address}. By placing an order you agree to them.</p>
        <h2>1. Products and prices</h2>
        <ul>
          <li>All prices are in Sri Lankan Rupees (LKR) and include any applicable taxes unless stated otherwise.</li>
          <li>We do our best to show accurate descriptions, photos and prices. If an item is listed at an incorrect price we will contact you before processing the order and you may cancel for a full refund.</li>
          <li>Product photos are for illustration; colours and packaging may vary slightly.</li>
        </ul>
        <h2>2. Orders</h2>
        <ul>
          <li>A cart sent to us on WhatsApp is an order request, not a confirmed order. We confirm stock, the final price and delivery with you first.</li>
          <li>An order is confirmed when we accept it and payment is received{shop.payments.cod.enabled && ' (or, for cash on delivery, when we confirm it by phone or WhatsApp)'}.</li>
          <li>We may refuse or cancel an order if stock is unavailable, the payment fails or is suspected to be fraudulent, or delivery details cannot be verified. Any amount paid will be refunded in full.</li>
        </ul>
        <h2>3. Payment</h2>
        <ul>
          <li>{currentPaymentWays
            ? `We currently accept ${currentPaymentWays}.`
            : 'For now, send an order request through WhatsApp. We will confirm the payment method before accepting it.'}</li>
          {shop.payments.card.enabled && (
            <>
              <li>Card payments are processed securely by <b>{cardGateway.name}</b>. We do not receive your full card details.</li>
              {cardGateway.maxPerPayment !== null && (
                <li>A single card payment is limited to {formatLKR(cardGateway.maxPerPayment)}. Ask us about another available payment method for larger orders.</li>
              )}
            </>
          )}
          {shop.payments.bankTransfer.enabled && <li>Bank-transfer orders are dispatched once the funds reach our account.</li>}
        </ul>
        <h2>4. Delivery, returns and warranty</h2>
        <p>Please read our <Link to="/policies/delivery">Delivery Policy</Link>, <Link to="/policies/refunds">Returns & Refunds Policy</Link> and <Link to="/policies/warranty">Warranty Policy</Link>, which form part of these terms.</p>
        <h2>5. Liability</h2>
        <p>Our liability for any order is limited to the amount paid for that order. Nothing in these terms limits your rights under the Consumer Affairs Authority Act No. 9 of 2003 of Sri Lanka.</p>
        <h2>6. Governing law</h2>
        <p>These terms are governed by the laws of Sri Lanka. Any dispute will be handled by the courts of Sri Lanka.</p>
        <h2>7. Contact</h2>
        <Contact />
      </>
    ),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'What personal data we collect and how we protect it.',
    body: () => (
      <>
        <p>This page describes how the Smart Arcade website handles information.</p>
        <h2>Information and browser storage</h2>
        <ul>
          <li>This site takes no payments. The cart's “Send request on WhatsApp” form and the Contact form ask for your name and mobile number (and, for delivery, your address and notes) only to prepare a WhatsApp message. They are not sent to or saved by this site.</li>
          <li>Your browser stores the items in your cart and whether you dismissed the privacy notice, so they are still there when you come back. This stays on your device.</li>
          <li>Contact links open WhatsApp with a prefilled message. The site does not send it; Smart Arcade receives it only if you tap Send in WhatsApp.</li>
        </ul>
        <h2>Card payments</h2>
        <p>{shop.payments.card.enabled
          ? <>Card payments are handled by <b>{cardGateway.name}</b>. Your card details are entered on its secure page and are not sent to or stored by Smart Arcade.</>
          : 'Card checkout is not active yet. Do not send card numbers or security codes through WhatsApp.'}</p>
        <h2>How we use your data</h2>
        <ul>
          <li>To respond to a request you send us and, if we accept an order, to arrange payment, delivery and support.</li>
          <li>To contact you about that request or order using the details you sent.</li>
        </ul>
        <h2>Sharing</h2>
        <p>Product photos are loaded from Daraz's image host, which receives the browser request needed to display each image. If you send a message through WhatsApp, WhatsApp/Meta processes it under its own terms. Google Fonts are loaded from Google, and the Contact page embeds Google Maps; those services may receive technical request data when your browser loads them. This site has no payment checkout, analytics or advertising tracker installed.</p>
        <h2>Cookies and browser storage</h2>
        <p>This version uses browser storage to remember your cart and the privacy-notice dismissal. It does not currently use analytics or advertising cookies.</p>
        <h2>Retention and your rights</h2>
        <p>Clear this site's browser data to remove your saved cart and the privacy-notice dismissal. If you send a message to Smart Arcade, contact us to ask about access, correction or deletion of the copy we receive. Records may be retained when needed for an order or warranty.</p>
        <h2>Contact</h2>
        <Contact />
      </>
    ),
  },
  {
    slug: 'refunds',
    title: 'Returns & Refunds Policy',
    summary: 'Cancellations, damaged or faulty items, and refunds.',
    // DRAFT — client to approve. Interim wording from the 21 Oct 2026 kick-off: no change-of-mind returns or
    // exchanges for now; the full returns flow is R2. Keep this page — the payment gateway reviews it.
    body: () => (
      <>
        <h2>Order cancellation</h2>
        <p>You may cancel an order free of charge any time before it is dispatched. Contact us by phone or WhatsApp with your order number. Paid amounts are refunded in full.</p>
        <h2>Change of mind</h2>
        <p>We do not accept returns or exchanges for change of mind at this time. Please check the product details and compatibility before you order — if you are unsure, ask us on WhatsApp first.</p>
        <h2>Damaged, faulty or wrong items</h2>
        <ul>
          <li>Please check your item when you receive or collect it. If it is damaged, faulty or not what you ordered, contact us within <b>{shop.returns.reportProblemHours} hours</b> with your order number and photos or a short video.</li>
          <li>Keep the item with its original box and all accessories until we have resolved the problem.</li>
          <li>After inspecting the item we will repair it, replace it or give you a full refund, including the delivery charge, at no cost to you.</li>
        </ul>
        <h2>Warranty claims</h2>
        <p>Faults that appear after the first {shop.returns.reportProblemHours} hours are handled under the product’s warranty, as shown on the product page and your invoice — see our <Link to="/policies/warranty">Warranty Policy</Link>.</p>
        <h2>How refunds are paid</h2>
        <ul>
          {shop.payments.card.enabled && <li><b>Card payments ({cardGateway.name}):</b> refunded to the same card. Refunds are processed within <b>7 working days</b> of approval; your bank may take a further 5–10 working days to show the amount.</li>}
          <li><b>Bank transfer and other payments:</b> refunded by bank transfer to your account within 7 working days of approval.</li>
        </ul>
        <h2>Contact</h2>
        <Contact />
      </>
    ),
  },
  {
    slug: 'delivery',
    title: 'Delivery Policy',
    summary: 'Delivery areas, charges, times and store pickup.',
    body: () => (
      <>
        <h2>Where we deliver</h2>
        <p>We deliver island-wide across Sri Lanka through {shop.delivery.courier}.</p>
        <h2>Charges</h2>
        <ul>
          <li>Island-wide delivery is charged by the total weight of your order: <b>{formatLKR(shop.delivery.rates.baseFee)}</b> for up to {shop.delivery.rates.baseKg} kg, plus <b>{formatLKR(shop.delivery.rates.perExtraKg)}</b> for each additional kg or part of a kg.</li>
          <li>For example, a 2.3 kg parcel costs {formatLKR(feeForWeight(2.3))} ({formatLKR(shop.delivery.rates.baseFee)} + {extraKg(2.3)} × {formatLKR(shop.delivery.rates.perExtraKg)}).</li>
          <li>We confirm the exact delivery charge with you on WhatsApp, based on the weight of your order, before anything is dispatched.</li>
          <li><b>Store pickup</b> from our {shop.city} shop is always free.</li>
          <li>From time to time we offer free-delivery promo codes; the terms are shown with each offer.</li>
        </ul>
        <h2>Delivery times</h2>
        <ul>
          <li>Orders confirmed before 2.00 pm on working days are usually dispatched the same day.</li>
          <li>Typical delivery time: <b>{shop.delivery.days}</b> after dispatch. Remote areas may take longer.</li>
          <li>Once dispatched, we send you the courier name and tracking number by WhatsApp.</li>
        </ul>
        {shop.payments.cod.enabled && (
          <>
            <h2>Cash on delivery</h2>
            <p>Cash on delivery is available for orders up to {formatLKR(shop.payments.cod.max)}. We may call to confirm COD orders before dispatch.</p>
          </>
        )}
        <h2>On receiving your parcel</h2>
        <p>Please check that the package is sealed and undamaged. Report any problem within {shop.returns.reportProblemHours} hours — see our <Link to="/policies/refunds">Returns & Refunds Policy</Link>.</p>
        <h2>Store pickup</h2>
        <p>Choose “Store pickup” on your order request. We will message you when your order is ready. Please bring your WhatsApp confirmation and a photo ID.{shop.payments.payAtStore.enabled && ' You can also pay at the store when you collect.'}</p>
      </>
    ),
  },
  {
    slug: 'warranty',
    title: 'Warranty Policy',
    summary: 'What our warranty covers and how to claim.',
    body: () => (
      <>
        <p>Warranty applies to selected items. Where a product has a warranty, its period is shown on the product page and on your invoice.</p>
        <h2>What is covered</h2>
        <ul>
          <li>Manufacturing defects and hardware faults that occur during normal use within the warranty period.</li>
          <li>We will repair or replace the item. If neither is possible, we will refund the purchase price.</li>
        </ul>
        <h2>What is not covered</h2>
        <ul>
          <li>Physical damage, liquid damage, burns, power surges or misuse.</li>
          <li>Items opened, repaired or modified by anyone other than us.</li>
          <li>Software issues, account bans, or normal wear such as scratches and stick drift caused by heavy use.</li>
          <li>Items whose warranty sticker or serial number has been removed or altered.</li>
        </ul>
        <h2>How to claim</h2>
        <ul>
          <li>Contact us with your order / invoice number and a short description or video of the issue.</li>
          <li>Bring or send the item with all accessories. We record every unit by serial number, so your invoice is your warranty card.</li>
          <li>Most claims are resolved within 7–14 working days, depending on parts or manufacturer service.</li>
        </ul>
        <h2>Contact</h2>
        <Contact />
      </>
    ),
  },
]

export const policyBySlug = (slug?: string) => policies.find(p => p.slug === slug)
