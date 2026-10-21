import { MessageCircle } from 'lucide-react'
import { shop, waLink } from '../config/shop'

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink(`Hi ${shop.name}, I have a question.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/20 transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
