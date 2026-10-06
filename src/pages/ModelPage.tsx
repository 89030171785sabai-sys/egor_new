import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { ButtonLink } from '../components/ui/Button'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { ModelShot } from '../components/ui/ModelShot'
import { StoveShot } from '../components/ui/StoveShot'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { LeadForm } from '../components/forms/LeadForm'
import { heatingForModel } from '../data/heating'
import { useSeo } from '../lib/seo'
import {
  modelPriceFrom,
  modelSizes,
  sizeTier,
  steelGrades,
  formatHours,
  formatPrice,
  formatPriceRange,
  modelBySlug,
  models,
  type Model,
} from '../data/models'

/**
 * Hero claims. The service life is the one that moves per model — AISI 430
 * and AISI 304 are not the same promise, so it is read off the model rather
 * than written into a shared list.
 */
const claimsFor = (model: Model) => [
  `Сталь служит ${steelGrades[model.steel].life}`,
  'Гарантия 13 лет',
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

/**
 * Behind the opening screen.
 *
 * A studio shot of a whole tub cannot be cropped to the shape of a hero
 * without losing its chimney and its base, so the photograph is contained and
 * set to the right, at a width that is its own — see `heroWidthVars`. A model
 * still waiting for its photograph keeps the full-bleed stand-in, which has
 * nothing to lose by being cropped.
 */
/**
 * Width of the hero shot, as CSS custom properties.
 *
 * The large-screen figure is per model and comes from the photograph itself
 * (see `ModelPhotos.heroWidth`); the small-screen one keeps the same ratios on
 * a wider base, capped so nothing runs past the edge.
 */
function heroWidthVars(model: Model): CSSProperties {
  const lg = model.photos?.heroWidth ?? 0.64
  const sm = Math.min(lg * 1.25, 1)
  // The glow reaches past the picture on both sides, so the fade at its edges
  // runs out over colour rather than stopping on it.
  const glowLg = Math.min(lg * 1.35, 1)
  const glowSm = Math.min(sm * 1.2, 1)
  return {
    '--hero-lg': `${(lg * 100).toFixed(1)}%`,
    '--hero-sm': `${(sm * 100).toFixed(1)}%`,
    '--hero-glow-lg': `${(glowLg * 100).toFixed(1)}%`,
    '--hero-glow-sm': `${(glowSm * 100).toFixed(1)}%`,
    '--hero-tone': model.photos?.heroTone ?? '#1a1c20',
  } as CSSProperties
}

function HeroBackdrop({ model }: { model: Model }) {
  if (!model.photos?.hero) {
    return (
      <>
        <ModelShot model={model} slot="hero" fill className="-z-20" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/85 via-ink-900/55 to-ink-900/25"
        />
      </>
    )
  }

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 -z-[40] bg-ink-900" />

      {/*
        The shot's own backdrop tone, laid behind it as a soft glow. Without it
        the picture's top edge ends on flat black — the line the client saw —
        and fading that edge out instead turned the chimney black. Against a
        glow of the same colour the fade has nothing to show.
      */}
      <div
        aria-hidden="true"
        style={heroWidthVars(model)}
        className="absolute inset-y-0 right-0 -z-30 w-(--hero-glow-sm) [background:radial-gradient(75%_70%_at_58%_52%,var(--hero-tone),transparent_72%)] lg:w-(--hero-glow-lg)"
      />

      {/*
        The box is the photograph: its width is the model's own, its height
        follows. Containing it in a full-height box instead would leave the
        picture's real edges inside the box, where the mask no longer reaches
        them — and a hard rectangle is exactly what this is here to avoid.
        A shot taller than the hero loses only its faded top, over the glow.
      */}
      <div
        style={heroWidthVars(model)}
        className="pointer-events-none absolute right-0 bottom-0 -z-20 hidden w-(--hero-sm) [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_22%),linear-gradient(to_bottom,transparent,black_26%)] lg:block lg:w-(--hero-lg)"
      >
        <ModelShot model={model} slot="hero" contain className="w-full" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900 via-ink-900/70 to-transparent"
      />
    </>
  )
}

/**
 * The facts a buyer scans for before reading anything — sizes, steel, stove
 * and the entry price. Kept in the text column rather than floated over the
 * shot: wherever it floated, it covered the product at some screen width.
 */
