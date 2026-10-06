import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has been scrolled into view, and true from then on.
 *
 * Used where a touch screen has to be given what a pointer gets for free: the
 * drawings come to colour under the cursor on a desktop, and on a phone there
 * is no cursor, so they come to colour when they arrive on screen instead.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, seen }
}
