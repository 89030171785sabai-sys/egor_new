import { Reveal } from '../ui/Reveal'

/** The figures that used to float over the first screen. */
const figures = [
  { value: '45–50', unit: 'лет', caption: 'Служит сталь AISI 304' },
  { value: '13', unit: 'лет', caption: 'Гарантия на изделие' },
  { value: '8', unit: 'дней', caption: 'Под ключ — от заказа до участка' },
  { value: '10', unit: '%', caption: 'Предоплата, остальное — потом' },
]

const advantages = [
  {
    title: 'Качество стали',
    text: 'Нержавейка AISI 430 служит 20–25 лет, пищевая AISI 304 — 45–50 лет',
    icon: 'shield' as const,
  },
  {
    title: 'Доставка по России',
    text: 'В любую точку страны — под ключ за 8 дней',
    icon: 'truck' as const,
  },
  {
    title: 'Пожизненная консультация',
    text: 'Подскажем по монтажу и уходу',
    icon: 'chat' as const,
  },
]

export function Advantages() {
  return (
    <section className="bg-ink-800">
      <div className="mx-auto max-w-(--container-content) px-4 pt-10 sm:px-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-white/12 pb-9 lg:grid-cols-4">
          {figures.map((figure, index) => (
            <Reveal key={figure.caption} delay={index * 70}>
              <dt className="sr-only">{figure.caption}</dt>
              <dd>
                <span className="font-display text-4xl text-white">{figure.value}</span>{' '}
                <span className="text-sm text-ink-300">{figure.unit}</span>
                <p className="mt-1 text-sm text-ink-300">{figure.caption}</p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-(--container-content) gap-px px-4 sm:px-6 lg:grid-cols-3">
        {advantages.map((advantage, index) => (
          <Reveal
            key={advantage.title}
            delay={index * 90}
            className="relative py-9 lg:px-8 lg:first:pl-0 lg:last:pr-0"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-9 bottom-9 -left-px hidden w-px bg-white/12 lg:block"
              />
            )}
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-white">
              <Icon name={advantage.icon} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">{advantage.title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-300">{advantage.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Icon({ name }: { name: 'shield' | 'truck' | 'chat' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      {name === 'shield' && (
        <>
          <path d="M12 3l7 3v5.5c0 4.4-2.9 8.3-7 9.5-4.1-1.2-7-5.1-7-9.5V6l7-3Z" {...common} />
          <path d="m9 12 2.2 2.2L15.5 10" {...common} />
        </>
      )}
      {name === 'truck' && (
        <>
          <path d="M3 7h10v9H3zM13 10h4l3 3.2V16h-7z" {...common} />
          <circle cx="7" cy="18" r="1.8" {...common} />
          <circle cx="17" cy="18" r="1.8" {...common} />
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
