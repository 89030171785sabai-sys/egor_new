import { useState } from 'react'
import { ButtonLink } from '../ui/Button'
import { photoUrl } from '../../lib/photos'

const options: Array<{ title: string; text: string }> = [
  {
    title: 'Изменим размеры под вас',
    text: 'Чаша делается под компанию: от четырёх человек до двенадцати. Габариты подгоняем под площадку.',
  },
  {
    title: 'Заменим материалы отделки',
    text: 'Четыре уровня отделки — от базового «стандарта» до «люкса» с премиальными материалами.',
  },
  {
    title: 'Добавим дополнительные опции',
    text: 'Джакузи и гидро-аэромассаж, подсветка воды, столы, подголовник, стекло в печь, логотип на чашу.',
  },
]

export function Customization() {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-ink-900 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <h2 className="font-display mx-auto max-w-3xl text-center text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem]">
          <span className="text-brand-400">Место силы</span>
          <span className="text-sand-100">, отдыха и общения</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-white/65">
          Чан стоит под открытым небом: вы дышите свежим воздухом и не перегреваете голову, а
          значит парение получается мягче и дольше. Каждое изделие разрабатываем под ваш участок.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-12">
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

            <div className="mt-10 border-t border-white/10 pt-8">
              <h3 className="font-display text-2xl text-white sm:text-3xl">
                Рассчитайте свой банный чан в калькуляторе
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                Модель, размер, отделка, лестница, дымоход, крышка и опции — цена пересчитывается
                сразу, расчёт пришлём в удобный канал.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to="/calculator" size="lg" arrow>
                  Открыть калькулятор
                </ButtonLink>
                <ButtonLink to="/contacts" variant="ghost" size="lg">
                  Обсудить свой проект
                </ButtonLink>
              </div>
            </div>
          </div>

          {/*
            * One photograph for the whole section rather than a drawing per
            * option: it is the same tub whichever line is open, and a real
            * scene says more about what the thing is for than four tinted
            * illustrations did.
            */}
          {/* On a phone the photograph runs edge to edge and taller than the
              column: a postcard-sized picture of people in a tub says little. */}
          <img
            src={photoUrl('customization-scene.webp')}
            alt="Компания отдыхает в банном чане на участке"
            loading="lazy"
            className="-mx-4 aspect-4/3 w-[calc(100%+2rem)] max-w-none object-cover sm:mx-0 sm:w-full sm:max-w-full sm:rounded-panel lg:aspect-auto lg:h-full lg:min-h-[36rem]"
          />
        </div>
      </div>
    </section>
  )
}
