import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cardGateway, payWays, shop } from '../config/shop'
import PageHeader from '../components/PageHeader'
import { usePageTitle } from '../hooks/ui'

const availablePaymentWays = payWays()
const paymentAnswer = availablePaymentWays
  ? `You can pay by ${availablePaymentWays}.`
  : 'This site does not take payments yet. Add items to your cart and send it to us as an order request on WhatsApp. We confirm the price, stock and how to pay before anything is charged.'
const cardAnswer = shop.payments.card.enabled
  ? `Yes. Card payments are processed by ${cardGateway.name}, a secure payment gateway in Sri Lanka. Your card details are entered on ${cardGateway.name}’s secure page and never reach us.`
  : 'Card payment is not active on this site yet. We will update this page once it is approved and switched on. Please never send card numbers through WhatsApp.'

const faqs: [string, string][] = [
  ['Are your products genuine?', 'Yes. We sell original products. If you want to check a specific item before you order, ask us on WhatsApp.'],
  ['How do I pay?', paymentAnswer],
  ['Is it safe to pay by card on your website?', cardAnswer],
  ['How much is delivery and how long does it take?', `Delivery is charged by weight: Rs. ${shop.delivery.rates.baseFee} for the first ${shop.delivery.rates.baseKg} kg plus Rs. ${shop.delivery.rates.perExtraKg} for each extra kg. We confirm the exact amount on WhatsApp. Most parcels arrive in ${shop.delivery.days} after dispatch. Store pickup in ${shop.city} is free.`],
  ['Can I return or exchange an item?', `We don’t accept change-of-mind returns or exchanges at the moment. If an item arrives damaged, faulty or not as ordered, tell us within ${shop.returns.reportProblemHours} hours with photos or a short video — after inspection we’ll repair, replace or refund it. See our Returns & Refunds Policy.`],
  ['How does the warranty work?', 'Warranty applies to selected items. Where a product has one, the period is shown on its page. See our Warranty Policy for what is covered, or ask us before you order.'],
  ['Can I reserve a product or ask about stock?', 'Stock counts are not shown on the site. Add the item to your cart and send the request, or message us on WhatsApp, and we will confirm availability and the current price.'],
]

export default function Faq() {
  usePageTitle('FAQ')
  return (
    <>
      <PageHeader title="Frequently asked questions" crumbs={[{ label: 'FAQ' }]} />
      <section className="container-x !max-w-3xl pt-6">
        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="surface group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold text-white">
                {question}<ChevronDown className="h-5 w-5 shrink-0 text-lime transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-4 text-[15px] leading-relaxed text-[#d9daf0]">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-7 text-center text-[15px] text-muted">Still have a question? <Link to="/contact" className="font-semibold text-lime underline">Contact us</Link>.</p>
      </section>
    </>
  )
}
