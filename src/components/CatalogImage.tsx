import { ImageOff } from 'lucide-react'
import { useState } from 'react'

// Daraz's image host can resize on the fly; phones get a small WebP instead of the full photo.
const sized = (src: string, size: number) =>
  src.includes('static-01.daraz.lk') ? `${src}_${size}x${size}q75.jpg_.webp` : src

export default function CatalogImage({ src, alt, className = '', eager = false, sizes = '(min-width: 1024px) 25vw, 50vw', full = false }: {
  src: string
  alt: string
  className?: string
  eager?: boolean
  sizes?: string
  full?: boolean // hero-size use: offers larger files
}) {
  const [stage, setStage] = useState<'sized' | 'original' | 'failed'>('sized')

  if (stage === 'failed' || !src) {
    return (
      <div role="img" aria-label={`${alt} photo unavailable`} className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        <ImageOff className="h-10 w-10" strokeWidth={1.4} />
      </div>
    )
  }

  const props = stage === 'sized'
    ? {
        src: sized(src, full ? 800 : 400),
        srcSet: full
          ? `${sized(src, 500)} 500w, ${sized(src, 800)} 800w, ${sized(src, 1000)} 1000w`
          : `${sized(src, 300)} 300w, ${sized(src, 500)} 500w`,
        sizes,
      }
    : { src }

  return (
    <img
      {...props}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setStage(stage === 'sized' ? 'original' : 'failed')}
      className={className}
    />
  )
}
