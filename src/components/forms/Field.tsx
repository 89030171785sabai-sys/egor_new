import type { ReactNode } from 'react'

/**
 * Filled field with the label sitting above the value, the way the brand's
 * forms are set. The error message replaces the label so the row never grows
 * and shifts the layout underneath it.
 */
export function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span
        className={`mb-1 block text-xs ${error ? 'font-medium text-red-600' : 'text-ink-400'}`}
      >
        {error ?? label}
      </span>
      <span
        className={`flex items-center rounded-card border bg-sand-100 px-4 py-3 transition-colors focus-within:border-brand-400 ${
          error ? 'border-red-400' : 'border-transparent'
        }`}
      >
        {children}
      </span>
    </label>
  )
}

const controlClasses =
  'w-full bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-300'

export function Input(props: React.ComponentPropsWithoutRef<'input'>) {
  return <input {...props} className={controlClasses} />
}

export function Select(props: React.ComponentPropsWithoutRef<'select'>) {
  return <select {...props} className={`${controlClasses} appearance-none`} />
}

/** Chips that choose which channel the reply should come through. */
export function ChannelSwitch<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Array<{ id: T; label: string }>
  onChange: (id: T) => void
}) {
  return (
    <div role="radiogroup" aria-label="Как с вами связаться" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          onClick={() => onChange(option.id)}
          className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
            value === option.id
              ? 'bg-brand-100 font-medium text-brand-700'
              : 'text-ink-500 hover:bg-sand-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
