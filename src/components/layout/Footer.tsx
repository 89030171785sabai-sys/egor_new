import { Link } from 'react-router-dom'
import { navRoutes } from '../../lib/routes'
import { contacts, hasContact } from '../../data/contacts'

export function Footer() {
  return (
    <footer className="mt-20 bg-ink-900 text-ink-100">
      <div className="mx-auto grid max-w-(--container-content) gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-lg font-semibold text-white">
            {contacts.companyName}
          </Link>
          <p className="mt-2 text-sm text-ink-300">{contacts.tagline}</p>
        </div>

        <nav className="text-sm">
          <p className="mb-3 font-semibold text-white">Разделы</p>
          {navRoutes.map((route) => (
            <Link key={route.path} to={route.path} className="block py-1 text-ink-300 hover:text-white">
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Контакты</p>
          {hasContact(contacts.phone.display) && (
            <a href={contacts.phone.href} className="block py-1 text-ink-300 hover:text-white">
              {contacts.phone.display}
            </a>
          )}
          {hasContact(contacts.email) && (
            <a href={`mailto:${contacts.email}`} className="block py-1 text-ink-300 hover:text-white">
              {contacts.email}
            </a>
          )}
          {contacts.addresses.map((address) => (
            <p key={address.street} className="py-1 text-ink-300">
              {address.city}, {address.street}
            </p>
          ))}
          {hasContact(contacts.workingHours) && (
            <p className="py-1 text-ink-300">{contacts.workingHours}</p>
          )}
        </div>

        <div className="text-sm text-ink-300">
          <p className="mb-3 font-semibold text-white">Реквизиты</p>
          {hasContact(contacts.legal.entity) && <p className="py-1">{contacts.legal.entity}</p>}
          {hasContact(contacts.legal.inn) && <p className="py-1">ИНН {contacts.legal.inn}</p>}
          {hasContact(contacts.legal.ogrnip) && (
            <p className="py-1">ОГРНИП {contacts.legal.ogrnip}</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-(--container-content) px-4 py-5 text-xs text-ink-300">
          © {new Date().getFullYear()} {contacts.companyName}
        </div>
      </div>
    </footer>
  )
}
