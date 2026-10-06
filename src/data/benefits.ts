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
}

export interface Benefit {
  id: string
  title: string
  /** One line under the title. */
  lead?: string
  /** Ticked points, as the catalogue prints them. */
  points?: string[]
  image?: BenefitImage
  /** What the drawing has to show, until it is drawn. */
  wanted: string
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
    wanted: 'прозрачный чан в разрезе: контур печи и стрелки циркуляции воды',
  },
  {
    id: 'heat-area',
    title: 'Площадь теплосъёма',
    lead: 'Важнейшая характеристика печи — напрямую влияет на КПД и скорость нагрева воды в чане.',
    wanted: 'диаграмма: площадь поверхности печи HOTTUB против обычного чана',
  },
]
