import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { modelRoutes, homeSections } from '../../lib/routes'
import { contacts, hasContact } from '../../data/contacts'

/**
 * Floating pill header. It sits over the content rather than pushing it down,
 * and tightens once the page is scrolled.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu when navigating, and keep the page from scrolling under it.
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-(--container-content)">
        <div
          className={`pointer-events-auto mx-auto flex items-center gap-3 rounded-full bg-white/95 backdrop-blur transition-all duration-300 ${
            scrolled ? 'px-4 py-2 shadow-lg shadow-ink-900/10' : 'px-5 py-3 shadow-md shadow-ink-900/5'
          }`}
        >
          <Link
            to="/"
            className="font-display shrink-0 text-lg tracking-wide uppercase sm:text-xl"
            aria-label={`${contacts.companyName} — на главную`}
          >
            {contacts.companyName}
          </Link>

          <nav className="mx-auto hidden items-center gap-1 xl:flex">
            {modelRoutes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'text-ink-600 hover:bg-sand-200 hover:text-ink-900'
                  }`
                }
              >
                {route.label}
              </NavLink>
            ))}
          </nav>

          <a
            href={contacts.phone.href}
            className="ml-auto hidden text-sm font-semibold whitespace-nowrap xl:ml-0 lg:block"
          >
            {contacts.phone.display}
          </a>

          <a
            href="#contacts"
            className="hidden shrink-0 rounded-full bg-ink-800 px-4 py-2 text-sm text-white transition-colors hover:bg-ink-900 md:block"
          >
            Связаться
          </a>

          {hasContact(contacts.whatsapp) && (
            <a
              href={contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
              className="hidden size-9 shrink-0 place-items-center rounded-full bg-sand-200 text-ink-700 transition-colors hover:bg-brand-100 md:grid"
            >
              <WhatsAppIcon />
            </a>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-sand-200 xl:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute inset-x-0 top-0 h-[2px] bg-ink-800 transition-transform ${
                  menuOpen ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute inset-x-0 top-[5px] h-[2px] bg-ink-800 transition-opacity ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-[2px] bg-ink-800 transition-transform ${
                  menuOpen ? '-translate-y-[5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {menuOpen && (
          <nav className="pointer-events-auto mt-2 max-h-[80dvh] overflow-y-auto rounded-panel bg-white p-5 shadow-xl shadow-ink-900/10 xl:hidden">
            <p className="mb-2 text-xs tracking-wider text-ink-400 uppercase">Модели</p>
            {modelRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="block border-b border-sand-200 py-2.5 text-base last:border-0"
              >
                {route.label}
              </Link>
            ))}

            <p className="mt-5 mb-2 text-xs tracking-wider text-ink-400 uppercase">Разделы</p>
            {homeSections.map((section) => (
              <a
                key={section.id}
                href={`/#${section.id}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-sand-200 py-2.5 text-base last:border-0"
              >
                {section.label}
              </a>
            ))}

            <div className="mt-5 border-t border-sand-200 pt-4">
              <a href={contacts.phone.href} className="block text-lg font-semibold">
                {contacts.phone.display}
              </a>
              <p className="mt-1 text-sm text-ink-400">{contacts.workingHours}</p>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.24-3.44-.72-2.92-1.15-4.75-4.2-4.9-4.4-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.36.24-.27.53-.34.72-.34.19 0 .38.01.55.01.17 0 .41-.07.64.49.24.58.8 1.97.87 2.11.07.15.12.32.02.51-.1.2-.19.32-.38.5-.19.17-.4.39-.28.6.12.2.53.87 1.14 1.41.78.7 1.44.92 1.64 1.02.19.1.39.09.53-.06.15-.15.63-.73.8-.98.17-.24.34-.2.58-.12.24.1 1.51.71 1.77.84.26.12.43.19.5.29.06.1.06.6-.18 1.27Z" />
    </svg>
  )
}
