import { ButtonLink } from '../ui/Button'
import { photoUrl } from '../../lib/photos'
import { formatPrice, priceFrom } from '../../data/models'

const promises = [
  'Сталь служит до 50 лет',
  'Доставка по всей РФ',
  '2 подарка при заказе',
  'Расчёт за 5 минут в Telegram',
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[44rem] items-center overflow-hidden bg-ink-900 lg:min-h-[48rem]">
      {/*
       * A wide shot behind a column of copy: on a wide screen it fills the
       * block, but a phone is taller than the hero's content and far narrower
       * than the frame, so covering the whole block would crop away everything
       * but a strip through the middle — the tub included. There it runs as a
       * band across the top instead, deep enough to carry the headline, and
       * fades into the section's own dark below it.
       */}
      <img
        src={photoUrl('hero-home.webp')}
        alt="Банный чан на террасе у реки в вечернем свете"
        // The first thing on the page, so it is fetched ahead of everything else.
        loading="eager"
        fetchPriority="high"
        className="absolute inset-x-0 top-0 -z-20 h-[30rem] w-full object-cover lg:inset-0 lg:h-full"
      />
      {/*
       * The shot is bright where the sun sits, so a flat wash is not enough to
       * carry white type across it: the veil is heaviest top and bottom, where
       * the headline and the buttons fall, and thinnest across the middle,
       * where the water and the terrace are worth seeing.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-gradient-to-b from-ink-900/65 via-ink-900/20 via-60% to-ink-900 lg:inset-0 lg:h-full lg:from-ink-900/75 lg:via-ink-900/45 lg:via-50% lg:to-ink-900/75"
      />

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
            <ButtonLink to="/calculator" size="lg">
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
              <Figure value="45–50" unit="лет" caption="Служит сталь AISI 304" tone="light" />
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
