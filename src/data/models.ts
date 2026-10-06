/**
 * The model line, from the client's own catalogue.
 *
 * One object per model drives its card, its page, its metadata and the
 * sitemap. Prices are per size and are the client's own figures — the only
 * computed one is the promotional opening price, which is held in `promo`
 * below rather than written into a size.
 */
export type ModelTheme = 'graphite' | 'copper' | 'terracotta' | 'olive' | 'sand' | 'ink' | 'jade'

/** Bowl diameter in centimetres — the catalogue's own size grid. */
export type SizeCm = 175 | 210 | 235 | 250

export interface SizeTier {
  cm: SizeCm
  /** Bathers the size is sold for. */
  people: number
  name: string
}

export const sizeTiers: SizeTier[] = [
  { cm: 175, people: 4, name: 'Малый' },
  { cm: 210, people: 6, name: 'Средний' },
  { cm: 235, people: 9, name: 'Большой' },
  { cm: 250, people: 14, name: 'Огромный' },
]

export const sizeTier = (cm: SizeCm) => sizeTiers.find((tier) => tier.cm === cm)

export const sizeLabel = (cm: SizeCm) => {
  const tier = sizeTier(cm)
  return tier ? `${cm} см · до ${tier.people}` : `${cm} см`
}

export type SteelGrade = 'AISI 430' | 'AISI 304'

export const steelGrades: Record<SteelGrade, { title: string; life: string; note: string }> = {
  'AISI 430': {
    title: 'Техническая нержавеющая сталь AISI 430',
    life: '20–25 лет',
    note: 'Ферритная сталь: держит высокую температуру, стоит дешевле пищевой.',
  },
  'AISI 304': {
    title: 'Пищевая нержавеющая сталь AISI 304',
    life: '45–50 лет',
    note: 'Аустенитная сталь с никелем: не ржавеет, допущена к контакту с пищей.',
  },
}

export interface Offer {
  cm: SizeCm
  price: number
}

/**
 * Opening offer: the smallest Графит at a promotional price. Kept in one place
 * so the badge, the hero figure and the configurator can never drift apart.
 */
export const promo = {
  modelSlug: 'grafit',
  cm: 175 as SizeCm,
  price: 99000,
  was: 119000,
  label: 'Стартовая цена',
  note: 'Малый чан «Графит» 175 см — 99 000 ₽ вместо 119 000 ₽',
} as const

/**
 * Real photographs, by file name in `public/photos`. A model without an entry
 * keeps the procedural stand-in, so the line can be photographed one model at
 * a time without touching any component.
 */
export interface ModelPhotos {
  /** Full-bleed shot behind the model page's opening screen. */
  hero?: string
  /** Product shot on the catalogue card. */
  card?: string
  /**
   * Width of the hero shot on a large screen, as a share of the viewport.
   *
   * Every photograph was taken at its own distance, so the same render width
   * would show one tub twice the size of another. These numbers are computed
   * by `scripts/normalise-hero-photos.py` from the measured rim of each bowl,
   * so that rim x width lands on one figure for the whole line. Re-run the
   * script after adding a photograph rather than guessing a value.
   */
  heroWidth?: number
  /**
   * The shot's own backdrop colour. The page lays it behind the photograph as
   * a soft glow, which is what lets the picture's edges fade out without the
   * chimney going black against the page. Reported by the same script.
   */
  heroTone?: string
}

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
  steel: SteelGrade
  /** Stove layout — the trait that separates the models. */
  stove: string
  /**
   * Bowl shape, for the 3D configurator. Only «Вальцовавич» is known from the
   * catalogue (the name is the rolled forming process); the rest are assumed
   * faceted and need confirming with the client.
   */
  bowlShape: 'faceted' | 'rolled'
  theme: ModelTheme
  /** Shown on the card as a ribbon. */
  badge?: string
  offers: Offer[]
  photos?: ModelPhotos
  /** Kit contents, as the catalogue lists them. */
  includes: string[]
  seoTitle: string
  seoDescription: string
}

/** Fitted to every model: the catalogue repeats these for the whole line. */
const commonIncludes = [
  'Чаша с отделкой из лиственницы',
  'Спинки под углом 67°',
  'Шаровый сливной кран',
]

