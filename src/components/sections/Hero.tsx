import { ButtonLink } from '../ui/Button'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { formatPrice, priceFrom } from '../../data/models'

const promises = [
  'Служит более 50 лет',
  'Доставка по всей РФ',
  '2 подарка при заказе',
  'Расчёт за 5 минут в Telegram',
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[44rem] items-center overflow-hidden lg:min-h-[48rem]">
      <PlaceholderImage
        tone="dusk"
        ratio="auto"
        silhouette={false}
        className="absolute inset-0 -z-20 size-full"
        label="чан на участке в вечернем свете"
        showLabel={false}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900/45" />

      <div className="mx-auto w-full max-w-(--container-content) px-4 pt-32 pb-16 sm:px-6 lg:pt-40 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[2.5rem] text-white sm:text-[3.25rem] lg:text-[4.25rem]">
            Банный чан под ключ{' '}
            {/* The price is the punchline — it never breaks away from the dash. */}
            <span className="whitespace-nowrap">— от {formatPrice(priceFrom)}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            В собственном цеху полного цикла —{' '}
            <strong className="font-semibold text-brand-300">изготовим и доставим под ключ за 8 дней</strong>.
            Начинаем работу с предоплаты всего{' '}
            <strong className="font-semibold text-brand-300">10%</strong> — работаем по договору.
          </p>

          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {promises.map((promise) => (
              <li
                key={promise}
                className="flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm text-white/90 backdrop-blur"
              >
                <CheckIcon />
                {promise}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/#calculator" size="lg">
              Рассчитать стоимость за 5 минут
            </ButtonLink>
            <ButtonLink to="/contacts" variant="ghost" size="lg">
              Заказать звонок
            </ButtonLink>
          </div>
        </div>

        {/*
         * Two cards float at the edges of the shot on wide screens, the way the
         * reference frames its hero, and fall back to a row underneath when
         * there is no room beside the headline.
         */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:block">
          <aside className="rounded-panel bg-white/12 p-5 backdrop-blur lg:absolute lg:top-1/2 lg:left-6 lg:w-64 lg:-translate-y-1/2 xl:left-12">
            <OctagonMark />
            <dl className="mt-4 space-y-4">
              <Figure value="50" unit="лет" caption="Прослужит чан" tone="light" />
              <Figure value="13" unit="лет" caption="Гарантия на изделие" tone="light" />
            </dl>
          </aside>

          <aside className="rounded-panel bg-white p-5 lg:absolute lg:top-1/2 lg:right-6 lg:w-64 lg:-translate-y-1/2 xl:right-12">
            <dl className="space-y-4">
              <Figure value="8" unit="дней" caption="Под ключ — от заказа до участка" tone="dark" />
              <Figure value="10" unit="%" caption="Предоплата, остальное — потом" tone="dark" />
            </dl>
            <p className="mt-4 rounded-full bg-brand-50 px-3 py-1.5 text-center text-xs font-medium text-brand-700">
              Работаем по договору
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Figure({
  value,
  unit,
  caption,
  tone,
}: {
  value: string
  unit: string
  caption: string
  tone: 'light' | 'dark'
}) {
  const valueColor = tone === 'light' ? 'text-white' : 'text-ink-900'
  const captionColor = tone === 'light' ? 'text-white/70' : 'text-ink-400'

  return (
    <div>
      <dt className="sr-only">{caption}</dt>
      <dd>
        <span className={`font-display text-4xl ${valueColor}`}>{value}</span>{' '}
        <span className={`text-sm ${captionColor}`}>{unit}</span>
        <p className={`mt-1 text-sm ${captionColor}`}>{caption}</p>
      </dd>
    </div>
  )
}

/** Outline of the bowl seen from above — the shape the whole product line shares. */
function OctagonMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="size-14 text-white/45">
      <path
        d="M20 6h24l14 14v24L44 58H20L6 44V20L20 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M24 16h16l8 8v16l-8 8H24l-8-8V24l8-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M32 6v58M6 32h52M11 11l42 42M53 11 11 53" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 text-brand-300">
      <path
        d="m2 6.4 2.6 2.6L10 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
