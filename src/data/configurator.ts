export interface ConfigOption {
  id: string
  label: string
  note?: string
}

export interface ConfigGroup {
  id: string
  label: string
  hint?: string
  kind: 'single' | 'multi'
  options: ConfigOption[]
}

const interiorGroup: ConfigGroup = {
  id: 'interior',
  label: 'Отделка внутри чана',
  kind: 'single',
  options: [
    { id: 'standard', label: 'Стандарт', note: 'Пол, лавочки и верхняя окантовка' },
    { id: 'standard-plus', label: 'Стандарт плюс', note: 'Пол, лавочки, верхняя окантовка и дополнительный ряд под спину' },
    { id: 'premium', label: 'Премиум', note: 'Пол, лавочки из нержавеющей стали и верхняя окантовка' },
    { id: 'luxury', label: 'Люкс', note: 'Пол и верхняя окантовка из полимерной доски, лавочки из нержавеющей стали' },
    { id: 'none', label: 'Без дерева' },
  ],
}

const ladderGroup: ConfigGroup = {
  id: 'ladder',
  label: 'Лестница',
  kind: 'single',
  options: [
    { id: 'metal', label: 'Как в комплекте модели' },
    { id: 'straight', label: 'Лестница прямая металлическая' },
    { id: 'frame', label: 'Лестница на металлокаркасе с площадкой' },
    { id: 'hangers', label: 'Лестница на металлокаркасе с вешалками' },
    { id: 'none', label: 'Без лестницы' },
  ],
}

const chimneyGroup: ConfigGroup = {
  id: 'chimney',
  label: 'Дымоход',
  kind: 'single',
  options: [
    { id: 'steel', label: 'Дымоход 3 м + защитный экран' },
    { id: 'sandwich', label: 'Дымоход 2 м + сэндвич-труба' },
    { id: 'none', label: 'Без дымохода' },
  ],
}

const lidGroup: ConfigGroup = {
  id: 'lid',
  label: 'Крышка',
  kind: 'single',
  options: [
    { id: 'cover', label: 'Термочехол' },
    { id: 'thermo', label: 'Термокрышка жёсткая' },
    { id: 'wood', label: 'Крышка из лиственницы, две половины' },
    { id: 'none', label: 'Без крышки' },
  ],
}

const extrasGroup: ConfigGroup = {
  id: 'extras',
  label: 'Дополнительные опции',
  hint: 'Можно выбрать несколько.',
  kind: 'multi',
  options: [
    { id: 'light', label: 'Подсветка безопасная' },
    { id: 'light-outer', label: 'Внешняя подсветка' },
    { id: 'table', label: 'Стол по центру' },
    { id: 'table-side', label: 'Боковой стол' },
    { id: 'headrest', label: 'Подголовник' },
    { id: 'step', label: 'Ступенька в чан' },
    { id: 'jacuzzi', label: 'Джакузи' },
    { id: 'hydro', label: 'Гидро / аэро массаж' },
    { id: 'burner', label: 'Газовая горелка 100 кВт' },
    { id: 'thermo-welded', label: 'Термометр приварной' },
    { id: 'thermo-float', label: 'Термометр поплавок + часы' },
    { id: 'emblem', label: 'Эмблема' },
  ],
}

export const optionGroups: ConfigGroup[] = [
  interiorGroup,
  ladderGroup,
  chimneyGroup,
  lidGroup,
  extrasGroup,
]

export const defaultSelection: Record<string, string[]> = {
  interior: ['standard'],
  ladder: ['metal'],
  chimney: ['steel'],
  lid: ['none'],
  extras: [],
}

/** “Нефрит” opens the configurator: it is the client's bestseller. */
export const defaultModelSlug = 'nefrit'