export const models: Model[] = [
  {
    slug: 'grafit',
    name: 'Графит',
    accent: 'Открытый очаг с ветрозащитой',
    kind: 'Банный чан',
    description:
      'Базовая модель на техническом металле: дрова горят на земле прямо под чашей, корпус закрыт ветрозащитой.',
    heatingHours: 5,
    steel: 'AISI 430',
    stove: 'Открытый очаг под чашей, ветрозащита без дна',
    bowlShape: 'faceted',
    theme: 'graphite',
    badge: 'Стартовая цена',
    offers: [
      { cm: 175, price: 119000 },
      { cm: 210, price: 135500 },
      { cm: 235, price: 176500 },
    ],
    // Only the model page's own hero: the home page and the catalogue card
    // are waiting for their own shots.
    photos: { hero: 'grafit-hero.webp', heroWidth: 0.626, heroTone: '#181f26' },
    includes: [...commonIncludes, 'Ветрозащита без дна', 'Дымоход 3 м и защитный экран'],
    seoTitle: 'Банный чан «Графит»',
    seoDescription:
      'Банный чан на открытом очаге: дрова горят на земле под чашей, корпус закрыт ветрозащитой. Сталь AISI 430, отделка лиственницей. Цена от 99 000 ₽ по стартовому предложению.',
  },
  {
    slug: 'cherny-brilliant',
    name: 'Чёрный бриллиант',
    accent: 'Увеличенная печь с чугунным колосником',
    kind: 'Банный чан',
    description:
      'Увеличенная печь из жаропрочной стали 09Г2С с чугунным колосником и выдвижным зольным ящиком.',
    heatingHours: 3,
    steel: 'AISI 304',
    stove: 'Увеличенная, жаропрочная сталь 09Г2С',
    bowlShape: 'faceted',
    theme: 'ink',
    photos: { hero: 'cherny-brilliant-hero.webp', heroWidth: 0.517, heroTone: '#441403' },
    offers: [
      { cm: 175, price: 133000 },
      { cm: 210, price: 155500 },
      { cm: 235, price: 206500 },
    ],
    includes: [
      ...commonIncludes,
      'Увеличенная печь: чугунный колосник, выдвижной зольный ящик',
      'Дымоход 3 м и защитный экран',
    ],
    seoTitle: 'Банный чан «Чёрный бриллиант»',
    seoDescription:
      'Увеличенная печь с чугунным колосником и зольным ящиком, пищевая сталь AISI 304, нагрев 3 часа. Цена от 133 000 ₽.',
  },
  {
    slug: 'valtsovavich',
    name: 'Вальцовавич',
    accent: 'Разборная печь — легко обслуживать',
    kind: 'Банный чан',
    description:
      'Разборная печь из жаропрочной стали 09Г2С: чугунный колосник и выдвижной зольный ящик, доступ к любому узлу.',
    heatingHours: 3,
    steel: 'AISI 304',
    stove: 'Разборная, жаропрочная сталь 09Г2С',
    bowlShape: 'rolled',
    theme: 'sand',
    photos: { hero: 'valtsovavich-hero.webp', heroWidth: 0.85, heroTone: '#36414e' },
    offers: [
      { cm: 175, price: 135000 },
      { cm: 210, price: 159000 },
      { cm: 235, price: 211000 },
    ],
    includes: [
      ...commonIncludes,
      'Разборная печь: чугунный колосник, выдвижной зольный ящик',
      'Дымоход 3 м и защитный экран',
    ],
    seoTitle: 'Банный чан «Вальцовавич»',
    seoDescription:
      'Разборная печь с чугунным колосником, вальцованная чаша из пищевой стали AISI 304, нагрев 3 часа. Цена от 135 000 ₽.',
  },
  {
    slug: 'nefrit',
    name: 'Нефрит',
    accent: 'Водяной контур — нагрев за 1,5 часа',
    kind: 'Банный чан',
    description:
      'Печь ускоренного нагрева с водяным контуром и змеевиком. Самый быстрый выход на температуру в линейке.',
    heatingHours: 1.5,
    steel: 'AISI 304',
    stove: 'Ускоренного нагрева, водяной контур и змеевик',
    bowlShape: 'faceted',
    theme: 'jade',
    badge: 'Хит продаж',
    photos: { hero: 'nefrit-hero.webp', heroWidth: 0.5, heroTone: '#3f4148' },
    offers: [
      { cm: 175, price: 187000 },
      { cm: 210, price: 195990 },
      { cm: 235, price: 240000 },
    ],
    includes: [
      ...commonIncludes,
      'Печь ускоренного нагрева: водяной контур и змеевик',
      'Чугунный колосник и выдвижной зольный ящик',
      'Дымоход 3 м и защитный экран',
    ],
    seoTitle: 'Банный чан «Нефрит» — нагрев за 1,5 часа',
    seoDescription:
      'Хит продаж: печь с водяным контуром и змеевиком, нагрев за 1,5 часа, пищевая сталь AISI 304. Цена от 187 000 ₽.',
  },
  {
    slug: 'oniks',
    name: 'Оникс',
    accent: 'Выносная печь — для монтажа в террасу',
    kind: 'Банный чан',
    description:
      'Выносная печь с водяным контуром и теплосъёмными трубами, подключение шлангами 1,5 м — печь можно отнести от чаши.',
    heatingHours: 2,
    steel: 'AISI 304',
    stove: 'Выносная, водяной контур и теплосъёмные трубы',
    bowlShape: 'faceted',
    theme: 'olive',
    photos: { hero: 'oniks-hero.webp', heroWidth: 0.75, heroTone: '#1a3935' },
    offers: [
      { cm: 175, price: 188000 },
      { cm: 210, price: 199000 },
      { cm: 235, price: 231000 },
    ],
    includes: [
      ...commonIncludes,
      'Выносная печь: водяной контур и теплосъёмные трубы',
      'Шланги для подключения 1,5 м',
      'Дымоход 2 м',
    ],
    seoTitle: 'Банный чан «Оникс» с выносной печью',
    seoDescription:
      'Выносная печь с водяным контуром и теплосъёмными трубами, шланги 1,5 м, нагрев 2 часа. Цена от 188 000 ₽.',
  },
  {
    slug: 'oniks-pro',
    name: 'Оникс про',
    accent: 'Решение 4 в 1 — боковая приварная печь',
    kind: 'Банный чан',
    description:
      'Расширенная боковая приварная печь с водяным контуром и теплосъёмными трубами. Низкая чаша, вертикальная загрузка дров, лестница-подиум в комплекте.',
    heatingHours: 1.5,
    steel: 'AISI 304',
    stove: 'Боковая приварная расширенная, водяной контур и теплосъёмные трубы',
    bowlShape: 'faceted',
    theme: 'terracotta',
    badge: 'Решение 4 в 1',
    photos: { hero: 'oniks-pro-hero.webp', heroWidth: 0.662, heroTone: '#692713' },
    offers: [
      { cm: 210, price: 294000 },
      { cm: 235, price: 353000 },
    ],
    includes: [
      ...commonIncludes,
      'Боковая приварная расширенная печь: водяной контур и теплосъёмные трубы',
      'Дымоход 1 м и 1 м сэндвич-трубы',
      'Металлическая лестница-подиум',
    ],
    seoTitle: 'Банный чан «Оникс про» — решение 4 в 1',
    seoDescription:
      'Боковая приварная печь с водяным контуром, низкая чаша для монтажа в террасу, вертикальная загрузка дров, нагрев 1,5 часа. Цена от 294 000 ₽.',
  },
  {
    slug: 'grant',
    name: 'Грант',
    accent: 'Нержавеющие лавочки и максимальный размер',
    kind: 'Банный чан',
    description:
      'Старшая модель: лавочки из нержавеющей стали, отделка лиственницей по полу и верхней окантовке. Единственный размер на 14 человек.',
    heatingHours: 2,
    steel: 'AISI 304',
    stove: 'Боковая приварная расширенная, водяной контур и теплосъёмные трубы',
    bowlShape: 'faceted',
    theme: 'copper',
    photos: { hero: 'grant-hero.webp', heroWidth: 0.782, heroTone: '#60220b' },
    offers: [
      { cm: 235, price: 459000 },
      { cm: 250, price: 588000 },
    ],
    includes: [
      'Отделка лиственницей: пол и верхняя окантовка',
      'Лавочки из нержавеющей стали',
      'Шаровый сливной кран',
      'Боковая приварная расширенная печь: водяной контур и теплосъёмные трубы',
      'Дымоход 1 м и 1 м сэндвич-трубы',
      'Металлическая лестница-подиум',
    ],
    seoTitle: 'Банный чан «Грант» до 14 человек',
    seoDescription:
      'Старшая модель с нержавеющими лавочками и размером 250 см до 14 человек, боковая приварная печь с водяным контуром. Цена от 459 000 ₽.',
  },
]

