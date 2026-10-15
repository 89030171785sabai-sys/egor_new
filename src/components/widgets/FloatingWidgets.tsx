import { useEffect, useState } from 'react'
import { QuizPopup } from '../quiz/QuizPopup'

/**
 * The floating elements: the consultant quiz on the left, which opens by
 * itself once past the first screen, and a round button on the right that
 * takes the visitor back to the top once they have scrolled down the page.
 */
export function FloatingWidgets() {
  return (
    <>
      <QuizPopup />
      <ScrollToTop />
    </>
  )
}

function ScrollToTop() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const update = () => setShown(window.scrollY > 700)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Наверх"
      title="Наверх"
      tabIndex={shown ? 0 : -1}
      className={`fixed right-4 bottom-4 z-30 grid size-12 place-items-center rounded-full bg-ink-900 text-white shadow-xl shadow-ink-900/25 transition-all duration-300 hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:right-6 sm:bottom-6 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5">
        <path
          d="M3 10l5-5 5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
