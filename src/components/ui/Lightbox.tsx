import { useCallback, useEffect, useState } from 'react'
import { photoUrl } from '../../lib/photos'

export interface LightboxPhoto {
  file: string
  alt: string
}

/**
 * A grid of photographs that open full-size. Click or Enter opens a viewer
 * over the page; arrows (or the keyboard) move between photographs, Esc or a
 * click outside closes it. The page behind does not scroll while it is open.
 */
export function PhotoGallery({
  photos,
  className = '',
  thumbClassName = '',
}: {
  photos: LightboxPhoto[]
  /** Layout of the thumbnails. */
  className?: string
  /** Shape of each thumbnail. */
  thumbClassName?: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (direction: -1 | 1) =>
      setOpen((current) =>
        current === null ? current : (current + direction + photos.length) % photos.length,
      ),
    [photos.length],
  )

  useEffect(() => {
    if (open === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, step])

  const current = open === null ? null : photos[open]

  return (
    <>
      <div className={className}>
        {photos.map((photo, index) => (
          <button
            key={photo.file}
            type="button"
            onClick={() => setOpen(index)}
            aria-label={`Открыть фото: ${photo.alt}`}
            className="group relative block cursor-zoom-in overflow-hidden rounded-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <img
              src={photoUrl(photo.file)}
              alt={photo.alt}
              loading="lazy"
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${thumbClassName}`}
            />
            <span
              aria-hidden="true"
              className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink-800 opacity-0 shadow transition-opacity group-hover:opacity-100 max-sm:opacity-100"
            >
              <svg viewBox="0 0 20 20" className="size-4">
                <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m13 13 4.5 4.5M8.5 6v5M6 8.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink-900/90 p-4 backdrop-blur-sm sm:p-10"
        >
          <img
            src={photoUrl(current.file)}
            alt={current.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[calc(100dvh-5rem)] max-w-[calc(100vw-2rem)] rounded-card object-contain shadow-2xl sm:max-h-[calc(100dvh-6rem)] sm:max-w-[calc(100vw-10rem)]"
          />

          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white text-ink-900 shadow-lg"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
              <path d="m3 3 10 10M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {photos.length > 1 &&
            ([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  step(direction)
                }}
                aria-label={direction === -1 ? 'Предыдущее фото' : 'Следующее фото'}
                className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-lg ${
                  direction === -1 ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
                }`}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
                  <path
                    d={direction === -1 ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {open + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  )
}
