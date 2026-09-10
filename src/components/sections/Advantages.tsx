import { Reveal } from '../ui/Reveal'

const advantages = [
  {
    title: 'Качество стали',
    text: 'Пищевая нержавейка AISI 304 и 430 — служит более 50 лет',
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
