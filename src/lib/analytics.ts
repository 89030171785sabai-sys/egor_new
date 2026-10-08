/**
 * Yandex Metrica, loaded on consent and not before.
 *
 * Two conditions have to hold for the counter to exist at all: the site must
 * be built with a counter id, and the visitor must have accepted the cookie
 * notice. Until both are true nothing is requested and nothing is stored,
 * which is what lets the notice mean what it says.
 *
 * The id is a build-time variable rather than a literal, so the counter stays
 * off on previews and on anyone's checkout until it is deliberately set:
 *
 *     VITE_YANDEX_METRIKA_ID=99999999 npm run build
 */
const COUNTER_ID = import.meta.env.VITE_YANDEX_METRIKA_ID as string | undefined

declare global {
  interface Window {
    ym?: ((id: number, action: string, ...rest: unknown[]) => void) & { a?: unknown[]; l?: number }
  }
}

let started = false

/** True where a counter is configured at all — the notice says so if it is. */
export const hasAnalytics = Boolean(COUNTER_ID)

export function startAnalytics() {
  if (started || !COUNTER_ID || typeof window === 'undefined') return
  started = true

  // Yandex's own stub: calls made before the script lands are queued on it.
  window.ym =
    window.ym ||
    function queue(...args: unknown[]) {
      ;(window.ym!.a = window.ym!.a || []).push(args)
    }
  window.ym.l = Date.now()

  const script = document.createElement('script')
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  script.async = true
  document.head.appendChild(script)

  window.ym(Number(COUNTER_ID), 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
  })
}

/** Records a page change, which a single-page site has to report by hand. */
export function trackPageView(path: string) {
  if (!started || !COUNTER_ID) return
  window.ym?.(Number(COUNTER_ID), 'hit', path)
}
