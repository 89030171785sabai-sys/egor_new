import { Quiz } from '../quiz/Quiz'
import { SectionHeading } from '../ui/SectionHeading'
import { contacts, hasContact } from '../../data/contacts'

const promises = [
  'Точную стоимость вашей комплектации',
  'Подборку готовых проектов',
  '2 подарка при заказе',
]

export function Calculator() {
  return (
    <section id="calculator" className="scroll-mt-28 bg-ink-900 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          align="center"
          tone="light"
          title="Соберите свой чан за 5 минут"
          subtitle="Ответьте на 8 коротких вопросов — менеджер рассчитает точную стоимость по вашей комплектации и пришлёт в удобный канал. При заказе — 2 подарка."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <Quiz />

          <aside className="rounded-panel bg-white p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-4">
              <span className="font-display grid size-12 shrink-0 place-items-center rounded-full bg-brand-500 text-lg text-white">
                ЖД
              </span>
              <div>
                <p className="font-semibold">{contacts.companyName}</p>
                <p className="text-sm text-ink-400">ваш персональный консультант</p>
              </div>
            </div>

            {hasContact(contacts.whatsapp) && (
              <a
                href={contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-full bg-ink-800 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-ink-900"
              >
                Задать вопрос
              </a>
            )}

            <div className="mt-6 border-t border-sand-200 pt-5">
              <p className="text-sm font-semibold">Отправим вам в мессенджер:</p>
              <ul className="mt-4 space-y-3">
                {promises.map((promise) => (
                  <li key={promise} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
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
                    {promise}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 border-t border-sand-200 pt-5 text-sm text-ink-400">
              {contacts.workingHours} ·{' '}
              <a href={contacts.phone.href} className="font-medium text-ink-700">
                {contacts.phone.display}
              </a>
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
