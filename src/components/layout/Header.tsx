import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogoLockup } from '../ui/Logo'
import { navItems, opensDark } from '../../lib/routes'
import { contacts, hasContact } from '../../data/contacts'

/**
 * The fixed header overlays the opening screen and takes a white background
 * on scroll or on pages that open with a light background.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [atTop, setAtTop] = useState(false)
  const { pathname } = useLocation()

  // Plateless only where white type has a dark opening screen to sit on. A
  // page that opens light wears the plate from the start.
  const scrolled = !atTop || !opensDark(pathname)

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
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
            className={`pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-1 rounded-full transition-all duration-300 ${
              scrolled
                ? 'bg-white px-3 py-1.5 text-ink-700 shadow-lg shadow-ink-900/10'
                : 'bg-transparent px-4 py-2 text-white'
            }`}
          >
            <Link to="/" className="shrink-0 px-1" aria-label={`${contacts.companyName} — на главную`}>
              <LogoLockup />
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  // The secondary sections wait for the width to carry them, so
                  // the pill never outgrows the viewport.
                  className={`rounded-full px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
                    scrolled ? 'hover:bg-sand-200' : 'hover:bg-white/15'
                  } ${item.primary ? '' : 'hidden xl:block'}`}
                >
                  {item.label}
                </NavItem>
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

            <Link
              to="/contacts"
              className="ml-1 hidden shrink-0 rounded-full bg-ink-900 px-4 py-2 text-sm text-white transition-colors hover:bg-ink-800 sm:block"
            >
              Связаться
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              className={`ml-1 grid size-9 shrink-0 place-items-center rounded-full lg:hidden ${
                scrolled || menuOpen ? 'bg-sand-200' : 'bg-white/15'
              }`}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] bg-current transition-transform ${
                    menuOpen ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[5px] h-[2px] bg-current transition-opacity ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] bg-current transition-transform ${
                    menuOpen ? '-translate-y-[5px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>

          {menuOpen && (
            <nav className="pointer-events-auto mx-auto mt-2 max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-panel bg-white p-5 shadow-xl shadow-ink-900/10 lg:hidden">
              <p className="mb-2 text-xs tracking-wider text-ink-400 uppercase">Разделы</p>
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-sand-200 py-2.5 text-base last:border-0"
                >
                  {item.label}
                </NavItem>
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

    </>
  )
}

/**
 * Renders anything rooted at the site as a router link, so the base path is
 * applied; a bare in-page target stays a plain anchor.
 */
function NavItem({
  to,
  className,
  onClick,
  children,
}: {
  to: string
  className: string
  onClick?: () => void
  children: React.ReactNode
}) {
  if (!to.startsWith('/')) {
    return (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
