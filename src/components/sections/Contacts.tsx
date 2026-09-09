import { SectionHeading } from '../ui/SectionHeading'
import { LeadForm } from '../forms/LeadForm'
import { contacts, hasContact } from '../../data/contacts'

const mapsUrl = (query: string) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`

export function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading eyebrow="Контакты" title="Мы на связи" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
          <dl className="space-y-6">
            {contacts.addresses.map((address) => (
              <Row key={address.street} icon="pin" caption={address.role}>
                {address.city}, {address.street}
              </Row>
            ))}

            <Row icon="phone" caption="звонок и WhatsApp">
              <a href={contacts.phone.href} className="transition-colors hover:text-brand-600">
                {contacts.phone.display}
              </a>
            </Row>

            <Row icon="mail" caption="почта">
              <a
                href={`mailto:${contacts.email}`}
                className="transition-colors hover:text-brand-600"
              >
                {contacts.email}
              </a>
            </Row>

            <Row icon="clock" caption="часы работы">
              {contacts.workingHours}
            </Row>

            <Row icon="chat" caption="">
              <span className="block">Мы в мессенджерах</span>
              <span className="mt-3 flex flex-wrap gap-3">
                {hasContact(contacts.whatsapp) && (
                  <a
                    href={contacts.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-ink-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-900"
                  >
                    WhatsApp
                  </a>
                )}
                {hasContact(contacts.telegram) && (
                  <a
                    href={contacts.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-ink-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-900"
                  >
                    Telegram
                  </a>
                )}
                {hasContact(contacts.vk) && (
                  <a
                    href={contacts.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-ink-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-900"
                  >
                    VK
                  </a>
                )}
              </span>
            </Row>
          </dl>

          <div className="rounded-panel bg-white p-6 shadow-sm shadow-ink-900/5 sm:p-7">
            <h3 className="text-xl font-bold">Остались вопросы?</h3>
            <p className="mt-2 text-sm text-ink-500">
              Оставьте заявку — свяжемся в ближайшее время.
            </p>
            <LeadForm
              source="contacts"
              fields={['channel']}
              submitLabel="Отправить"
              className="mt-5"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {contacts.addresses.map((address) => (
            <a
              key={address.street}
              href={mapsUrl(`${address.city}, ${address.street}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-panel bg-white p-5 shadow-sm shadow-ink-900/5 transition-shadow hover:shadow-md"
            >
              <span>
                <span className="block font-medium">
                  {address.city} · {address.street}
                </span>
                <span className="mt-1 block text-sm text-ink-400">{address.role}</span>
              </span>
              <span className="shrink-0 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                Открыть в Яндекс Картах →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Row({
  icon,
  caption,
  children,
}: {
  icon: 'pin' | 'phone' | 'mail' | 'clock' | 'chat'
  caption: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-card bg-brand-100 text-brand-600">
        <Icon name={icon} />
      </span>
      <div>
        <dt className="text-base font-semibold">{children}</dt>
        {caption && <dd className="mt-0.5 text-sm text-ink-400">{caption}</dd>}
      </div>
    </div>
  )
}

function Icon({ name }: { name: 'pin' | 'phone' | 'mail' | 'clock' | 'chat' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      {name === 'pin' && (
        <>
          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" {...common} />
          <circle cx="12" cy="10" r="2.5" {...common} />
        </>
      )}
      {name === 'phone' && (
        <path
          d="M7 3.5 9.5 8 7.5 10a12 12 0 0 0 6.5 6.5L16 14.5l4.5 2.5v3A1.5 1.5 0 0 1 19 21.5C10.4 21 3 13.6 2.5 5A1.5 1.5 0 0 1 4 3.5h3Z"
          {...common}
        />
      )}
      {name === 'mail' && (
        <>
          <rect x="3" y="5.5" width="18" height="13" rx="2" {...common} />
          <path d="m4 7 8 6 8-6" {...common} />
        </>
      )}
      {name === 'clock' && (
        <>
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path d="M12 7.5V12l3 2" {...common} />
        </>
      )}
      {name === 'chat' && (
        <>
          <path d="M4 5h16v10H9l-5 4V5Z" {...common} />
          <path d="M8 10h8M8 7.5h5" {...common} />
        </>
      )}
    </svg>
  )
}
