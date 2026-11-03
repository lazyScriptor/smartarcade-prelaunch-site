import { Minus, Plus } from 'lucide-react'

export default function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex h-11 items-center rounded-[10px] border border-strong bg-tint">
      <button type="button" className="flex h-full w-11 items-center justify-center text-ink transition-colors hover:text-accent" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="price w-7 text-center text-[15px] text-ink" aria-live="polite">{value}</span>
      <button type="button" disabled={value >= 10} className="flex h-full w-11 items-center justify-center text-ink transition-colors hover:text-accent disabled:opacity-40" onClick={() => onChange(Math.min(value + 1, 10))} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
