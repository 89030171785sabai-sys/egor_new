/**
 * The model line. One object per model drives its card in the catalogue, its
 * own page, the metadata and the sitemap — the way the reference site drives
 * eight near-identical pages from data.
 *
 * `theme` is the signature backdrop of the model's hero.
 */
export type ModelTheme = 'graphite' | 'copper' | 'terracotta' | 'olive' | 'sand' | 'ink'

export interface ModelPrice {
  from: number
  /** Absent when the model has a single fixed price. */
  to?: number
}

/**
 * Sizes a model is built in, as the maximum number of people. The catalogue
 * filter works off these. Confirm the real availability per model with the
 * client — for now every tub carries the full size range and the tub-shaped
 * bath carries the two it makes sense in.
 */
export type Capacity = 4 | 6 | 9 | 12

export const capacities: Capacity[] = [4, 6, 9, 12]

export const capacityLabel = (capacity: Capacity) => `до ${capacity}`

export interface Model {
  slug: string
  name: string
  /** Short accent line under the name, the model's distinguishing feature. */
  accent: string
  /** Product type, set above the name in the hero. */
  kind: string
  description: string
  /** Hours to heat from cold to bathing temperature. */
  heatingHours: number
  /** Stove layout — the trait that separates the models. */
  stove: string
  /** Shape of the bowl. */
  bowl: string
  theme: ModelTheme
  sizes: Capacity[]
  /** Kit contents, as listed on the catalogue card. */
  includes: string[]
  price?: ModelPrice
  seoTitle: string
  seoDescription: string
}

