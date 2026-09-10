import { Link } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { ButtonLink } from '../components/ui/Button'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { LeadForm } from '../components/forms/LeadForm'
import { useSeo } from '../lib/seo'
import {
  capacityLabel,
  formatHours,
  formatPriceRange,
  modelBySlug,
  models,
  type Model,
} from '../data/models'

const claims = [
  'Гарантия 13 лет',
  'Служит более 50 лет',
  'Под ключ за 8 дней',
  'Предоплата 10%',
]

/**
 * One template for every model, driven by the model's data object. Each model
 * owns a literal route, so the slug arrives as a prop rather than a URL param.
 */
export function ModelPage({ slug }: { slug: string }) {
  const model = modelBySlug(slug)

  if (!model) return <NotFoundPage />

  return <ModelDetail model={model} />
}

function ModelDetail({ model }: { model: Model }) {
  useSeo({
    title: model.seoTitle,
    description: model.seoDescription,
    path: `/${model.slug}`,
  })

  const others = models.filter((other) => other.slug !== model.slug)

  return (
    <>
      <section className="relative isolate flex min-h-[38rem] items-end overflow-hidden lg:min-h-[42rem]">
        <PlaceholderImage
          tone={model.theme}
          ratio="auto"
          className="absolute inset-0 -z-20 size-full"
          label={`${model.name} — крупный кадр изделия`}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900/35" />

        <div className="mx-auto w-full max-w-(--container-content) px-4 pt-32 pb-12 sm:px-6 lg:pt-40">
          <nav aria-label="Хлебные крошки" className="text-sm text-white/70">
            <Link to="/" className="transition-colors hover:text-white">
              Главная
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link to="/#catalog" className="transition-colors hover:text-white">
              Каталог
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-white">{model.name}</span>
          </nav>

          <h1 className="mt-6 text-white">
            <span className="block text-xl sm:text-2xl">{model.kind}</span>
            <span className="font-display mt-1 block text-[2.75rem] sm:text-[4rem] lg:text-[5rem]">
              {model.name}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {model.accent}. {model.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to="/#calculator" size="lg">
              Рассчитать стоимость
            </ButtonLink>
            <ButtonLink to="#request" variant="ghost" size="lg">
              Задать вопрос
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/75">
            {claims.map((claim) => (
              <li key={claim} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                {claim}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold text-navy-700">Характеристики</h2>

              <dl className="mt-6 divide-y divide-sand-200 border-y border-sand-200">
                <Spec label="Тип печи" value={model.stove} />
                <Spec label="Форма чаши" value={model.bowl} />
                <Spec label="Время нагрева" value={formatHours(model.heatingHours)} />
                <Spec
                  label="Размеры"
                  value={model.sizes.map((size) => `${capacityLabel(size)} человек`).join(' · ')}
                />
                <Spec label="Материал чаши" value="Пищевая нержавейка AISI 304 или 430 — на выбор" />
                <Spec label="Отделка" value="Стандарт · Стандарт плюс · Премиум · Люкс" />
              </dl>

              <h2 className="mt-14 text-2xl font-bold text-navy-700">Что входит в комплект</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {model.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-card bg-white p-4 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
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
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <PlaceholderImage
                  tone={model.theme}
                  ratio="4/3"
                  className="rounded-panel"
                  label={`${model.name} — вид изнутри чаши`}
                />
                <PlaceholderImage
                  tone="studio"
                  ratio="4/3"
                  className="rounded-panel"
                  label={`${model.name} — печь и дымоход`}
                />
              </div>
            </div>

            <aside id="request" className="scroll-mt-28 lg:sticky lg:top-28">
              <div className="rounded-panel bg-white p-6 shadow-sm shadow-ink-900/5">
                <p className="text-sm text-ink-500">Цена за комплект</p>
                <p className="mt-1 text-2xl font-bold">{formatPriceRange(model.price)}</p>
                <p className="mt-3 border-t border-sand-200 pt-3 text-sm leading-relaxed text-ink-500">
                  Итоговая стоимость зависит от размера, отделки и типа печи. Посчитаем под ваш
                  участок и пришлём в удобный канал.
                </p>

                <LeadForm
                  source="product"
                  fields={['name', 'phone', 'city']}
                  submitLabel="Узнать точную цену"
                  payload={{ Модель: model.name }}
                  className="mt-6"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <SectionHeading eyebrow="Другие модели" title="Сравните с остальными" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other, index) => (
              <Reveal key={other.slug} delay={index * 60}>
                <Link
                  to={`/${other.slug}`}
                  className="group block h-full overflow-hidden rounded-panel bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/10"
                >
                  <PlaceholderImage
                    tone={other.theme}
                    ratio="4/3"
                    label={other.name}
                    showLabel={false}
                  />
                  <span className="block p-4">
                    <span className="block font-semibold group-hover:text-brand-600">
                      {other.name}
                    </span>
                    <span className="mt-1 block text-sm text-ink-400">
                      Нагрев {formatHours(other.heatingHours)}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 py-4">
      <dt className="w-44 shrink-0 text-sm text-ink-400">{label}</dt>
      <dd className="flex-1 text-sm font-medium">{value}</dd>
    </div>
  )
}