export const modelBySlug = (slug: string) => models.find((model) => model.slug === slug)

export const modelSizes = (model: Model): SizeCm[] => model.offers.map((offer) => offer.cm)

export const offerFor = (model: Model, cm: SizeCm) =>
  model.offers.find((offer) => offer.cm === cm)

/** True where the opening promotional price applies. */
export const isPromo = (model: Model, cm: SizeCm) =>
  model.slug === promo.modelSlug && cm === promo.cm

/** What the customer actually pays for this size, promotion included. */
export const effectivePrice = (model: Model, cm: SizeCm) => {
  const offer = offerFor(model, cm)
  if (!offer) return undefined
  return isPromo(model, cm) ? promo.price : offer.price
}

export const modelPriceFrom = (model: Model) =>
  Math.min(...model.offers.map((offer) => effectivePrice(model, offer.cm) ?? offer.price))

export const modelPriceTo = (model: Model) =>
  Math.max(...model.offers.map((offer) => offer.price))

/** Lowest price on the site — the promotional one. */
export const priceFrom = promo.price

/** What the line starts at without the promotion. */
export const regularPriceFrom = Math.min(
  ...models.flatMap((model) => model.offers.map((offer) => offer.price)),
)

export const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

export const formatPriceRange = (model: Model) => {
  const from = modelPriceFrom(model)
  const to = modelPriceTo(model)
  if (from === to) return formatPrice(from)
  return `от ${formatPrice(from)} до ${formatPrice(to)}`
}

/** «3,5 ч» — a comma decimal separator, as Russian typography wants. */
export const formatHours = (hours: number) =>
  `${hours.toString().replace('.', ',')} ч`

/** Fastest and slowest heating in the line, for the comparison figures. */
export const fastestHeating = Math.min(...models.map((model) => model.heatingHours))

/** Largest party the line seats. */
export const maxPeople = Math.max(
  ...models.flatMap((model) => modelSizes(model).map((cm) => sizeTier(cm)?.people ?? 0)),
)
