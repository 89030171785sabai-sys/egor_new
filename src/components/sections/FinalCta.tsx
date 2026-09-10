import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function FinalCta() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <Reveal>
          <div className="rounded-panel bg-brand-500 px-6 py-14 text-center sm:px-12 lg:py-20">
            <h2 className="font-display mx-auto max-w-3xl text-[2rem] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
              Вышлем полный каталог и рассчитаем стоимость
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/85">
              Оставьте заявку — пришлём каталог, рассчитаем стоимость и ответим на вопросы.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/#calculator" variant="dark" size="lg">
                Получить каталог
              </ButtonLink>
              <ButtonLink to="/contacts" variant="ghost" size="lg">
                Заказать звонок
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
