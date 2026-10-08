import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { contacts } from '../../data/contacts'
import { certificates, docUrl } from '../../data/certificates'
import { photoUrl } from '../../lib/photos'

const deal = [
  {
    title: 'Договор',
    text: 'Фиксируем цену, комплектацию и срок в договоре — без сюрпризов.',
    icon: 'doc' as const,
  },
  {
    title: 'Оплата по счёту',
    text: `${contacts.legal.entity}, ИНН ${contacts.legal.inn}. Наличными или безналично.`,
    icon: 'card' as const,
  },
  {
    title: 'Предоплата всего 10%',
    text: 'Начинаем работу с 10%. Остаток — после готовности или при получении.',
    icon: 'shield' as const,
  },
  {
    title: 'Документы в комплекте',
    text: 'Паспорт изделия и гарантия 13 лет на каждый чан.',
    icon: 'doc' as const,
  },
]

export function Guarantees() {
  return (
    <section id="guarantees" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Документы"
          title="Продукция сертифицирована"
          subtitle="Три действующих сертификата на серийный выпуск. Каждый открывается целиком — номер можно проверить в реестре."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {certificates.map((item, index) => (
            <Reveal key={item.number} delay={index * 80}>
              <a
                href={docUrl(item.file)}
                target="_blank"
                rel="noopener"
                className="group flex h-full flex-col rounded-panel bg-ink-800 p-7 transition-colors hover:bg-ink-700"
              >
                {/*
                  * The scan itself, rather than an icon standing in for it —
                  * the seal and the signatures are what someone is checking
                  * for. It leans in a little under the pointer, so the card
                  * reads as a document that opens.
                  */}
                <span className="block overflow-hidden rounded-card bg-white/5 p-3">
                  <img
                    src={photoUrl(item.preview)}
                    alt={`${item.title} — первая страница`}
                    loading="lazy"
                    className="w-full rounded-sm shadow-lg shadow-ink-900/40 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-xs tracking-wider text-ink-400 uppercase">{item.system}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{item.summary}</p>
                <p className="mt-4 text-xs break-all text-ink-400">{item.number}</p>
                <p className="mt-auto pt-5 text-sm font-medium text-white">
                  <span className="group-hover:underline">Открыть PDF</span>
                  <span className="ml-2 text-ink-400">действует до {item.validUntil}</span>
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Безопасная сделка"
            title={
              <>
                Работаем официально —<br />
                по договору
              </>
            }
            subtitle="Вы защищены на каждом этапе: фиксируем цену и срок, а платите частями."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deal.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="h-full rounded-panel bg-white p-6">
                  <span className="grid size-11 place-items-center rounded-card bg-sand-200 text-navy-700">
                    <Icon name={item.icon} />
                  </span>
                  <h3 className="mt-5 font-semibold text-navy-700">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Icon({ name }: { name: 'doc' | 'shield' | 'card' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
      {name === 'doc' && (
        <>
          <path d="M6 3h8l4 4v14H6z" {...common} />
          <path d="M14 3v4h4M9 12h6M9 16h6" {...common} />
        </>
      )}
      {name === 'shield' && (
        <>
          <path d="M12 3l7 3v5.5c0 4.4-2.9 8.3-7 9.5-4.1-1.2-7-5.1-7-9.5V6l7-3Z" {...common} />
          <path d="m9 12 2.2 2.2L15.5 10" {...common} />
        </>
      )}
      {name === 'card' && (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2" {...common} />
          <path d="M3 10h18M7 14h4" {...common} />
        </>
      )}
    </svg>
  )
}
