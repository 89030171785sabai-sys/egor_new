/**
 * Heating layouts across the line.
 *
 * Every entry points at the model that carries it, so the card can borrow that
 * model's photograph and link to its page — no new photography needed, and the
 * section cannot drift from the catalogue.
 */
/**
 * A close-up of the stove itself, supplied as a pair: the card shows the grey
 * version and crossfades to the colour one under the pointer. Both are the
 * client's own renders, so the grey is a deliberate silver treatment rather
 * than a filter — which is why it is a second file and not a CSS effect.
 */
export interface StovePhoto {
  grey: string
  color: string
}

export interface HeatingType {
  id: string
  title: string
  text: string
  /** The model this layout belongs to. */
  slug: string
  /** Falls back to the model's own photograph until this is shot. */
  photo?: StovePhoto
}

export const heatingTypes: HeatingType[] = [
  {
    id: 'hearth',
    title: 'Открытый очаг с ветрозащитой',
    text: 'Чаша без дна стоит прямо над огнём, вокруг — ветрозащита. Самое простое и самое доступное решение в линейке.',
    slug: 'grafit',
    photo: { grey: 'stove-hearth-grey.webp', color: 'stove-hearth-color.webp' },
  },
  {
    id: 'enlarged',
    title: 'Увеличенная дровяная печь',
    text: 'Больше объём топки: дольше горит одна закладка. Чугунный колосник и выдвижной зольный ящик, корпус из жаропрочной стали 09Г2С.',
    slug: 'cherny-brilliant',
  },
  {
    id: 'demountable',
    title: 'Разборная печь',
    text: 'Та же жаропрочная сталь, но печь разбирается — есть доступ к любому узлу, обслуживать проще.',
    slug: 'valtsovavich',
  },
  {
    id: 'water-circuit',
    title: 'Печь с водяным контуром',
    text: 'Змеевик внутри топки греет воду напрямую, а не через стенку чаши. Самый быстрый выход на температуру в линейке — полтора часа.',
    slug: 'nefrit',
  },
  {
    id: 'external',
    title: 'Выносная печь',
    text: 'Топка стоит в стороне от чаши и подключается шлангами. Дым и дрова — за пределами зоны отдыха, чан можно встроить в террасу.',
    slug: 'oniks',
  },
  {
    id: 'side',
    title: 'Боковая приварная печь',
    text: 'Печь приварена к чаше сбоку, теплосъёмные трубы увеличивают площадь контакта. Низкий борт и вертикальная загрузка дров.',
    slug: 'oniks-pro',
  },
]
