import { MessageCircle } from 'lucide-react'
import { shop, waLink } from '../config/shop'

// Desktop only: phones and tablets have Chat in the tab bar.
export default function WhatsAppFloat() {
  return (
    <a
      href={waLink(`Hi ${shop.name}, I have a question.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-[#052e1a] shadow-xl shadow-black/40 transition-transform duration-200 hover:scale-105 active:scale-95 lg:flex"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
