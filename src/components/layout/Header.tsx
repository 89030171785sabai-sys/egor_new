import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navRoutes } from '../../lib/routes'
import { contacts, hasContact } from '../../data/contacts'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The mobile menu owns the viewport while open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex max-w-(--container-content) items-center gap-6 px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          {contacts.companyName}
        </Link>

        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          {navRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-brand-500 ${
                  isActive ? 'text-brand-600' : 'text-ink-700'
                }`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>

        {hasContact(contacts.phone.display) && (
          <a href={contacts.phone.href} className="hidden font-semibold lg:block">
            {contacts.phone.display}
          </a>
        )}

        <button
          type="button"
          className="ml-auto lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-6 bg-ink-900" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink-900" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink-900" />
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-ink-100 bg-white px-4 py-4 lg:hidden">
          {navRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-base text-ink-700"
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
