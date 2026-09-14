import type { ModelTheme } from '../../data/models'

/**
 * Stands in for a photograph until the real one is supplied. It keeps the
 * slot's proportions and composition — a warm scene with the octagonal
 * silhouette of a tub — so layout and rhythm are judged on the real geometry
 * instead of a grey box. Swapping in a photo means replacing this element.
 */
export type PlaceholderTone = ModelTheme | 'dusk' | 'studio'

const tones: Record<PlaceholderTone, { from: string; to: string; glow: string; silhouette: string }> = {
  ink: { from: '#23262a', to: '#0b0b0b', glow: '#f1602e', silhouette: '#ffffff' },
  graphite: { from: '#454b52', to: '#1b1e21', glow: '#93a0ad', silhouette: '#ffffff' },
  copper: { from: '#a63715', to: '#431507', glow: '#ff9a73', silhouette: '#ffffff' },
  terracotta: { from: '#d2481b', to: '#74260e', glow: '#ffbea3', silhouette: '#ffffff' },
  olive: { from: '#3f4a44', to: '#1b211e', glow: '#a9b8ae', silhouette: '#ffffff' },
  sand: { from: '#c3c9d1', to: '#7a828c', glow: '#f5f6f8', silhouette: '#131517' },
  dusk: { from: '#3f3128', to: '#171310', glow: '#f97b4c', silhouette: '#ffffff' },
  studio: { from: '#f5f6f8', to: '#dee1e6', glow: '#ffffff', silhouette: '#43484e' },
}

export function PlaceholderImage({
  tone = 'dusk',
  label,
  ratio = '4/3',
  className = '',
  silhouette = true,
  showLabel = true,
}: {
  tone?: PlaceholderTone
  /** What photograph belongs here. Always announced, shown when it fits. */
  label?: string
  /** Any CSS aspect-ratio value, e.g. '16/9' or '3/4'. */
  ratio?: string
  className?: string
  silhouette?: boolean
  /** Off for slots too small or too round to carry the caption chip. */
  showLabel?: boolean
}) {
  const palette = tones[tone]
  // The caption is positioned against this element, so it has to be a
  // containing block. `absolute` from the caller serves that too — and would
  // otherwise lose to a hardcoded `relative`, which wins on stylesheet order
  // rather than class order.
  const positioning = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative'

  return (
    <div
      className={`${positioning} isolate overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
      role="img"
      aria-label={label ? `Место для фотографии: ${label}` : 'Место для фотографии'}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(60% 55% at 62% 30%, ${palette.glow}55 0%, transparent 70%)`,
        }}
      />

      {silhouette && (
        <svg
          aria-hidden="true"
          viewBox="0 0 200 130"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 h-3/5 w-full opacity-25"
        >
          {/* Octagonal bowl on a stove base, seen from the front. */}
          <path
            d="M42 52h116l-16 40a14 14 0 0 1-12 7H70a14 14 0 0 1-12-7L42 52Z"
            fill="none"
            stroke={palette.silhouette}
            strokeWidth="1.5"
          />
          <path d="M38 52h124" stroke={palette.silhouette} strokeWidth="3" strokeLinecap="round" />
          <path
            d="M84 99h32v14a6 6 0 0 1-6 6H90a6 6 0 0 1-6-6V99Z"
            fill="none"
            stroke={palette.silhouette}
            strokeWidth="1.5"
          />
          <path
            d="M148 30v22"
            stroke={palette.silhouette}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {label && showLabel && (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 text-[0.6875rem] text-white/90 backdrop-blur">
          {label}
        </span>
      )}
    </div>
  )
}
