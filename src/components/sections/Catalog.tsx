import { useMemo, useState } from 'react'
import { SectionHeading } from '../ui/SectionHeading'
import { ModelCard } from '../ui/ModelCard'
import { Reveal } from '../ui/Reveal'
import {
  capacities,
  capacityLabel,
  formatPrice,
  models,
  priceFrom,
  type Capacity,
} from '../../data/models'

export function Catalog() {
  const [size, setSize] = useState<Capacity | 'all'>('all')

  const shown = useMemo(
    () => (size === 'all' ? models : models.filter((model) => model.sizes.includes(size))),
    [size],
  )

  return (
    <section id="catalog" className="scroll-mt-28 py-20 lg:py-28">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6">
        <SectionHeading
          eyebrow="Каталог"
          title="Выберите свой чан"
          subtitle={`Цены от ${formatPrice(priceFrom)} за полный комплект. Итоговая стоимость зависит от размера, отделки и типа печи — считаем проект под ваш участок.`}
        />

        <div
          role="radiogroup"
          aria-label="Фильтр по вместимости"
          className="mt-8 flex flex-wrap gap-2"
        >
          <FilterChip active={size === 'all'} onClick={() => setSize('all')}>
            Все размеры
          </FilterChip>
          {capacities.map((capacity) => (
            <FilterChip
              key={capacity}
              active={size === capacity}
              onClick={() => setSize(capacity)}
            >
              {capacityLabel(capacity)}
              <PersonIcon />
            </FilterChip>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {shown.map((model, index) => (
            <Reveal key={model.slug} delay={(index % 2) * 90}>
              <ModelCard model={model} />
            </Reveal>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="mt-10 rounded-panel bg-white p-8 text-center text-ink-500">
            В этом размере готовых моделей нет — сделаем под заказ. Оставьте заявку, посчитаем.
          </p>
        )}
      </div>
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-ink-800 text-white'
          : 'bg-white text-ink-600 ring-1 ring-sand-300 hover:bg-sand-200'
      }`}
    >
      {children}
    </button>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 opacity-70">
      <circle cx="6" cy="3.5" r="1.9" fill="currentColor" />
      <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="currentColor" />
    </svg>
  )
}
