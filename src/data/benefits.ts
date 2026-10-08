/**
 * The technical advantages, as the printed catalogue lays them out.
 *
 * Each one is carried by a diagram rather than a photograph: a ghosted tub
 * showing where the water runs, a comparison of heat-exchange area. The
 * drawings are supplied as a pair — silver at rest, colour under the pointer —
 * exactly like the stove close-ups.
 */
export interface BenefitImage {
  color: string
  /** Omitted where no matching silver take exists; the page desaturates then. */
  grey?: string
  /** The drawing's own proportions, so an overlay can line up with it. */
  width: number
  height: number
  /** Which set of circulation arrows to lay over it, if any. */
  arrows?: 'circuit'
}

export interface Benefit {
  id: string
  title: string
  /** One line under the title. */
  lead?: string
  /** Ticked points, as the catalogue prints them. */
  points?: string[]
  image?: BenefitImage
  /**
   * Carries its point in words alone. The catalogue illustrates this one with
   * two circles, but without the two areas it compares the drawing asserts a
   * difference it cannot show — so it stays text until the figures exist.
   */
  textOnly?: boolean
  /** Figures that make the point concrete, shown as a row under the text. */
  figures?: { value: string; unit?: string; caption: string }[]
  /** What the drawing has to show, until it is drawn. */
  wanted?: string
}

export const benefits: Benefit[] = [
  {
    id: 'water-circuit',
    title: 'Чан с водяным контуром',
    points: [
      'Сталь 3 мм',
      'Печь с водяным контуром',
      'Циркуляция воды внутри печи',
      'Сливной кран в самой нижней части водяного контура',
    ],
    image: {
      color: 'benefit-water-circuit.webp',
      width: 942,
      height: 893,
      arrows: 'circuit',
    },
    wanted: 'прозрачный чан в разрезе: контур печи и стрелки циркуляции воды',
  },
  {
    id: 'heat-area',
    title: 'Площадь теплосъёма',
    lead: 'Это площадь, которой печь отдаёт тепло воде. Она и решает, за сколько прогреется чан — в линейке разница выходит больше чем втрое.',
    // Every one of these is a figure from the price list, so the section makes
    // its case with the line's own numbers rather than with an adjective.
    points: [
      'Печь на ветрозащите греет дном чаши — нагрев 5 часов («Графит»)',
      'Печь с водяным контуром греет водой вокруг топки — 1,5 часа («Нефрит»)',
      'Теплосъёмные трубы добавляют площадь контакта («Оникс», «Оникс Про», «Грант»)',
    ],
    figures: [
      { value: '3', unit: 'мм', caption: 'толщина стали' },
      { value: '1,5', unit: 'ч', caption: 'самый быстрый нагрев' },
      { value: '5', unit: 'ч', caption: 'без водяного контура' },
    ],
    textOnly: true,
  },
]
