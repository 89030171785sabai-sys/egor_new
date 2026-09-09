import type { PlaceholderTone } from '../components/ui/PlaceholderImage'

/**
 * The configurator. Eight steps of data — the component that renders them
 * knows nothing about tubs, so adding an option is a data change.
 */
export interface QuizOption {
  id: string
  title: string
  /** Short clarification under the title. */
  note?: string
  /** Steps whose options are shown with a product shot set this. */
  tone?: PlaceholderTone
}

export interface QuizStep {
  id: string
  title: string
  /** Advice line under the question, set in the accent colour. */
  hint?: string
  mode: 'single' | 'multi'
  /** For `multi`: the exact number of options that must be picked. */
  pick?: number
  /** Renders options as image tiles rather than text rows. */
  withImages?: boolean
  options: QuizOption[]
}

export const quizSteps: QuizStep[] = [
  {
    id: 'capacity',
    title: 'Сколько человек будет париться одновременно?',
    hint: 'Совет: берите с запасом — свободное пространство делает парение комфортнее.',
    mode: 'single',
    options: [
      { id: 'small', title: 'Маленький', note: 'до 4 человек — компактный вариант для семьи или пары' },
      { id: 'medium', title: 'Средний', note: 'до 6 человек — оптимально для дружеских посиделок' },
      { id: 'large', title: 'Большой', note: 'до 9 человек — просторный чан для большой компании' },
      { id: 'maxi', title: 'Макси', note: 'до 12 человек — максимум для мероприятий и банных комплексов' },
    ],
  },
  {
    id: 'material',
    title: 'Материал чаши',
    mode: 'single',
    options: [
      {
        id: 'aisi-430',
        title: 'Нержавеющая сталь AISI 430',
        note: 'прочная и надёжная, отлично держит тепло. Проверенный выбор по разумной цене',
      },
      {
        id: 'aisi-304',
        title: 'Нержавеющая сталь AISI 304',
        note: 'премиальная марка, повышенная стойкость к коррозии. Служит дольше и сохраняет вид на десятилетия',
      },
    ],
  },
  {
    id: 'finish',
    title: 'Отделка',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'standard', title: 'Стандарт', note: 'аккуратная базовая отделка — всё для комфортного парения', tone: 'studio' },
      { id: 'standard-plus', title: 'Стандарт плюс', note: 'улучшенная обработка поверхности, приятнее тактильно и визуально', tone: 'sand' },
      { id: 'premium', title: 'Премиум', note: 'качественные материалы и тщательная отделка, повышенный комфорт', tone: 'copper' },
      { id: 'lux', title: 'Люкс', note: 'максимальный уровень: премиальные материалы и безупречный вид', tone: 'ink' },
    ],
  },
  {
    id: 'stove',
    title: 'Тип печи',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'stationary', title: 'Стационарная печь', note: 'классика, внутри чана — быстрый нагрев', tone: 'ink' },
      { id: 'base', title: 'Печь-подставка', note: 'располагается под чашей, экономит внутреннее пространство', tone: 'graphite' },
      { id: 'water-circuit', title: 'Печь с водяным контуром', note: 'равномерный прогрев воды по всему объёму', tone: 'copper' },
      { id: 'external', title: 'Печь выносная', note: 'топка снаружи — внутри больше места и меньше дыма', tone: 'terracotta' },
    ],
  },
  {
    id: 'chimney',
    title: 'Дымоход',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'three-meters', title: 'Дымоход 3 м + защитный экран', note: 'высокая тяга и защита от случайных ожогов', tone: 'studio' },
      { id: 'sandwich', title: 'Дымоход 2 м + сэндвич-вставка 1 м', note: 'утеплённая вставка снижает нагрев трубы — безопаснее и аккуратнее', tone: 'studio' },
    ],
  },
  {
    id: 'ladder',
    title: 'Лестница',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'straight', title: 'Металлическая прямая', note: 'простой и надёжный вход в чан', tone: 'studio' },
      { id: 'platform', title: 'Металлокаркасная с площадкой и поручнем', note: 'удобный и безопасный подъём с опорой', tone: 'studio' },
      { id: 'hooks', title: 'С площадкой и крючками под халаты', note: 'место для халатов и полотенец рядом с чаном', tone: 'studio' },
    ],
  },
  {
    id: 'extras',
    title: 'Дополнительные элементы',
    hint: 'Отметьте всё, что хотите добавить — можно несколько.',
    mode: 'multi',
    options: [
      { id: 'thermo-cover', title: 'Термочехол', note: 'сохраняет тепло и ускоряет нагрев' },
      { id: 'hard-lid', title: 'Жёсткая термокрышка', note: 'держит температуру и защищает воду от мусора' },
      { id: 'wooden-lid', title: 'Деревянная крышка', note: 'эстетично, также сохраняет тепло' },
      { id: 'center-table', title: 'Стол по центру', note: 'для напитков и закусок прямо во время парения' },
      { id: 'side-table', title: 'Стол боковой', note: 'дополнительная поверхность рядом с чаном' },
      { id: 'chromotherapy', title: 'Хромотерапия — подсветка', note: 'цветная подсветка воды для атмосферы' },
      { id: 'headrest', title: 'Мягкий подголовник', note: 'комфортная опора для головы и шеи' },
      { id: 'jacuzzi', title: 'Джакузи', note: 'пузырьковый массаж и релакс' },
      { id: 'hydro-massage', title: 'Гидро-аэромассаж', note: 'массаж воздушными и водяными потоками' },
      { id: 'logo', title: 'Логотип на чашу', note: 'индивидуальное оформление, актуально для бизнеса' },
      { id: 'glass', title: 'Закалённое стекло в печь', note: 'любоваться живым огнём, повышенная прочность' },
      { id: 'gas-burner', title: 'Газовая горелка для печи', note: 'альтернатива дровам, удобнее в розжиге' },
    ],
  },
  {
    id: 'gift',
    title: 'Подарок в комплект',
    mode: 'multi',
    pick: 2,
    options: [
      { id: 'poker', title: 'Кочерга для печи 120 см', note: 'управлять дровами, не обжигаясь' },
      { id: 'thermometer', title: 'Термометр-поплавок', note: 'всегда знаете точную температуру воды' },
      { id: 'broom', title: 'Пихтовый веник', note: 'ароматный и полезный аксессуар для парения' },
      { id: 'bath-set', title: 'Банный набор: шапка и масло', note: 'всё для приятного банного ритуала' },
    ],
  },
]

/** Turns the collected answers into readable lines for the lead. */
export function summariseAnswers(answers: Record<string, string[]>) {
  return quizSteps.reduce<Record<string, string>>((summary, step) => {
    const picked = answers[step.id]
    if (!picked?.length) return summary

    const titles = picked
      .map((id) => step.options.find((option) => option.id === id)?.title)
      .filter((title): title is string => Boolean(title))

    if (titles.length) summary[step.title] = titles.join(', ')
    return summary
  }, {})
}
