import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'dark' | 'light' | 'ghost' | 'outline'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  dark: 'bg-ink-800 text-white hover:bg-ink-900',
  light: 'bg-white text-ink-800 hover:bg-sand-100',
  ghost: 'bg-white/15 text-white backdrop-blur hover:bg-white/25',
  outline: 'border border-sand-300 text-ink-800 hover:bg-sand-200',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60'

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Appends the arrow glyph the brand puts inside its calls to action. */
  arrow?: boolean
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  children,
  to,
  ...rest
}: CommonProps & { to: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )

  // Only same-page and external targets stay plain anchors. Anything starting
  // with a slash — hash included — goes through the router, which applies the
  // base path the site is served from.
  if (to.startsWith('#') || to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:')) {
    return (
      <a href={to} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {content}
    </Link>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3">
      <path
        d="M3 9 9 3M9 3H4.5M9 3v4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