function HeroSpecCard({ model }: { model: Model }) {
  return (
    <aside className="relative mt-10 w-full max-w-md overflow-hidden rounded-panel border border-white/20 bg-ink-900/40 p-5 text-white shadow-2xl shadow-ink-900/60 backdrop-blur-2xl backdrop-saturate-150">
      {/* The two things that make glass read as glass: a lit top edge and a
          soft specular bloom in one corner. Both are decorative only. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-14 -left-10 size-36 rounded-full bg-white/20 blur-2xl"
      />

      <div className="relative">
        <p className="text-xs tracking-wider text-white/55 uppercase">Размеры чаши</p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {modelSizes(model).map((size) => (
            <li
              key={size}
              className="rounded-full border border-white/10 bg-white/12 px-2.5 py-1 text-xs text-white/85"
            >
              {size} см · до {sizeTier(size)?.people}
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid gap-2.5 border-t border-white/15 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-white/55">Сталь</dt>
            <dd className="font-medium">
              {model.steel} · {steelGrades[model.steel].life}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-white/55">Печь</dt>
            <dd className="leading-snug font-medium">{model.stove}</dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-white/15 pt-4">
          <span className="text-xs text-white/55">Цена от</span>
          <span className="mt-0.5 block text-xl font-bold">
            {formatPrice(modelPriceFrom(model))}
          </span>
        </p>
      </div>
    </aside>
  )
}

/**
 * How this model's water gets hot.
 *
 * The line used to explain its six stove layouts in a section of its own on
 * the home page. The explanation belongs with the model it describes, so it
 * lives here now — with the stove's own close-up where one has been shot.
 */
function HowItHeats({ model }: { model: Model }) {
  const heating = heatingForModel(model.slug)
  if (!heating) return null

  return (
    <section className="group mt-14">
      <h2 className="text-2xl font-bold text-navy-700">Как греется вода</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] sm:items-center">
        <div>
          <p className="text-lg font-semibold text-navy-700">{heating.title}</p>
          <p className="mt-3 leading-relaxed text-ink-500">{heating.text}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-400">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
            Нагрев {formatHours(model.heatingHours)} · {model.stove}
          </p>
        </div>

        {heating.photo ? (
          <StoveShot photo={heating.photo} title={`${heating.title} — ${model.name}`} />
        ) : (
          <PlaceholderImage
            tone="studio"
            ratio="4/3"
            className="rounded-panel"
            label={`${heating.title} — крупный план печи`}
          />
        )}
      </div>
    </section>
  )
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
        <HeroBackdrop model={model} />

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

          <p className="mt-6 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-white/85">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
              Время нагрева всего {formatHours(model.heatingHours)}
            </span>
            {model.badge && (
              <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                {model.badge}
              </span>
            )}
          </p>

          <h1 className="mt-4 max-w-xl text-white lg:max-w-2xl">
            <span className="block text-xl sm:text-2xl">{model.kind}</span>
            <span className="font-display mt-1 block text-[2.75rem] sm:text-[4rem] lg:text-[5rem]">
              {model.name}
            </span>
          </h1>

          {/*
            On a phone the shot sits in the flow, under the name: behind the
            copy it would be lost under the wash that keeps the headline
            readable across the full width.
          */}
          {model.photos?.hero && (
            <ModelShot
              model={model}
              slot="hero"
              contain
              className="mt-6 w-full lg:hidden"
            />
          )}

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {model.accent}. {model.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to="/calculator" size="lg">
              Рассчитать стоимость
            </ButtonLink>
            <ButtonLink to="#request" variant="ghost" size="lg">
              Задать вопрос
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/75">
            {claimsFor(model).map((claim) => (
              <li key={claim} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                {claim}
              </li>
            ))}
          </ul>

          <HeroSpecCard model={model} />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold text-navy-700">Характеристики</h2>

              <dl className="mt-6 divide-y divide-sand-200 border-y border-sand-200">
                <Spec label="Тип печи" value={model.stove} />
                <Spec label="Форма чаши" value={model.bowlShape === 'rolled' ? 'Вальцованная' : 'Гранёная'} />
                <Spec label="Время нагрева" value={formatHours(model.heatingHours)} />
                <Spec
                  label="Размеры"
                  value={modelSizes(model)
                    .map((size) => `${size} см — до ${sizeTier(size)?.people} человек`)
                    .join(' · ')}
                />
                <Spec label="Материал чаши" value={steelGrades[model.steel].title} />
                <Spec label="Срок службы стали" value={steelGrades[model.steel].life} />
                <Spec label="Отделка" value="Лиственница, спинки под углом 67°" />
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

              <HowItHeats model={model} />

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
                  label={`${model.name} — дымоход и защитный экран`}
                />
              </div>
            </div>

            <aside id="request" className="scroll-mt-28 lg:sticky lg:top-28">
              <div className="rounded-panel bg-white p-6 shadow-sm shadow-ink-900/5">
                <p className="text-sm text-ink-500">Цена за комплект</p>
                <p className="mt-1 text-2xl font-bold">{formatPriceRange(model)}</p>
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
