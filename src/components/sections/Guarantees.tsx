import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { contacts } from '../../data/contacts'

const documents = [
  {
    title: 'Сертификат стали',
    text: 'Документы на пищевую нержавейку AISI 304 и 430 для каждого чана.',
    icon: 'doc' as const,
  },
  {
    title: 'Гарантия 13 лет',
    text: 'Отвечаем за герметичность швов и качество изделия.',
    icon: 'shield' as const,
  },
  {
    title: 'Паспорт изделия',
    text: 'Индивидуальный паспорт и инструкция по уходу в комплекте.',
    icon: 'card' as const,
  },
]

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
        <div className="grid gap-6 lg:grid-cols-3">
          {documents.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="h-full rounded-panel bg-ink-800 p-7">
                <span className="text-brand-400">
                  <Icon name={item.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{item.text}</p>
              </div>
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
                  <span className="grid size-11 place-items-center rounded-card bg-brand-100 text-brand-600">
                    <Icon name={item.icon} />
                  </span>
                  <h3 className="mt-5 font-semibold">{item.title}</h3>
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
