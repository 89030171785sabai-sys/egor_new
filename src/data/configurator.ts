/**
 * The configurator's option tree.
 *
 * Every option carries a `price` surcharge over the chosen model's base price.
 * `null` means the client has not given us a number yet: the option still
 * configures the 3D preview and still travels with the lead, but it is shown
 * as «по запросу» and excluded from the total, which then reads as a floor
 * rather than a final figure. Filling this file in is a one-file job once the
 * price list arrives — see docs/placeholders.md.
 */
import type { Model, SizeCm } from './models'
import { effectivePrice } from './models'

/** Everything the 3D preview reads off the current configuration. */
export interface TubVisual {
  bowl: 'faceted' | 'rolled' | 'rect'
  /** Outer diameter in metres — drives the scale of the whole scene. */
  diameter: number
  cladding: 'none' | 'larch' | 'thermo' | 'painted'
  stove: 'under' | 'inner' | 'external' | 'side'
  ladder: 'none' | 'wood' | 'metal'
  chimney: 'none' | 'steel' | 'sandwich'
  lid: boolean
  light: boolean
  table: boolean
  hydro: boolean
}

export interface ConfigOption {
  id: string
  label: string
  /** One short line under the label. */
  note?: string
  /** Surcharge in roubles, or null while the price is unknown. */
  price: number | null
  /** Shown instead of a price when the option is part of the base kit. */
  included?: boolean
  /** What this option changes in the preview. */
  visual?: Partial<TubVisual>
}

export interface ConfigGroup {
  id: string
  label: string
  hint?: string
  kind: 'single' | 'multi'
  options: ConfigOption[]
}

/** Stove layout per model, for the preview. */
const stoveBySlug: Record<string, TubVisual['stove']> = {
  grafit: 'under',
  'cherny-brilliant': 'inner',
  valtsovavich: 'inner',
  nefrit: 'under',
  oniks: 'external',
  'oniks-pro': 'side',
  grant: 'side',
}

export const modelVisual = (model: Model): Pick<TubVisual, 'bowl' | 'stove'> => ({
  bowl: model.bowlShape,
  stove: stoveBySlug[model.slug] ?? 'inner',
})

/** The catalogue's size grid is in centimetres; the scene works in metres. */
export const diameterOf = (cm: SizeCm) => cm / 100

/**
 * Base price for a model at a given size — the client's own figure, with the
 * opening promotion applied where it is due.
 */
export function basePrice(model: Model, cm: SizeCm): number | null {
  return effectivePrice(model, cm) ?? null
}

export const claddingGroup: ConfigGroup = {
  id: 'cladding',
  label: 'Отделка снаружи',
  hint: 'Чем закрыт корпус чаши с внешней стороны.',
  kind: 'single',
  options: [
    {
      id: 'standard',
      label: 'Стандарт — без обшивки',
      note: 'Открытая нержавейка, входит в базовую комплектацию',
      price: 0,
      included: true,
      visual: { cladding: 'none' },
    },
    {
      id: 'larch',
      label: 'Обшивка лиственницей',
      note: 'Тёплый светлый тон, обработка маслом',
      price: null,
      visual: { cladding: 'larch' },
    },
    {
      id: 'thermo',
      label: 'Термодерево',
      note: 'Тёмный тон, устойчиво к влаге и перепадам',
      price: null,
      visual: { cladding: 'thermo' },
    },
    {
      id: 'painted',
      label: 'Термостойкая покраска',
      note: 'Матовый чёрный по металлу',
      price: null,
      visual: { cladding: 'painted' },
    },
  ],
}

export const ladderGroup: ConfigGroup = {
  id: 'ladder',
  label: 'Лестница',
  kind: 'single',
  options: [
    {
      id: 'metal',
      label: 'Металлокаркас с площадкой и поручнем',
      note: 'Входит в комплект большинства моделей',
      price: 0,
      included: true,
      visual: { ladder: 'metal' },
    },
    {
      id: 'wood',
      label: 'Деревянные ступени',
      note: 'Ступени из лиственницы на том же каркасе',
      price: null,
      visual: { ladder: 'wood' },
    },
    { id: 'none', label: 'Без лестницы', price: 0, visual: { ladder: 'none' } },
  ],
}

export const chimneyGroup: ConfigGroup = {
  id: 'chimney',
  label: 'Дымоход',
  kind: 'single',
  options: [
    {
      id: 'steel',
      label: 'Дымоход 3 м с защитным экраном',
      note: 'Входит в комплект',
      price: 0,
      included: true,
      visual: { chimney: 'steel' },
    },
    {
      id: 'sandwich',
      label: 'Сэндвич-дымоход 3 м',
      note: 'Двойная стенка с утеплителем — наружная труба не обжигает',
      price: null,
      visual: { chimney: 'sandwich' },
    },
    { id: 'none', label: 'Без дымохода', price: 0, visual: { chimney: 'none' } },
  ],
}

export const lidGroup: ConfigGroup = {
  id: 'lid',
  label: 'Крышка',
  hint: 'Держит температуру между заходами и защищает чашу от осадков.',
  kind: 'single',
  options: [
    { id: 'none', label: 'Без крышки', price: 0, visual: { lid: false } },
    {
      id: 'cover',
      label: 'Влагостойкая крышка',
      note: 'Лёгкая, снимается вручную',
      price: null,
      visual: { lid: true },
    },
    {
      id: 'insulated',
      label: 'Утеплённая крышка',
      note: 'Дольше держит температуру',
      price: null,
      visual: { lid: true },
    },
  ],
}

export const extrasGroup: ConfigGroup = {
  id: 'extras',
  label: 'Дополнительные опции',
  hint: 'Можно выбрать несколько.',
  kind: 'multi',
  options: [
    {
      id: 'light',
      label: 'Подсветка чаши',
      note: 'Влагозащищённая, с пультом',
      price: null,
      visual: { light: true },
    },
    {
      id: 'table',
      label: 'Центральный стол',
      note: 'Съёмный, на горловину печи',
      price: null,
      visual: { table: true },
    },
    {
      id: 'hydro',
      label: 'Гидромассаж',
      note: 'Форсунки по периметру чаши',
      price: null,
      visual: { hydro: true },
    },
    { id: 'headrests', label: 'Подголовники', note: 'Комплект на всю посадку', price: null },
    { id: 'cover-case', label: 'Защитный чехол', note: 'На межсезонное хранение', price: null },
    { id: 'thermometer', label: 'Термометр', price: null },
    { id: 'drain', label: 'Слив с краном', note: 'Быстрый слив воды после сеанса', price: null },
  ],
}

export const optionGroups: ConfigGroup[] = [
  claddingGroup,
  ladderGroup,
  chimneyGroup,
  lidGroup,
  extrasGroup,
]

/** Default selection per group — the base kit as the catalogue describes it. */
export const defaultSelection: Record<string, string[]> = {
  cladding: ['standard'],
  ladder: ['metal'],
  chimney: ['steel'],
  lid: ['none'],
  extras: [],
}

/** “Нефрит” opens the configurator: it is the client's bestseller. */
export const defaultModelSlug = 'nefrit'

export const optionById = (group: ConfigGroup, id: string) =>
  group.options.find((option) => option.id === id)
