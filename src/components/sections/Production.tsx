import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const stages = [
  {
    title: 'Заготовка сырья',
    text: 'Заготавливаем сырьё, тщательно отбирая лес на этапе сортировки. В строительстве используем лиственницу. Древесина соответствует ГОСТу.',
    icon: 'tree' as const,
  },
  {
    title: 'Подготовка сырья',
    text: 'Перед производством обязательный этап обработки древесины — сушка. Древесина сушится в специальной сушильной камере от 7 до 10 дней.',
    icon: 'sun' as const,
  },
  {
    title: 'Закупка металла',
    text: 'Закупаем качественную техническую нержавеющую сталь AISI 304 и 430, которая позволяет нашим чанам служить более 50 лет.',
    icon: 'layers' as const,
  },
  {
    title: 'Современное оборудование',
    text: 'На своём производстве используем новейшее оборудование, которое позволяет с высокой точностью обрабатывать древесину и металл.',
    icon: 'gear' as const,
  },
  {
    title: 'Опытный коллектив',
    text: 'Большинство сотрудников работает на производстве более 3 лет, некоторые связаны с обработкой древесины и сваркой более 15 лет.',
    icon: 'people' as const,
  },
  {
    title: 'Запасы материалов',
    text: 'Чтобы стабильно работать и выполнять обязательства точно в срок, на складе всегда большой запас материала и комплектующих.',
    icon: 'box' as const,
  },
]

export function Production() {
  return (
    <section id="production" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Производство"
          title="Собственный цех полного цикла"
          subtitle="От заготовки древесины до финальной сборки."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <Reveal key={stage.title} delay={(index % 3) * 80}>
              <div className="h-full rounded-panel bg-sand-50 p-6 ring-1 ring-sand-200">
                <span className="grid size-11 place-items-center rounded-card bg-sand-200 text-navy-700">
                  <Icon name={stage.icon} />
                </span>
                <h3 className="mt-5 font-semibold text-navy-700">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{stage.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Icon({ name }: { name: 'tree' | 'sun' | 'layers' | 'gear' | 'people' | 'box' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      {name === 'tree' && <path d="M12 3 7 10h3l-3 5h4v6h2v-6h4l-3-5h3L12 3Z" {...common} />}
      {name === 'sun' && (
        <>
          <circle cx="12" cy="12" r="4" {...common} />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" {...common} />
        </>
      )}
      {name === 'layers' && (
        <>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" {...common} />
          <path d="m4 13 8 4 8-4" {...common} />
        </>
      )}
      {name === 'gear' && (
        <>
          <circle cx="12" cy="12" r="3" {...common} />
          <path d="M12 3v3M12 18v3M4.5 7.5l2.5 1.5M17 15l2.5 1.5M19.5 7.5 17 9M7 15l-2.5 1.5" {...common} />
        </>
      )}
      {name === 'people' && (
        <>
          <circle cx="9" cy="8" r="3" {...common} />
          <path d="M3.5 19c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" {...common} />
          <path d="M16 6.5a3 3 0 0 1 0 6M17 14c2 .8 3.5 2.7 3.5 5" {...common} />
        </>
      )}
      {name === 'box' && (
        <>
          <path d="M4 8l8-4 8 4v8l-8 4-8-4V8Z" {...common} />
          <path d="M4 8l8 4 8-4M12 12v8" {...common} />
        </>
      )}
    </svg>
  )
}
