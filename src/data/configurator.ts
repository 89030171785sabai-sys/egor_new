/**
 * The configurator's option tree.
 *
 * Every option carries a `price` surcharge over the chosen model's base price.
 * `null` means the client has not given us a number yet: the option still
 * still travels with the lead, but it is shown
 * as «по запросу» and excluded from the total, which then reads as a floor
 * rather than a final figure. Filling this file in is a one-file job once the
 * price list arrives — see docs/placeholders.md.
 */
import type { Model, SizeCm } from './models'
import { effectivePrice } from './models'

export interface ConfigOption {
  id: string
  label: string
  /** One short line under the label. */
  note?: string
  /** Surcharge in roubles, or null while the price is unknown. */
  price: number | null
  /**
   * Sizes the price is valid for. The client's list quotes lids and covers for
   * 175 and 210 only; on any other size the option is «по запросу».
   */
  sizes?: SizeCm[]
  /** Shown instead of a price when the option is part of the base kit. */
  included?: boolean
}

export interface ConfigGroup {
  id: string
  label: string
  hint?: string
  kind: 'single' | 'multi'
  options: ConfigOption[]
}

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
  kind: 'single',
  options: [
    { id: 'standard', label: 'Стандарт — без обшивки', price: 0, included: true },
    { id: 'larch', label: 'Обшивка лиственницей', price: null },
    { id: 'thermo', label: 'Термодерево', price: null },
    { id: 'painted', label: 'Термостойкая покраска', price: null },
  ],
}

/** Ladders and steps from the client's price list. */
export const ladderGroup: ConfigGroup = {
  id: 'ladder',
  label: 'Лестница',
  kind: 'single',
  options: [
    { id: 'metal', label: 'Как в комплекте модели', price: 0, included: true },
    { id: 'straight', label: 'Лестница прямая металлическая', price: 10000 },
    { id: 'frame', label: 'Лестница металлокаркас с площадкой', price: 16500 },
    { id: 'hangers', label: 'Лестница металлокаркас с вешалками', price: 23500 },
    { id: 'none', label: 'Без лестницы', price: 0 },
  ],
}

export const chimneyGroup: ConfigGroup = {
  id: 'chimney',
  label: 'Дымоход',
  kind: 'single',
  options: [
    { id: 'steel', label: 'Дымоход 3 м с защитным экраном', price: 0, included: true },
    { id: 'sandwich', label: 'Сэндвич-дымоход 3 м', price: null },
    { id: 'none', label: 'Без дымохода', price: 0 },
  ],
}

/** Lids and covers are quoted for 175 and 210 only. */
const lidSizes: SizeCm[] = [175, 210]

export const lidGroup: ConfigGroup = {
  id: 'lid',
  label: 'Крышка',
  kind: 'single',
  options: [
    { id: 'none', label: 'Без крышки', price: 0 },
    { id: 'wood', label: 'Крышка из дерева', price: 16000, sizes: lidSizes },
    { id: 'cover', label: 'Чехол мягкий', price: 9500, sizes: lidSizes },
    { id: 'thermo', label: 'Термокрышка жёсткая', price: 18500, sizes: lidSizes },
  ],
}

export const extrasGroup: ConfigGroup = {
  id: 'extras',
  label: 'Дополнительные опции',
  hint: 'Можно выбрать несколько.',
  kind: 'multi',
  options: [
    { id: 'light', label: 'Подсветка безопасная', price: 10500 },
    { id: 'light-outer', label: 'Внешняя подсветка', price: 33000 },
    { id: 'table', label: 'Стол по центру', price: 12500 },
    { id: 'table-side', label: 'Боковой стол', price: 5500 },
    { id: 'headrest', label: 'Подголовник', price: 15000 },
    { id: 'step', label: 'Ступенька в чан', price: 8000 },
    { id: 'jacuzzi', label: 'Джакузи', price: 45000 },
    { id: 'hydro', label: 'Гидро / аэро массаж', price: 169000 },
    { id: 'burner', label: 'Газовая горелка 100 кВт', price: 24000 },
    { id: 'thermo-welded', label: 'Термометр приварной', price: 6000 },
    { id: 'thermo-float', label: 'Термометр поплавок + часы', price: 5000 },
    { id: 'emblem', label: 'Эмблема', price: 6000 },
  ],
}

export const optionGroups: ConfigGroup[] = [
  claddingGroup,
  ladderGroup,
  chimneyGroup,
  lidGroup,
  extrasGroup,
]

/** The surcharge of an option at a size, or null when it has to be quoted. */
export const optionPrice = (option: ConfigOption, size: SizeCm): number | null =>
  option.sizes && !option.sizes.includes(size) ? null : option.price

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
