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
    <section className="relative isolate flex min-h-[42rem] items-center overflow-hidden lg:min-h-[46rem]">
      <PlaceholderImage
        tone="dusk"
        ratio="auto"
        silhouette={false}
        className="absolute inset-0 -z-20 size-full"
        label="чан на участке в вечернем свете"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900/45" />

      <div className="mx-auto w-full max-w-(--container-content) px-4 pt-32 pb-16 sm:px-6 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl text-white uppercase sm:text-5xl lg:text-[3.5rem]">
            Банный чан под ключ{' '}
            {/* The price is the punchline — it never breaks away from the dash. */}
            <span className="whitespace-nowrap">— от {formatPrice(priceFrom)}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            В собственном цеху полного цикла —{' '}
            <strong className="font-semibold text-brand-300">изготовим и доставим под ключ за 8 дней</strong>.
            Начинаем работу с предоплаты всего{' '}
            <strong className="font-semibold text-brand-300">10%</strong> — работаем по договору.
            Гарантия <strong className="font-semibold text-brand-300">13 лет</strong> на изделие
            · индивидуальная разработка под ваш участок.
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
            <ButtonLink to="/#contacts" variant="ghost" size="lg">
              Заказать звонок
            </ButtonLink>
          </div>
        </div>

        <dl className="mx-auto mt-14 grid max-w-md gap-px overflow-hidden rounded-panel bg-white/15 backdrop-blur sm:grid-cols-2">
          <Stat value="50" unit="лет" caption="Прослужит чан" />
          <Stat value="13" unit="лет" caption="Гарантия на изделие" />
        </dl>
      </div>
    </section>
  )
}

function Stat({ value, unit, caption }: { value: string; unit: string; caption: string }) {
  return (
    <div className="bg-ink-900/35 px-6 py-5">
      <dt className="sr-only">{caption}</dt>
      <dd>
        <span className="font-display text-4xl text-white">{value}</span>{' '}
        <span className="text-sm text-white/70">{unit}</span>
        <p className="mt-1 text-sm text-white/70">{caption}</p>
      </dd>
    </div>
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
