import { formatPrice, promo } from '../../data/models'

export function GraphiteOffer({ className = '' }: { className?: string }) {
  return (
    <div className={`w-fit max-w-full rounded-card bg-brand-50 px-4 py-3 text-brand-800 ${className}`}>
      <p className="text-sm font-semibold">Выгодное предложение</p>
      <p className="mt-1 text-sm">
        <span className="inline-block">{promo.cm} см</span>
        {' · '}
        <strong className="inline-block text-base text-ink-900">{formatPrice(promo.price)}</strong>
        {' '}
        <span className="inline-block text-ink-500">вместо <s>{formatPrice(promo.was)}</s></span>
      </p>
      <p className="mt-1 text-xs font-semibold">Экономия {formatPrice(promo.was - promo.price)}</p>
    </div>
  )
}
