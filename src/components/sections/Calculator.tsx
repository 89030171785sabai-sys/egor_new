import { ButtonLink } from '../ui/Button'

const steps = [
  'Модель и размер чаши',
  'Отделка, лестница, дымоход, крышка и опции',
  'Цена пересчитывается сразу, расчёт пришлём в удобный канал',
]

/**
 * A pointer to the calculator, not a second copy of it: the configurator lives
 * on its own page, and the home page invites the visitor there.
 */
export function Calculator() {
  return (
    <section className="bg-ink-900 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl text-balance text-white sm:text-5xl">
          Рассчитайте свой банный чан в калькуляторе
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
          Соберите чан под себя и сразу увидите стоимость. Чан на экране перестраивается на
          каждом шаге.
        </p>

        <ul className="mx-auto mt-8 inline-flex flex-col items-start space-y-3 text-left">
          {steps.map((step) => (
            <li key={step} className="flex items-start gap-3 text-white/90">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                <svg viewBox="0 0 12 12" aria-hidden="true" className="size-2.5">
                  <path
                    d="m2 6.4 2.6 2.6L10 3.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {step}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ButtonLink to="/calculator" size="lg" arrow>
            Открыть калькулятор
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
