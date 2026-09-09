import type { ModelTheme } from '../../data/models'

/**
 * Stands in for a photograph until the real one is supplied. It keeps the
 * slot's proportions and composition — a warm scene with the octagonal
 * silhouette of a tub — so layout and rhythm are judged on the real geometry
 * instead of a grey box. Swapping in a photo means replacing this element.
 */
export type PlaceholderTone = ModelTheme | 'dusk' | 'studio'

const tones: Record<PlaceholderTone, { from: string; to: string; glow: string; silhouette: string }> = {
  ink: { from: '#2b2a28', to: '#121110', glow: '#d9642a', silhouette: '#ffffff' },
  graphite: { from: '#3c3f42', to: '#1b1d1f', glow: '#8fa3ad', silhouette: '#ffffff' },
  copper: { from: '#8e3d18', to: '#3a1809', glow: '#ec9a68', silhouette: '#ffffff' },
  terracotta: { from: '#b84f1f', to: '#632a11', glow: '#f4c09e', silhouette: '#ffffff' },
  olive: { from: '#4a4f3c', to: '#22261c', glow: '#b8c08f', silhouette: '#ffffff' },
  sand: { from: '#d6c3ab', to: '#8e7b64', glow: '#fdf2ea', silhouette: '#3a1809' },
  dusk: { from: '#4a3527', to: '#1a1310', glow: '#e37b40', silhouette: '#ffffff' },
  studio: { from: '#f7f1ea', to: '#e6d8c8', glow: '#ffffff', silhouette: '#45413b' },
}

export function PlaceholderImage({
  tone = 'dusk',
  label,
  ratio = '4/3',
  className = '',
  silhouette = true,
}: {
  tone?: PlaceholderTone
  /** What photograph belongs here, shown as a caption chip. */
  label?: string
  /** Any CSS aspect-ratio value, e.g. '16/9' or '3/4'. */
  ratio?: string
  className?: string
  silhouette?: boolean
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

      {label && (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 text-[0.6875rem] text-white/90 backdrop-blur">
          {label}
        </span>
      )}
    </div>
  )
}
