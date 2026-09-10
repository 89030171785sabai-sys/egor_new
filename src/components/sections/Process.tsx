import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const steps = [
  { title: 'Заявка', text: 'Оставляете заявку — отвечаем в удобном мессенджере.' },
  { title: 'Консультация', text: 'Подбираем модель, размер и комплектацию.' },
  { title: 'Предоплата 10%', text: 'Запускаем чан в производство, фиксируем сроки.' },
  { title: 'Доставка', text: 'Привозим по всей РФ. Поможем найти грузчиков для разгрузки.' },
]

export function Process() {
  return (
    <section className="bg-sand-200 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading eyebrow="Как мы работаем" title="4 шага до вашего чана" />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <li className="h-full rounded-panel bg-white p-6">
                <span className="font-display grid size-11 place-items-center rounded-full bg-brand-500 text-lg text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-navy-700">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
