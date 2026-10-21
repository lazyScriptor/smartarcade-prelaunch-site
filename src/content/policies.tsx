// Policy templates drafted by tadXweb for the client's approval (not legal advice) — FR-CMS-11 / FR-CMS-12.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatLKR, shop } from '../config/shop'

export interface PolicyDoc { slug: string; title: string; summary: string; body: () => ReactNode }

const Contact = () => (
  <ul>
    <li>Phone / WhatsApp: <a href={`tel:${shop.phoneHref}`}>{shop.phone}</a></li>
    <li>Email: <a href={`mailto:${shop.email}`}>{shop.email}</a></li>
    <li>Shop: {shop.address}</li>
  </ul>
)

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
          <li>Pre-owned items are tested and graded by us; their condition is described on each product page.</li>
        </ul>
        <h2>2. Orders</h2>
        <ul>
          <li>An order is confirmed when we accept it and payment is received (or, for cash on delivery, when we confirm it by phone or WhatsApp).</li>
          <li>We may refuse or cancel an order if stock is unavailable, the payment fails or is suspected to be fraudulent, or delivery details cannot be verified. Any amount paid will be refunded in full.</li>
        </ul>
        <h2>3. Payment</h2>
        <ul>
          <li>We accept Visa, Mastercard and American Express cards through <b>PayHere</b>, bank transfer, and cash on delivery.</li>
          <li>Card payments are processed securely by PayHere (PCI-DSS compliant). We never see or store your full card details.</li>
          <li>A single card payment is limited to {formatLKR(shop.payments.payhere.maxPerPayment)}. Larger orders can be paid by bank transfer or cash on delivery.</li>
          <li>Bank-transfer orders are dispatched once the funds reach our account.</li>
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
        <p>{shop.legalName} respects your privacy and handles personal data in line with the Personal Data Protection Act No. 9 of 2022 of Sri Lanka.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Details you give us when ordering or contacting us: name, mobile number, email, delivery address and order notes.</li>
          <li>Order and warranty records, including product serial numbers.</li>
          <li>Basic technical data (browser type, pages visited) through essential cookies, and analytics cookies only if you accept them.</li>
        </ul>
        <h2>Card payments</h2>
        <p>Card payments are handled entirely by <b>PayHere</b>. Your card number is entered on PayHere’s secure page and is never sent to or stored by us.</p>
        <h2>How we use your data</h2>
        <ul>
          <li>To process, deliver and support your orders and warranty claims.</li>
          <li>To contact you about your order by phone, SMS, WhatsApp or email.</li>
          <li>To send offers — only if you have opted in. You can opt out at any time.</li>
        </ul>
        <h2>Sharing</h2>
        <p>We share only what is needed with our courier partners (name, phone, address) and payment provider (PayHere). We never sell your personal data.</p>
        <h2>Cookies</h2>
        <p>Essential cookies keep your cart and checkout working. Analytics or advertising cookies are loaded only after you accept them in the cookie notice.</p>
        <h2>Retention and your rights</h2>
        <p>We keep order records for as long as required for accounting and warranty purposes. You may ask to see, correct or delete your personal data by contacting us.</p>
        <h2>Contact</h2>
        <Contact />
      </>
    ),
  },
  {
    slug: 'refunds',
    title: 'Returns & Refunds Policy',
    summary: 'How returns, cancellations and refunds work.',
    body: () => (
      <>
        <h2>Order cancellation</h2>
        <p>You may cancel an order free of charge any time before it is dispatched. Contact us by phone or WhatsApp with your order number. Paid amounts are refunded in full.</p>
        <h2>Change-of-mind returns</h2>
        <ul>
          <li>Unopened items in their original sealed packaging may be returned within <b>{shop.returns.changeOfMindDays} days</b> of delivery or collection, with the receipt / order number.</li>
          <li>Opened items, digital codes, gift cards and items damaged after delivery cannot be returned for change of mind.</li>
          <li>Return delivery costs for change-of-mind returns are paid by the customer.</li>
        </ul>
        <h2>Damaged, faulty or wrong items</h2>
        <ul>
          <li>Please check your parcel on delivery. If an item arrives damaged, faulty or is not what you ordered, contact us within <b>48 hours</b> with photos or a short video.</li>
          <li>We will arrange a replacement or a full refund, including delivery charges, at no cost to you.</li>
          <li>Faults that appear later are handled under our <Link to="/policies/warranty">Warranty Policy</Link>.</li>
        </ul>
        <h2>How refunds are paid</h2>
        <ul>
          <li><b>Card payments (PayHere):</b> refunded to the same card. Refunds are processed within <b>7 working days</b> of approval; your bank may take a further 5–10 working days to show the amount.</li>
          <li><b>Bank transfer and cash on delivery:</b> refunded by bank transfer to your account within 7 working days of approval.</li>
          <li>Returned items are inspected before a refund is approved.</li>
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
          <li>Flat island-wide delivery fee: <b>{formatLKR(shop.delivery.flatFee)}</b> per order.</li>
          <li><b>Free delivery</b> on orders of {formatLKR(shop.delivery.freeAbove)} or more.</li>
          <li><b>Store pickup</b> from our {shop.city} shop is always free.</li>
        </ul>
        <h2>Delivery times</h2>
        <ul>
          <li>Orders confirmed before 2.00 pm on working days are usually dispatched the same day.</li>
          <li>Typical delivery time: <b>{shop.delivery.days}</b> after dispatch. Remote areas may take longer.</li>
          <li>Once dispatched, we send you the courier name and tracking number by WhatsApp.</li>
        </ul>
        <h2>Cash on delivery</h2>
        <p>Cash on delivery is available for orders up to {formatLKR(shop.payments.cod.max)}. We may call to confirm COD orders before dispatch.</p>
        <h2>On receiving your parcel</h2>
        <p>Please check that the package is sealed and undamaged. Report any problem within 48 hours — see our <Link to="/policies/refunds">Returns & Refunds Policy</Link>.</p>
        <h2>Store pickup</h2>
        <p>Choose “Store pickup” at checkout. We will message you when your order is ready. Please bring your order number and the payment card or ID used.</p>
      </>
    ),
  },
  {
    slug: 'warranty',
    title: 'Warranty Policy',
    summary: 'What our warranty covers and how to claim.',
    body: () => (
      <>
        <p>Every item we sell comes with a warranty. The warranty period is shown on each product page and on your invoice.</p>
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
