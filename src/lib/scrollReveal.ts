/**
 * Scroll-in animation for every page, without tagging each block by hand.
 *
 * After a page renders, the blocks of each section are found and the ones
 * still below the fold are hidden with a data attribute; an observer lets each
 * one settle (fade and rise) as it comes into view. Blocks already on screen
 * are left alone, so the first screen never flashes.
 *
 * A data attribute is used rather than a class because React rewrites
 * `className` whenever it changes and would wipe an added class mid-animation.
 * The attribute is removed once the animation is over, which gives back any
 * transition the block has of its own (card hovers, for instance).
 *
 * Blocks that already use <Reveal>, and sticky, fixed or absolutely
 * positioned blocks, are skipped.
 */
const HIDDEN = 'hidden'
const SHOWN = 'shown'
const DONE_AFTER_MS = 900

const isContainer = (element: Element) =>
  element.tagName === 'DIV' && /max-w-\(--container|max-w-[2-6]xl|\bmx-auto\b/.test(element.className)

function takesPartInLayout(element: Element) {
  const { position, display } = getComputedStyle(element)
  return display !== 'none' && position !== 'sticky' && position !== 'fixed' && position !== 'absolute'
}

function blocksOf(section: Element): Element[] {
  const blocks: Element[] = []

  const add = (element: Element) => {
    if (!takesPartInLayout(element)) return
    if (element.closest('.reveal')) return

    // A grid of cards is animated card by card, not as one slab.
    const children = [...element.children].filter(takesPartInLayout)
    if (getComputedStyle(element).display === 'grid' && children.length >= 2) {
      for (const child of children) if (!child.closest('.reveal')) blocks.push(child)
      return
    }

    blocks.push(element)
  }

  for (const child of section.children) {
    if (!takesPartInLayout(child)) continue
    if (isContainer(child)) {
      for (const inner of child.children) add(inner)
    } else {
      add(child)
    }
  }

  return blocks
}

export function setUpScrollReveal(root: ParentNode = document): () => void {
  if (
    typeof IntersectionObserver === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {}
  }

  const timers = new Set<number>()
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const element = entry.target as HTMLElement
        observer.unobserve(element)
        element.dataset.rv = SHOWN
        const timer = window.setTimeout(() => {
          delete element.dataset.rv
          element.style.removeProperty('--rv-delay')
          timers.delete(timer)
        }, DONE_AFTER_MS + 300)
        timers.add(timer)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  )

  const viewport = window.innerHeight
  const touched: HTMLElement[] = []

  for (const section of root.querySelectorAll('main section')) {
    const blocks = blocksOf(section)
    blocks.forEach((block, index) => {
      const element = block as HTMLElement
      if (element.closest('[data-rv]')) return // inside a block already animated
      const top = element.getBoundingClientRect().top
      if (top < viewport * 0.92) return // already in view: leave it be

      element.dataset.rv = HIDDEN
      element.style.setProperty('--rv-delay', `${Math.min(index, 4) * 70}ms`)
      touched.push(element)
      observer.observe(element)
    })
  }

  return () => {
    observer.disconnect()
    for (const timer of timers) window.clearTimeout(timer)
    for (const element of touched) {
      delete element.dataset.rv
      element.style.removeProperty('--rv-delay')
    }
  }
}
