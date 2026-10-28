import { ImageOff } from 'lucide-react'
import { useState } from 'react'

export default function CatalogImage({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div role="img" aria-label={`${alt} photo unavailable`} className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        <ImageOff className="h-10 w-10" strokeWidth={1.4} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
