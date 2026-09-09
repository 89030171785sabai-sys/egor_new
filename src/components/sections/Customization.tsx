import { useState } from 'react'
import { ButtonLink } from '../ui/Button'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import type { PlaceholderTone } from '../ui/PlaceholderImage'

const options: Array<{ title: string; text: string; tone: PlaceholderTone }> = [
  {
    title: 'Покрасим изделие в любой цвет',
    text: 'Предложим цвета под ваш дом и участок или покрасим в любой оттенок на ваш выбор.',
    tone: 'terracotta',
  },
  {
    title: 'Изменим размеры под вас',
    text: 'Чаша делается под компанию: от четырёх человек до двенадцати. Габариты подгоняем под площадку.',
    tone: 'graphite',
  },
  {
    title: 'Заменим материалы отделки',
    text: 'Четыре уровня отделки — от базового «стандарта» до «люкса» с премиальными материалами.',
    tone: 'copper',
  },
  {
    title: 'Добавим дополнительные опции',
    text: 'Джакузи и гидро-аэромассаж, подсветка воды, столы, подголовник, стекло в печь, логотип на чашу.',
    tone: 'ink',
  },
]

export function Customization() {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-ink-900 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <h2 className="font-display mx-auto max-w-3xl text-center text-3xl uppercase sm:text-4xl lg:text-5xl">
          <span className="text-brand-400">Место силы</span>
          <span className="text-sand-100">, отдыха и общения</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-white/65">
          Чан стоит под открытым небом: вы дышите свежим воздухом и не перегреваете голову, а
          значит парение получается мягче и дольше. Каждое изделие разрабатываем под ваш участок.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <div className="space-y-3">
              {options.map((option, index) => {
                const open = active === index

                return (
                  <div key={option.title}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setActive(index)}
                      className={`flex w-full items-center gap-4 rounded-panel px-5 py-4 text-left transition-colors ${
                        open ? 'bg-ink-700' : 'bg-ink-800/70 hover:bg-ink-800'
                      }`}
                    >
                      {!open && (
                        <span
                          aria-hidden="true"
                          className="relative grid size-6 shrink-0 place-items-center rounded-full ring-1 ring-white/25"
                        >
                          <span className="absolute h-[1.5px] w-3 bg-white/70" />
                          <span className="absolute h-3 w-[1.5px] bg-white/70" />
                        </span>
                      )}
                      <span className="font-semibold text-white">{option.title}</span>
                    </button>

                    {open && (
                      <p className="px-5 pt-3 pb-1 text-sm leading-relaxed text-white/65">
                        {option.text}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <ButtonLink to="/#contacts" variant="light" size="lg" arrow className="mt-8">
              Обсудить свой проект
            </ButtonLink>
          </div>

          <PlaceholderImage
            tone={options[active].tone}
            ratio="4/3"
            className="rounded-panel"
            label={options[active].title}
          />
        </div>
      </div>
    </section>
  )
}
