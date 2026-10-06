import { Suspense, lazy, useMemo, useState } from 'react'
import {
  basePrice,
  defaultModelSlug,
  defaultSelection,
  diameterOf,
  modelVisual,
  optionGroups,
  type ConfigGroup,
  type ConfigOption,
  type TubVisual,
} from '../../data/configurator'
import {
  formatHours,
  formatPrice,
  isPromo,
  modelBySlug,
  models,
  modelSizes,
  offerFor,
  promo,
  sizeTier,
  steelGrades,
  type Model,
  type SizeCm,
} from '../../data/models'
import { LeadForm } from '../forms/LeadForm'
import type { CameraView } from './TubScene'

// The 3D viewport carries the whole of three.js, so it loads only once the
// configurator itself is on screen.
const TubScene = lazy(() => import('./TubScene'))

type Selection = Record<string, string[]>

export function Configurator() {
  const [slug, setSlug] = useState(defaultModelSlug)
  const model = modelBySlug(slug) ?? models[0]!

  const sizes = modelSizes(model)
  const [cm, setCm] = useState<SizeCm>(sizes[0]!)
  // A model may not offer the size that was selected on the previous one.
  const size: SizeCm = sizes.includes(cm) ? cm : sizes[0]!

  const [selection, setSelection] = useState<Selection>(defaultSelection)
  const [view, setView] = useState<CameraView>('outside')

  const chosen = useMemo(() => pickOptions(selection), [selection])

  const visual = useMemo<TubVisual>(() => {
    const base: TubVisual = {
      ...modelVisual(model),
      diameter: diameterOf(size),
      cladding: 'none',
      ladder: 'metal',
      chimney: 'steel',
      lid: false,
      light: false,
      table: false,
      hydro: false,
    }
    for (const option of chosen) Object.assign(base, option.visual ?? {})
    return base
  }, [model, size, chosen])

  const offer = offerFor(model, size)
  const base = basePrice(model, size)
  const promoHere = isPromo(model, size)
  const surcharge = chosen.reduce((sum, option) => sum + (option.price ?? 0), 0)
  const pending = chosen.filter((option) => option.price === null)
  const total = base === null ? null : base + surcharge

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
    Комплектация: chosen.map((option) => option.label).join('; ') || 'базовая',
    'Расчёт на сайте': total === null ? 'по запросу' : formatPrice(total),
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <div className="relative overflow-hidden rounded-panel bg-gradient-to-b from-[#2a2d33] to-[#101114]">
          <div className="aspect-4/3 w-full sm:aspect-16/11">
            <Suspense fallback={<SceneFallback />}>
              <TubScene visual={visual} view={view} />
            </Suspense>
          </div>

          <div className="absolute top-4 left-4 flex rounded-full bg-black/40 p-1 backdrop-blur">
            {(['outside', 'inside'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                aria-pressed={view === item}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  view === item ? 'bg-white text-ink-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {item === 'outside' ? 'Снаружи' : 'Внутри'}
              </button>
            ))}
          </div>

          <p className="absolute right-4 bottom-4 left-4 text-center text-xs text-white/50">
            Схематичная 3D-модель: показывает комплектацию, а не фотографию изделия. Покрутите
            мышью или пальцем.
          </p>
        </div>

        <PriceBar
          total={total}
          base={base}
          was={promoHere ? offer?.price : undefined}
          pending={pending.length}
          promo={promoHere}
        />
      </div>

      <div className="space-y-8">
        <Group label="Модель" hint="Отличаются печью, временем нагрева и маркой стали.">
          <div className="grid gap-3 sm:grid-cols-2">
            {models.map((item) => (
              <ModelTile
                key={item.slug}
                model={item}
                active={item.slug === model.slug}
                onSelect={() => setSlug(item.slug)}
              />
            ))}
          </div>
        </Group>

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
                <span className="font-medium">{item} см</span>
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

        <div id="configurator-lead" className="scroll-mt-28 rounded-panel bg-white p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-navy-700">Прислать точный расчёт</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Соберём смету по выбранной комплектации, добавим доставку до вашего участка и пришлём
            в удобный канал. Опции, у которых сейчас стоит «по запросу», посчитаем по актуальному
            прайсу.
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

function SceneFallback() {
  return (
    <div className="grid size-full place-items-center text-sm text-white/50">
      Загружаем 3D-модель…
    </div>
  )
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
      className={`rounded-card border p-4 text-left transition-colors ${
        active ? 'border-brand-500 bg-brand-50' : 'border-sand-200 bg-white hover:border-ink-300'
      }`}
    >
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

      <span className="shrink-0 text-sm whitespace-nowrap">
        {option.included ? (
          <span className="text-ink-400">в комплекте</span>
        ) : option.price === null ? (
          <span className="text-ink-400">по запросу</span>
        ) : option.price === 0 ? (
          <span className="text-ink-400">—</span>
        ) : (
          <span className="font-medium">+ {formatPrice(option.price)}</span>
        )}
      </span>
    </button>
  )
}

function PriceBar({
  total,
  base,
  was,
  pending,
  promo: isPromoPrice,
}: {
  total: number | null
  base: number | null
  was?: number
  pending: number
  promo: boolean
}) {
  return (
    <div className="mt-4 rounded-panel bg-ink-900 p-5 text-white sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wider text-white/50 uppercase">Предварительная стоимость</p>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl sm:text-4xl">
              {total === null ? 'по запросу' : formatPrice(total)}
            </span>
            {was !== undefined && was !== base && (
              <span className="text-lg text-white/40 line-through">{formatPrice(was)}</span>
            )}
          </p>
        </div>

        {isPromoPrice && (
          <span className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium">
            {promo.label}
          </span>
        )}
      </div>

      {pending > 0 && (
        <p className="mt-3 border-t border-white/10 pt-3 text-sm text-white/60">
          Плюс {pending} {plural(pending, 'опция', 'опции', 'опций')} по запросу — посчитаем в
          ответе на заявку.
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-white/40">
        Расчёт предварительный: цена комплекта по прайсу плюс выбранные опции. Доставка и монтаж
        считаются отдельно.
      </p>
    </div>
  )
}

const plural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
