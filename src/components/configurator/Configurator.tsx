import { useMemo, useState } from 'react'
import {
  defaultModelSlug,
  defaultSelection,
  optionGroups,
  type ConfigGroup,
  type ConfigOption,
} from '../../data/configurator'
import {
  formatHours,
  formatPrice,
  modelBySlug,
  models,
  modelSizes,
  offerFor,
  sizeTier,
  steelGrades,
  type Model,
  type SizeCm,
} from '../../data/models'
import { LeadForm } from '../forms/LeadForm'
import { PhotoGallery } from '../ui/Lightbox'
import { ProductCardPhoto } from '../ui/ProductCardPhoto'
import { Slider } from '../ui/Slider'

type Selection = Record<string, string[]>

export function Configurator() {
  const [slug, setSlug] = useState(defaultModelSlug)
  const model = modelBySlug(slug) ?? models[0]!

  const sizes = modelSizes(model)
  const [cm, setCm] = useState<SizeCm>(sizes[0]!)
  // A model may not offer the size that was selected on the previous one.
  const size: SizeCm = sizes.includes(cm) ? cm : sizes[0]!

  const [selection, setSelection] = useState<Selection>(defaultSelection)
  const shots = modelShots(model)

  const chosen = useMemo(() => pickOptions(selection), [selection])
  const basePrice = offerFor(model, size)?.price
  const basePriceLabel = basePrice === undefined ? 'по запросу' : formatPrice(basePrice)

  const choose = (group: ConfigGroup, optionId: string) =>
    setSelection((current) => {
      if (group.kind === 'single') return { ...current, [group.id]: [optionId] }
      const list = current[group.id] ?? []
      return {
        ...current,
        [group.id]: list.includes(optionId)
          ? list.filter((id) => id !== optionId)
          : [...list, optionId],
      }
    })

  const leadPayload: Record<string, string> = {
    Модель: model.name,
    Размер: `${size} см — до ${sizeTier(size)?.people} человек`,
    Сталь: model.steel,
    'Время нагрева': formatHours(model.heatingHours),
    Комплектация: chosen.map((option) => option.note ? `${option.label} — ${option.note}` : option.label).join('; ') || 'базовая',
    'Расчёт на сайте': basePriceLabel,
    'Дополнительные опции': 'по запросу',
  }

  return (
    <div className="space-y-8">
      <Group label="Модель" hint={`Выбрано: «${model.name}». Модели отличаются печью, временем нагрева и маркой стали.`}>
        <Slider label="Выбор модели банного чана">
          {models.map((item) => (
            <ModelTile
              key={item.slug}
              model={item}
              active={item.slug === model.slug}
              onSelect={() => setSlug(item.slug)}
            />
          ))}
        </Slider>
      </Group>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-panel bg-white ring-1 ring-sand-200">
            <PhotoGallery
              single
              photos={shots}
              className="block"
              thumbFit="contain"
              thumbClassName="aspect-10/9 bg-white"
            />
          </div>

          <div className="mt-4 rounded-panel bg-ink-900 p-5 text-white sm:p-6">
            <p className="text-xs tracking-wider text-white/70 uppercase">Базовая цена чана</p>
            <p className="font-display mt-1.5 text-3xl sm:text-4xl" aria-live="polite">{basePriceLabel}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Дополнительные опции и доставку рассчитаем по запросу.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Group label="Размер чаши" hint="Диаметр и посадка. Доступные размеры зависят от модели.">
            <div className="flex flex-wrap gap-2">
              {sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCm(item)}
                  aria-pressed={item === size}
                  className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
                    item === size
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-sand-200 bg-white hover:border-ink-300'
                  }`}
                >
                  <span className="font-medium">{sizeTier(item)?.name} · {item} см</span>
                  <span className={item === size ? 'text-white/70' : 'text-ink-400'}>
                    {' '}
                    · до {sizeTier(item)?.people}
                  </span>
                </button>
              ))}
            </div>
          </Group>

          {optionGroups.map((group) => (
            <Group key={group.id} label={group.label} hint={group.hint}>
              <div className="grid gap-2.5">
                {group.options.map((option) => (
                  <OptionRow
                    key={option.id}
                    option={option}
                    kind={group.kind}
                    active={(selection[group.id] ?? []).includes(option.id)}
                    onSelect={() => choose(group, option.id)}
                  />
                ))}
              </div>
            </Group>
          ))}

          <div id="configurator-lead" tabIndex={-1} className="scroll-mt-28 rounded-panel bg-white p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-navy-700">Прислать точный расчёт</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Посчитаем выбранную комплектацию и доставку до вашего участка.
            </p>
            <LeadForm
              source="calculator"
              fields={['name', 'phone', 'city']}
              submitLabel="Получить расчёт"
              payload={leadPayload}
              className="mt-6"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function pickOptions(selection: Selection): ConfigOption[] {
  const result: ConfigOption[] = []
  for (const group of optionGroups) {
    for (const id of selection[group.id] ?? []) {
      const option = group.options.find((item) => item.id === id)
      if (option) result.push(option)
    }
  }
  return result
}

/** The photographs of a model, studio shot first, for the preview and its viewer. */
function modelShots(model: Model): Array<{ file: string; alt: string }> {
  const photos = model.photos
  const list: Array<{ file: string; alt: string }> = []
  if (photos?.card) list.push({ file: photos.card, alt: `Банный чан «${model.name}» в студии` })
  if (photos?.banner) list.push({ file: photos.banner, alt: `«${model.name}» на участке` })
  if (photos?.scene) list.push({ file: photos.scene, alt: `«${model.name}» во дворе дома` })
  if (photos?.extra) list.push({ file: photos.extra, alt: `«${model.name}»` })
  return list
}

function Group({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold tracking-wider text-ink-400 uppercase">{label}</h3>
      {hint && <p className="mt-1.5 text-sm text-ink-500">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ModelTile({
  model,
  active,
  onSelect,
}: {
  model: Model
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex w-80 shrink-0 snap-start flex-col overflow-hidden rounded-card border text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 sm:w-96 ${
        active ? 'border-brand-500 bg-brand-50' : 'border-sand-200 bg-white hover:border-ink-300'
      }`}
    >
      <span className="block w-full bg-white">
        <ProductCardPhoto model={model} />
      </span>
      <span className="block w-full p-4">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold">{model.name}</span>
          {model.badge && (
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[0.65rem] font-medium text-white">
              {model.badge}
            </span>
          )}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-ink-500">{model.accent}</span>
        <span className="mt-2 block text-xs text-ink-400">
          Нагрев {formatHours(model.heatingHours)} · {model.steel} ·{' '}
          {steelGrades[model.steel].life}
        </span>
      </span>
    </button>
  )
}

function OptionRow({
  option,
  kind,
  active,
  onSelect,
}: {
  option: ConfigOption
  kind: ConfigGroup['kind']
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex items-start gap-3 rounded-card border p-4 text-left transition-colors ${
        active ? 'border-brand-500 bg-brand-50' : 'border-sand-200 bg-white hover:border-ink-300'
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-5 shrink-0 place-items-center border transition-colors ${
          kind === 'multi' ? 'rounded-[0.375rem]' : 'rounded-full'
        } ${active ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300'}`}
      >
        {active && (
          <svg viewBox="0 0 12 12" className="size-2.5">
            <path
              d="m2 6.4 2.6 2.6L10 3.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{option.label}</span>
        {option.note && <span className="mt-0.5 block text-xs text-ink-400">{option.note}</span>}
      </span>

      <span className="shrink-0 whitespace-nowrap text-xs text-ink-600 sm:text-sm">по запросу</span>
    </button>
  )
}
