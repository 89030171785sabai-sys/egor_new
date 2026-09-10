import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import { capacityLabel, formatHours, models } from '../../data/models'

/** Slide-out list of the whole model line, opened from the header. */
export function ModelDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        aria-label="Закрыть список моделей"
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-label="Все модели"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
          <h2 className="text-lg font-semibold">Все модели</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-8 place-items-center rounded-full text-ink-400 transition-colors hover:bg-sand-200 hover:text-ink-800"
          >
            <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3.5">
              <path
                d="m2 2 8 8M10 2l-8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <ul className="space-y-5">
            {models.map((model) => (
              <li key={model.slug}>
                <Link to={`/${model.slug}`} onClick={onClose} className="group block">
                  <PlaceholderImage
                    tone={model.theme}
                    ratio="16/10"
                    className="rounded-card"
                    label={model.name}
                    showLabel={false}
                  />
                  <p className="mt-3 font-semibold group-hover:text-brand-600">{model.name}</p>
                  <p className="mt-1 text-sm text-ink-400">Нагрев {formatHours(model.heatingHours)}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {model.sizes.map((size) => (
                      <li
                        key={size}
                        className="rounded-full bg-sand-200 px-2.5 py-1 text-xs text-ink-600"
                      >
                        {capacityLabel(size)}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
