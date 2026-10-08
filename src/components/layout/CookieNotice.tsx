import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { hasAnalytics, startAnalytics } from '../../lib/analytics'

const ACCEPTED_KEY = 'cookie-notice-accepted'

/**
 * The cookie notice.
 *
 * The notice is not decoration: the analytics counter is started from here
 * and nowhere else, so nothing is requested and nothing is stored until a
 * visitor has actually accepted. Without the acceptance the site keeps only
 * its own two flags — the closed consultant popup and this closed notice.
 *
 * The bar is held back until the browser has been read, so a visitor who has
 * already accepted never sees it blink past on the way in.
 */
export function CookieNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(ACCEPTED_KEY) === '1') startAnalytics()
      else setShow(true)
    } catch {
      // Private browsing can refuse storage outright. The notice is then shown
      // every visit, which is the harmless way round.
      setShow(true)
    }
  }, [])

  if (!show) return null

  const accept = () => {
    try {
      localStorage.setItem(ACCEPTED_KEY, '1')
    } catch {
      // Nothing to do — the bar closes for this visit either way.
    }
    startAnalytics()
    setShow(false)
  }

  return (
    <div
      role="region"
      aria-label="Использование файлов cookie"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="pointer-events-auto mx-auto flex max-w-(--container-content) flex-col gap-4 rounded-panel bg-ink-800 p-5 shadow-xl shadow-ink-900/25 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <p className="text-sm leading-relaxed text-ink-300">
          Сайт сохраняет в вашем браузере небольшие файлы cookie
          {hasAnalytics ? ' и собирает обезличенную статистику посещений' : ''}. Подробнее — в{' '}
          <Link
            to="/cookies"
            className="text-white underline underline-offset-4 hover:text-brand-300"
          >
            политике cookie
          </Link>{' '}
          и{' '}
          <Link
            to="/privacy"
            className="text-white underline underline-offset-4 hover:text-brand-300"
          >
            политике конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-sand-200 sm:self-center"
        >
          Понятно
        </button>
      </div>
    </div>
  )
}
