import { Link } from 'react-router-dom'
import { modelRoutes, legalRoutes, contentRoutes } from '../../lib/routes'
import { contacts, hasContact } from '../../data/contacts'

/** Light footer built as four rows separated by hairlines. */
export function Footer() {
  return (
    <footer className="border-t border-sand-300 bg-sand-50">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-4 border-b border-sand-300 py-6">
          <Link to="/" className="font-display text-xl tracking-wide uppercase">
            {contacts.companyName}
          </Link>
          <p className="text-sm text-ink-400">{contacts.tagline}</p>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <a href={contacts.phone.href} className="font-semibold whitespace-nowrap">
              {contacts.phone.display}
            </a>
            <Link
              to="/contacts"
              className="rounded-full bg-ink-800 px-5 py-2.5 text-sm text-white transition-colors hover:bg-ink-900"
            >
              Связаться
            </Link>
            {hasContact(contacts.telegram) && (
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-sand-300 px-4 py-2.5 text-sm transition-colors hover:bg-sand-200"
              >
                Telegram
              </a>
            )}
            {hasContact(contacts.vk) && (
              <a
                href={contacts.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-sand-300 px-4 py-2.5 text-sm transition-colors hover:bg-sand-200"
              >
                VK
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-sand-300 py-5 text-sm">
          <span className="text-ink-400">Разделы</span>
          {contentRoutes.map((route) => (
            <Link key={route.path} to={route.path} className="transition-colors hover:text-brand-600">
              {route.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-sand-300 py-5 text-sm">
          <span className="text-ink-400">Модели</span>
          {modelRoutes.map((route) => (
            <Link key={route.path} to={route.path} className="transition-colors hover:text-brand-600">
              {route.label}
            </Link>
          ))}
          <span className="ml-auto whitespace-nowrap text-ink-400">{contacts.workingHours}</span>
        </div>

        <dl className="flex flex-wrap gap-x-10 gap-y-3 border-b border-sand-300 py-5 text-sm">
          <LegalItem label="Наименование" value={contacts.legal.entity} />
          <LegalItem label="ИНН" value={contacts.legal.inn} />
          <LegalItem label="ОГРНИП" value={contacts.legal.ogrnip} />
        </dl>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-6 text-xs text-ink-400">
          <p className="max-w-xl">
            Информация на сайте не является публичной офертой согласно ст. 437 ГК РФ.
            © {new Date().getFullYear()} {contacts.companyName}
          </p>
          <div className="ml-auto flex flex-wrap gap-x-6 gap-y-2">
            {legalRoutes.map((route) => (
              <Link key={route.path} to={route.path} className="transition-colors hover:text-ink-700">
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/** Label and value joined by a leader line, as the reference footer sets them. */
function LegalItem({ label, value }: { label: string; value: string }) {
  if (!hasContact(value)) return null

  return (
    <div className="flex min-w-60 flex-1 items-baseline gap-3">
      <dt className="whitespace-nowrap text-ink-400">{label}</dt>
      <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-sand-300" />
      <dd className="whitespace-nowrap">{value}</dd>
    </div>
  )
}
