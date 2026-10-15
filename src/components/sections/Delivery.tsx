import { SectionHeading } from '../ui/SectionHeading'
import { photoUrl } from '../../lib/photos'
import { ButtonLink } from '../ui/Button'
import { PhotoGallery } from '../ui/Lightbox'
import { Reveal } from '../ui/Reveal'
import { contacts } from '../../data/contacts'

const zones = [
  {
    label: 'Зона 1',
    title: 'Москва и область',
    lead: 'наш водитель',
    text: 'Привозим со своей площадки в Москве до ворот вашего участка. Стоимость зависит от адреса.',
    note: 'Отгрузка со площадки на Очаковском шоссе',
  },
  {
    label: 'Зона 2',
    title: 'Регионы России',
    lead: 'транспортная компания',
    text: 'Отправляем до вашего участка. Дату прибытия и номер накладной сообщаем заранее.',
    note: 'Сроки зависят от расстояния — посчитаем под ваш адрес',
  },
]

/** Who performs each step: ours is filled, the client's is hollow. */
const steps = [
  { title: 'Согласуем площадку', text: 'Пришлём требования к основанию заранее, чтобы к приезду машины всё было готово.', ours: true },
  { title: 'Изготовим за 8 дней', text: 'Собственный цех полного цикла: варим чашу, ставим печь, готовим отделку.', ours: true },
  { title: 'Отгрузим и отправим', text: 'По Москве и области везёт наш водитель, по стране — транспортная компания.', ours: true },
  { title: 'Разгружаете на участке', text: 'Монтаж не выполняем. Поможем найти грузчиков — их услуги оплачиваются отдельно.', ours: false },
  { title: 'Первый протоп', text: 'Ведём по телефону и видеосвязи. Консультируем по уходу бессрочно.', ours: true },
]

/** Photographs from the dispatch yard, in the order they should read. */
const gallery: Array<{ file: string; alt: string }> = [
  {
    file: 'delivery-bowl-pallet.webp',
    alt: 'Чаша чана в плёнке на поддоне, готова к отгрузке',
  },
  {
    file: 'delivery-loading.webp',
    alt: 'Погрузчик загружает чан в плёнке в кузов грузовика на площадке отгрузки',
  },
  {
    file: 'delivery-skidsteer.webp',
    alt: 'Мини-погрузчик снимает чан в плёнке с кузова на участке',
  },
  {
    file: 'delivery-crane.webp',
    alt: 'Чан в плёнке на стропах разгружают на участке у дома',
  },
]

/**
 * The map is always shown. `withPhotos` adds the dispatch photographs under
 * it: the delivery page has them, the home page asks for the section without.
 */
export function Delivery({ withPhotos = true }: { withPhotos?: boolean }) {
  return (
    <section id="delivery" className="scroll-mt-28 py-10 lg:py-14">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <div className="rounded-panel bg-sand-50 p-6 ring-1 ring-sand-200 sm:p-10">
          <div
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center"
          >
            <div>
              <SectionHeading
                eyebrow="Доставка и оплата"
                title={
                  <>
                    Привезём чан
                    <br />
                    в любой город России
                  </>
                }
                subtitle="Отгружаем со своих площадок в Москве и Коркино. По Москве и области привозит наш водитель, по стране — транспортные компании."
              />

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <Stat value="8" unit="дней" caption="под ключ — изготовление и доставка" />
                <Stat value="13" unit="лет" caption="гарантия на каждое изделие" />
              </dl>
            </div>

            {/* On a phone the labels would shrink to nothing, so the map keeps a
                readable width and is swiped sideways instead. */}
            <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <img
                src={photoUrl('delivery-map.webp')}
                alt="Карта России: площадка в Москве, производство в Коркино, доставка по всей стране"
                loading="lazy"
                className="aspect-[1500/827] min-w-[38rem] rounded-panel object-cover ring-1 ring-sand-200 sm:min-w-0 sm:w-full"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {zones.map((zone, index) => (
              <Reveal key={zone.label} delay={index * 80}>
                <div className="h-full rounded-panel bg-white p-6">
                  <p className="text-xs tracking-[0.18em] text-ink-400 uppercase">{zone.label}</p>
                  <h3 className="mt-3 text-xl font-bold text-navy-700">{zone.title}</h3>
                  <p className="font-display mt-3 text-2xl text-brand-600">
                    {zone.lead}
                    <span aria-hidden="true" className="ml-1 inline-block size-1.5 rounded-full bg-brand-500 align-super" />
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{zone.text}</p>
                  <p className="mt-4 flex items-start gap-2 border-t border-sand-200 pt-4 text-sm text-ink-500">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                    {zone.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {withPhotos && gallery.length > 0 && (
            <PhotoGallery
              photos={gallery}
              className={`mt-12 grid gap-4 ${
                gallery.length === 1 ? '' : 'grid-cols-2 lg:grid-cols-4'
              }`}
              thumbClassName={gallery.length === 1 ? 'aspect-4/3 sm:aspect-16/9' : 'aspect-4/5'}
            />
          )}

          <div className="mt-14">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
              <h3 className="text-xl font-bold text-navy-700 sm:text-2xl">Как чан доедет до участка</h3>
              <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-brand-500" />
                  делаем мы
                </span>
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full ring-[1.5px] ring-brand-500 ring-inset"
                  />
                  на вашей стороне, поможем подготовиться
                </span>
              </p>
            </div>

            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
              {steps.map((step, index) => (
                <li key={step.title} className="relative">
                  <span aria-hidden="true" className="block h-px w-full bg-sand-300" />
                  <span
                    aria-hidden="true"
                    className={`mt-3 block size-2 rounded-full ${
                      step.ours ? 'bg-brand-500' : 'ring-[1.5px] ring-brand-500 ring-inset'
                    }`}
                  />
                  <p className="mt-3 text-sm font-semibold text-brand-500">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h4 className="mt-1 font-semibold text-navy-700">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-sand-300 pt-8">
              <p className="max-w-md text-ink-600">
                Не нашли свой город? Назовите — посчитаем доставку и сроки за 15 минут.
              </p>
              <div className="ml-auto flex flex-wrap items-center gap-5">
                <ButtonLink to="/contacts" size="lg">
                  Рассчитать доставку
                </ButtonLink>
                <p>
                  <a href={contacts.phone.href} className="text-lg font-bold">
                    {contacts.phone.display}
                  </a>
                  <span className="block text-xs text-ink-400">быстрый ответ</span>
                </p>
              </div>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-ink-400">
              * Монтаж и установку мы не выполняем. При необходимости поможем организовать
              грузчиков для разгрузки — их услуги оплачиваются отдельно, за счёт клиента. Сроки
              доставки зависят от расстояния.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, unit, caption }: { value: string; unit: string; caption: string }) {
  return (
    <div className="rounded-panel bg-white p-5">
      <dt className="sr-only">{caption}</dt>
      <dd>
        <span className="font-display text-4xl">{value}</span>{' '}
        <span className="text-sm text-ink-400">{unit}</span>
        <span
          aria-hidden="true"
          className="ml-1 inline-block size-1.5 rounded-full bg-brand-500 align-super"
        />
        <p className="mt-2 text-sm text-ink-500">{caption}</p>
      </dd>
    </div>
  )
}
