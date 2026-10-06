/**
 * Heating layouts across the line.
 *
 * Every entry names the model it belongs to, so a model page can show how its
 * own water gets hot without the explanation drifting from the catalogue. Two
 * models share the welded side stove, hence the extra lookup below.
 */
/**
 * A close-up of the stove, supplied as a pair: silver at rest, colour under
 * the pointer. The client's silver is a deliberate high-key treatment rather
 * than a filter, which is why it is a second file and not a CSS effect; where
 * the two takes do not line up, only the colour one is given and the page
 * desaturates it.
 *
 * Nothing carries one at the moment — the first three close-ups are archived
 * in assets/photos-src and can be brought back by naming them here again, but
 * the client is shooting a different set for these.
 */
export interface StovePhoto {
  color: string
  grey?: string
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
    text: 'Дрова горят на земле прямо под чашей, а корпус закрыт ветрозащитой. Самое простое и самое доступное решение в линейке.',
    slug: 'grafit',
  },
  {
    id: 'enlarged',
    title: 'Стационарная печь',
    text: 'Печь служит основанием чану. Внутри — чугунный колосник и выдвижной зольный ящик, корпус из жаропрочной стали 09Г2С.',
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

/** Models that share a layout with the one the entry names. */
const alsoFits: Record<string, string[]> = {
  side: ['grant'],
}

export const heatingForModel = (slug: string) =>
  heatingTypes.find((type) => type.slug === slug || alsoFits[type.id]?.includes(slug))
