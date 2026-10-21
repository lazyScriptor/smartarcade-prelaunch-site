import { Minus, Plus } from 'lucide-react'

export default function QtyStepper({ value, onChange, small = false }: { value: number; onChange: (n: number) => void; small?: boolean }) {
  const h = small ? 'h-8' : 'h-11'
  return (
    <div className={`inline-flex ${h} items-center rounded-xl border border-slate-200 bg-white`}>
      <button className="flex h-full w-9 items-center justify-center text-slate-600 hover:text-navy" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{value}</span>
      <button className="flex h-full w-9 items-center justify-center text-slate-600 hover:text-navy" onClick={() => onChange(Math.min(value + 1, 10))} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
