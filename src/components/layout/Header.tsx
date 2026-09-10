import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ModelDrawer } from './ModelDrawer'
import { homeSections, modelRoutes } from '../../lib/routes'
import { contacts, hasContact } from '../../data/contacts'

/**
 * Floating pill header. It sits over the content rather than pushing it down,
 * tightens once the page is scrolled, and carries the sections of the site;
 * the model line lives behind its own button, which opens a slide-out list.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="mx-auto max-w-(--container-content)">
          <div
            className={`pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-1 rounded-full bg-white/95 backdrop-blur transition-all duration-300 ${
              scrolled ? 'px-3 py-1.5 shadow-lg shadow-ink-900/10' : 'px-4 py-2 shadow-md shadow-ink-900/5'
            }`}
          >
            <Link
              to="/"
              className="shrink-0 px-2 text-base font-semibold tracking-[0.12em] uppercase sm:text-lg"
            >
              {contacts.companyName}
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {homeSections.map((section) => (
                <a
                  key={section.id}
                  href={`/#${section.id}`}
                  // The secondary sections wait for the width to carry them,
                  // so the pill never outgrows the viewport.
                  className={`rounded-full px-2.5 py-1.5 text-sm whitespace-nowrap text-ink-700 transition-colors hover:bg-sand-200 ${
                    section.primary ? '' : 'hidden xl:block'
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </nav>

            {hasContact(contacts.phone.display) && (
              <a
                href={contacts.phone.href}
                className="hidden pl-2 text-sm font-semibold whitespace-nowrap xl:block"
              >
                {contacts.phone.display}
              </a>
            )}

            <a
              href="/#contacts"
              className="ml-1 hidden shrink-0 rounded-full bg-ink-900 px-4 py-2 text-sm text-white transition-colors hover:bg-ink-800 sm:block"
            >
              Связаться
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              className="ml-1 grid size-9 shrink-0 place-items-center rounded-full bg-sand-200 lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] bg-ink-900 transition-transform ${
                    menuOpen ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[5px] h-[2px] bg-ink-900 transition-opacity ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] bg-ink-900 transition-transform ${
                    menuOpen ? '-translate-y-[5px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>

          <nav
            aria-label="Модели"
            className={`pointer-events-auto mx-auto mt-2 hidden w-fit max-w-full items-center gap-0.5 rounded-full bg-white/95 px-2 py-1.5 backdrop-blur transition-all duration-300 md:flex ${
              scrolled ? 'shadow-lg shadow-ink-900/10' : 'shadow-md shadow-ink-900/5'
            }`}
          >
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

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="ml-1 shrink-0 rounded-full bg-sand-200 px-3 py-1.5 text-[0.8125rem] text-ink-700 transition-colors hover:bg-sand-300"
            >
              Все модели
            </button>
          </nav>

          {menuOpen && (
            <nav className="pointer-events-auto mx-auto mt-2 max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-panel bg-white p-5 shadow-xl shadow-ink-900/10 lg:hidden">
              <p className="mb-2 text-xs tracking-wider text-ink-400 uppercase">Разделы</p>
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

              <p className="mt-5 mb-2 text-xs tracking-wider text-ink-400 uppercase">Модели</p>
              {modelRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="block border-b border-sand-200 py-2.5 text-base last:border-0"
                >
                  {route.label}
                </Link>
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

      <ModelDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
