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
  autoAdvanceMs,
  pauseAdvance = false,
}: {
  children: ReactNode
  label: string
  hint?: string
  className?: string
  autoAdvanceMs?: number
  pauseAdvance?: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [paused, setPaused] = useState(false)

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

  useEffect(() => {
    const track = trackRef.current
    if (!track || !autoAdvanceMs || paused || pauseAdvance) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const hover = window.matchMedia('(hover: hover)')
    const slider = track.parentElement
    let timer: number | undefined

    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (!entry.isIntersecting) return

      timer = window.setInterval(() => {
        if (document.hidden || reducedMotion.matches) return
        if (hover.matches && slider?.matches(':hover')) return
        if (slider?.querySelector(':focus-visible')) return

        const max = track.scrollWidth - track.clientWidth
        if (max <= 4) return
        if (track.scrollLeft >= max - 4) {
          track.scrollTo({ left: 0, behavior: 'instant' })
        } else {
          track.scrollBy({ left: slideWidth(track), behavior: 'smooth' })
        }
      }, autoAdvanceMs)
    }, { threshold: 0.5 })

    observer.observe(track)

    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [autoAdvanceMs, pauseAdvance, paused])

  const scrollBy = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const distance = autoAdvanceMs ? slideWidth(track) : track.clientWidth * 0.8
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * distance, behavior: reducedMotion ? 'instant' : 'smooth' })
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
        className="flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto pb-2 sm:scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {scrollable && (
        <div className="mx-auto mt-6 flex max-w-(--container-content) items-center justify-end gap-3 px-4 sm:px-6">
          <span className="mr-auto hidden text-sm text-ink-400 sm:block">{hint}</span>
          {autoAdvanceMs && (
            <button
              type="button"
              onClick={() => setPaused((current) => !current)}
              className="mr-auto min-h-11 rounded-full bg-white px-4 text-sm font-medium text-ink-700 shadow-sm shadow-ink-900/10 transition-colors hover:bg-ink-800 hover:text-white motion-reduce:hidden sm:mr-0"
            >
              {paused ? 'Возобновить' : 'Пауза'}
            </button>
          )}
          <ArrowButton direction="prev" disabled={atStart} onClick={() => scrollBy(-1)} />
          <ArrowButton direction="next" disabled={atEnd} onClick={() => scrollBy(1)} />
        </div>
      )}
    </div>
  )
}

function slideWidth(track: HTMLDivElement) {
  const [first, second] = track.children
  if (!first || !second) return track.clientWidth
  return second.getBoundingClientRect().left - first.getBoundingClientRect().left
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
