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
      { id: 'small', title: 'Малый — 175 см', note: 'до 4 человек: компактный вариант для семьи или пары' },
      { id: 'medium', title: 'Средний — 210 см', note: 'до 6 человек: оптимально для дружеских посиделок' },
      { id: 'large', title: 'Большой — 235 см', note: 'до 9 человек: просторный чан для большой компании' },
      { id: 'maxi', title: 'Огромный — 250 см', note: 'до 14 человек: для мероприятий и банных комплексов' },
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
        note: 'техническая марка, срок службы 20–25 лет. Проверенный выбор по разумной цене',
      },
      {
        id: 'aisi-304',
        title: 'Нержавеющая сталь AISI 304',
        note: 'пищевая марка, срок службы 45–50 лет. Не ржавеет и сохраняет вид десятилетиями',
      },
    ],
  },
  {
    id: 'finish',
    title: 'Отделка',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'standard', title: 'Лиственница — базовая отделка', note: 'входит в комплект: чаша с отделкой и спинки под углом 67°', tone: 'sand' },
      { id: 'thermo', title: 'Термодерево', note: 'тёмный тон, устойчиво к влаге и перепадам температур', tone: 'ink' },
      { id: 'painted', title: 'Термостойкая покраска', note: 'матовый чёрный по металлу, без деревянной обшивки', tone: 'graphite' },
      { id: 'undecided', title: 'Пока не определились', note: 'подберём вместе с менеджером', tone: 'studio' },
    ],
  },
  {
    id: 'stove',
    title: 'Тип печи',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'hearth', title: 'Открытый очаг с ветрозащитой', note: 'базовое решение «Графита», нагрев 5 часов', tone: 'graphite' },
      { id: 'enlarged', title: 'Увеличенная или разборная печь', note: 'чугунный колосник и зольный ящик, нагрев 3 часа', tone: 'ink' },
      { id: 'water-circuit', title: 'Печь с водяным контуром', note: 'змеевик и ускоренный нагрев за 1,5 часа', tone: 'jade' },
      { id: 'external', title: 'Выносная печь', note: 'топка в стороне от чаши, подключение шлангами', tone: 'olive' },
      { id: 'side', title: 'Боковая приварная расширенная', note: 'теплосъёмные трубы, низкий борт, вертикальная загрузка', tone: 'terracotta' },
    ],
  },
  {
    id: 'chimney',
    title: 'Дымоход',
    mode: 'single',
    withImages: true,
    options: [
      { id: 'three-meters', title: 'Дымоход 3 м и защитный экран', note: 'высокая тяга и защита от случайных ожогов', tone: 'studio' },
      { id: 'two-meters', title: 'Дымоход 2 м', note: 'комплектация моделей с выносной печью', tone: 'studio' },
      { id: 'sandwich', title: 'Дымоход 1 м и 1 м сэндвич-трубы', note: 'утеплённая вставка снижает нагрев трубы — безопаснее', tone: 'studio' },
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
