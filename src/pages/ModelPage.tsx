import { useParams } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { ButtonLink } from '../components/ui/Button'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { useSeo } from '../lib/seo'
import { formatHours, formatPriceRange, modelBySlug, type Model } from '../data/models'

const heroClaims = [
  'Гарантия 13 лет',
  'Нагрев с одной закладки дров',
  'Для круглогодичной эксплуатации',
  'Служит более 50 лет',
]

/** One template for every model, driven by the model's data object. */
export function ModelPage() {
  const { slug } = useParams<{ slug: string }>()
  const model = slug ? modelBySlug(slug) : undefined

  if (!model) return <NotFoundPage />

  return <ModelDetail model={model} />
}

function ModelDetail({ model }: { model: Model }) {
  useSeo({
    title: model.seoTitle,
    description: model.seoDescription,
    path: `/${model.slug}`,
  })

  return (
    <>
      <section className="relative isolate flex min-h-[40rem] items-center overflow-hidden lg:min-h-[44rem]">
        <PlaceholderImage
          tone={model.theme}
          ratio="auto"
          className="absolute inset-0 -z-20 size-full"
          label={`${model.name} — крупный кадр изделия`}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900/25" />

        <div className="mx-auto w-full max-w-(--container-content) px-4 pt-32 pb-14 sm:px-6 lg:pt-40">
          <p className="flex items-center gap-2 text-sm text-white/80">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
            Время нагрева — {formatHours(model.heatingHours)}
          </p>

          <h1 className="mt-5 text-white">
            <span className="block text-2xl sm:text-3xl">{model.kind}</span>
            <span className="font-display mt-1 block text-5xl uppercase sm:text-6xl lg:text-7xl">
              {model.name}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {model.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink to="/#calculator" size="lg">
              Рассчитать стоимость
            </ButtonLink>
            <ButtonLink to="/#contacts" variant="ghost" size="lg">
              Заказать звонок
            </ButtonLink>
          </div>

          <div className="mt-12 max-w-sm rounded-panel bg-white/95 p-5 backdrop-blur">
            <p className="text-sm text-ink-500">Цена за комплект</p>
            <p className="mt-1 text-2xl font-bold">{formatPriceRange(model.price)}</p>
            <p className="mt-3 border-t border-sand-200 pt-3 text-sm text-ink-500">
              Итоговая стоимость зависит от размера, отделки и типа печи — считаем под ваш участок.
            </p>
          </div>
        </div>

        <ul className="absolute inset-x-0 bottom-0 mx-auto hidden max-w-(--container-content) grid-cols-4 gap-4 px-6 pb-6 text-sm text-white/75 lg:grid">
          {heroClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
        </ul>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <SectionHeading eyebrow="Комплектация" title={`Что входит в ${model.name}`} />

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <ul className="space-y-4">
                {model.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-sand-200 pb-4 text-base last:border-0"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
                      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3">
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
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={90}>
              <PlaceholderImage
                tone={model.theme}
                ratio="4/3"
                className="rounded-panel"
                label={`${model.name} — вид изнутри чаши`}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