export const models: Model[] = [
  {
    slug: 'cherny-brilliant',
    name: 'Чёрный бриллиант',
    accent: 'Гранёная чаша — спина скажет спасибо',
    kind: 'Банный чан',
    description: 'Гранёная чаша на стационарной печи с внутренней топкой.',
    heatingHours: 3.5,
    stove: 'Стационарная, с внутренней топкой',
    bowl: 'Гранёная',
    theme: 'ink',
    sizes: [4, 6, 9, 12],
    includes: [
      'Чаша из пищевой нержавейки',
      'Отделка «стандарт»',
      'Стационарная печь с внутренней топкой',
      'Дымоход с защитным экраном',
      'Лестница на металлокаркасе с площадкой и поручнем',
    ],
    seoTitle: 'Банный чан «Чёрный бриллиант»',
    seoDescription:
      'Гранёная чаша на стационарной печи с внутренней топкой. Нагрев 3,5 часа, изготовление и доставка под ключ за 8 дней.',
  },
  {
    slug: 'valtsovovich',
    name: 'Вальцовович',
    accent: 'Вальцованная форма чаши',
    kind: 'Банный чан',
    description: 'Вальцованная форма чаши на печи-подставке.',
    heatingHours: 3.5,
    stove: 'Печь-подставка под чашей',
    bowl: 'Вальцованная',
    theme: 'graphite',
    sizes: [4, 6, 9, 12],
    includes: [
      'Чаша из пищевой нержавейки',
      'Отделка «стандарт»',
      'Печь-подставка под чашей',
      'Дымоход с защитным экраном',
      'Лестница на металлокаркасе с площадкой и поручнем',
    ],
    seoTitle: 'Банный чан «Вальцовович»',
    seoDescription:
      'Вальцованная форма чаши на печи-подставке. Нагрев 3,5 часа, изготовление и доставка под ключ за 8 дней.',
  },
  {
    slug: 'vodyanoy-kontur',
    name: 'Водяной контур',
    accent: 'Водяной контур — КПД топки вдвое выше',
    kind: 'Банный чан',
    description: 'Гранёная чаша на печи с водяным контуром — для ускоренного нагрева.',
    heatingHours: 2,
    stove: 'С водяным контуром и подставкой',
    bowl: 'Гранёная',
    theme: 'copper',
    sizes: [4, 6, 9, 12],
    includes: [
      'Чаша из пищевой нержавейки',
      'Отделка «стандарт»',
      'Печь с водяным контуром и подставка',
      'Дымоход 3 м с защитным экраном',
      'Лестница на металлокаркасе с площадкой и поручнем',
    ],
    price: { from: 225000, to: 336000 },
    seoTitle: 'Банный чан с водяным контуром',
    seoDescription:
      'Гранёная чаша на печи с водяным контуром: нагрев за 2 часа, КПД топки вдвое выше. Цена от 225 000 ₽.',
  },
  {
    slug: 's-vynosnoy-pechyu',
    name: 'С выносной печью',
    accent: 'Для монтажа в террасу',
    kind: 'Банный чан',
    description: 'Печь можно расположить в 1,5–2 м от чаши — удобно для монтажа в террасу.',
    heatingHours: 2.5,
    stove: 'Выносная, в 1,5–2 м от чаши',
    bowl: 'Гранёная',
    theme: 'sand',
    sizes: [4, 6, 9, 12],
    includes: [
      'Чаша из пищевой нержавейки',
      'Отделка «стандарт»',
      'Выносная печь и штанги для подключения',
      'Дымоход 2 м',
    ],
    price: { from: 200000, to: 340000 },
    seoTitle: 'Банный чан с выносной печью',
    seoDescription:
      'Печь в 1,5–2 м от чаши — решение для монтажа в террасу. Нагрев 2,5 часа, цена от 200 000 ₽.',
  },
  {
    // Name to be confirmed with the client — described by its stove on the
    // current site, without a model name in view.
    slug: 'bokovaya-pech',
    name: 'Боковая печь',
    accent: 'Самый быстрый нагрев в линейке',
    kind: 'Банный чан',
    description:
      'Печь с водяным контуром и теплосъёмными трубами. Вертикальная загрузка дров, низкий борт для безопасности.',
    heatingHours: 1.5,
    stove: 'Приварная боковая с водяным контуром',
    bowl: 'Гранёная, низкий борт',
    theme: 'terracotta',
    sizes: [4, 6, 9, 12],
    includes: [
      'Чаша из пищевой нержавейки',
      'Отделка «стандарт»',
      'Печь приварная боковая',
      'Дымоход 2 м с сэндвич-вставкой 1 м',
      'Лестница на металлокаркасе с площадкой и поручнем',
    ],
    price: { from: 310000, to: 480000 },
    seoTitle: 'Банный чан с приварной боковой печью',
    seoDescription:
      'Водяной контур и теплосъёмные трубы: нагрев за 1,5 часа. Вертикальная загрузка дров, низкий борт. Цена от 310 000 ₽.',
  },
  {
    // Name to be confirmed with the client.
    slug: 'kupel-premium',
    name: 'Купель премиум',
    accent: 'Прямоугольная форма и встроенный дровник',
    kind: 'Купель',
    description: 'Прямоугольная купель со встроенной печью и дровником. Премиальное решение.',
    heatingHours: 2,
    stove: 'Встроенная, с дровником',
    bowl: 'Прямоугольная',
    theme: 'olive',
    sizes: [6, 9],
    includes: [
      'Купель из пищевой нержавейки',
      'Встроенная печь и дровник',
      'Дымоход с искрогасителем',
      'Ступени и площадка',
    ],
    price: { from: 800000 },
    seoTitle: 'Прямоугольная купель со встроенной печью',
    seoDescription:
      'Купель со встроенной печью и дровником, ступенями и площадкой. Премиальное решение, цена 800 000 ₽.',
  },
]

export const modelBySlug = (slug: string) => models.find((model) => model.slug === slug)

/** Lowest entry price across the line, used in the headline offer. */
export const priceFrom = 180000

export const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

export const formatPriceRange = (price?: ModelPrice) => {
  if (!price) return 'по запросу'
  if (price.to === undefined) return formatPrice(price.from)
  return `от ${formatPrice(price.from)} до ${formatPrice(price.to)}`
}

/** «3,5 ч» — a comma decimal separator, as Russian typography wants. */
export const formatHours = (hours: number) =>
  `${hours.toString().replace('.', ',')} ч`
