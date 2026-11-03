import { useEffect, useState } from 'react'
import { prefersReducedMotion, useInView } from '../hooks/ui'

// A small silent looping clip: plays only while on screen. Visitors who ask for reduced motion or
// less data, and browsers that refuse autoplay, simply see the still poster.
export default function Clip({ name, label, className = '' }: { name: string; label: string; className?: string }) {
  const [ref, inView] = useInView<HTMLVideoElement>({ threshold: 0.2 })
  const [stillOnly] = useState(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    return prefersReducedMotion() || !!connection?.saveData
  })

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    video.setAttribute('muted', '') // React only sets the property; iOS Safari checks the attribute before autoplaying
    if (inView) video.play().catch(() => { /* autoplay refused: the poster stays up */ })
    else video.pause()
  }, [inView, ref])

  const poster = `/media/${name}.webp`
  if (stillOnly) return <img src={poster} alt={label} className={`object-cover ${className}`} />
  return (
    <video
      ref={ref}
      src={`/media/${name}.mp4`}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      className={`object-cover ${className}`}
    />
  )
}
