import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Horizontal slider built on native scrolling with snap points, so it keeps
 * touch inertia and keyboard scrolling for free. Adds what the reference has
 * on top: round arrow controls, a hint that the track can be dragged, and the
 * next slide peeking in from the edge.
 */
export function Slider({
  children,
  label,
  hint = 'Перетащите или пролистайте',
  className = '',
}: {
  children: ReactNode
  label: string
  hint?: string
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const syncEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setAtStart(track.scrollLeft <= 4)
    setAtEnd(track.scrollLeft >= max - 4)
  }, [])

  useEffect(() => {
    syncEdges()
    const track = trackRef.current
    if (!track) return

    track.addEventListener('scroll', syncEdges, { passive: true })
    window.addEventListener('resize', syncEdges)
    return () => {
      track.removeEventListener('scroll', syncEdges)
      window.removeEventListener('resize', syncEdges)
    }
  }, [syncEdges])

  const scrollBy = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  // Dragging the track with a mouse, the way the reference sliders behave.
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const track = trackRef.current
    if (!track) return
    drag.current = { active: true, startX: event.clientX, startScroll: track.scrollLeft }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const track = trackRef.current
    if (!drag.current.active || !track) return
    track.scrollLeft = drag.current.startScroll - (event.clientX - drag.current.startX)
  }

  const endDrag = () => {
    drag.current.active = false
  }

  const scrollable = !atStart || !atEnd

  return (
    <div className={className}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {scrollable && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <span className="mr-auto hidden text-sm text-ink-400 sm:block">{hint}</span>
          <ArrowButton direction="prev" disabled={atStart} onClick={() => scrollBy(-1)} />
          <ArrowButton direction="next" disabled={atEnd} onClick={() => scrollBy(1)} />
        </div>
      )}
    </div>
  )
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Предыдущий слайд' : 'Следующий слайд'}
      className="grid size-11 place-items-center rounded-full bg-white text-ink-700 shadow-sm shadow-ink-900/10 transition-all hover:bg-ink-800 hover:text-white disabled:pointer-events-none disabled:opacity-35"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
        <path
          d={direction === 'prev' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
