import { ButtonLink } from '../ui/Button'
import { photoUrl } from '../../lib/photos'
import { formatPrice, priceFrom } from '../../data/models'

const promises = [
  'Ответим за 1 минуту',
  'Подберём модель за 30 минут',
  'Рассчитаем стоимость за 5 минут',
  'Доставим прямо на участок',
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
          <h1 className="font-display text-balance text-[2.25rem] text-white sm:text-[2.75rem] lg:text-[3rem]">
            Банные чаны от производителя с гарантией <span className="whitespace-nowrap">13 лет</span> и доставкой <span className="whitespace-nowrap">по всей России</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
            <span className="whitespace-nowrap">От {formatPrice(priceFrom)}</span> ·{' '}
            <span className="whitespace-nowrap">от 8 дней</span> ·{' '}
            <span className="whitespace-nowrap">гарантия 13 лет</span>
          </p>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
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
      </div>
    </section>
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
