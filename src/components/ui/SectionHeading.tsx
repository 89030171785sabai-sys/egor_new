import type { ReactNode } from 'react'

/**
 * Section heading in the brand's three-part form: an accent eyebrow, a display
 * serif title in caps, and an optional subtitle.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'dark',
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const titleColor = tone === 'light' ? 'text-white' : 'text-ink-900'
  const subtitleColor = tone === 'light' ? 'text-white/70' : 'text-ink-500'

  return (
    <div className={`${alignment} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl uppercase sm:text-4xl lg:text-5xl ${titleColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed ${subtitleColor} ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
