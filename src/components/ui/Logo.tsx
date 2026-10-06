/**
 * Brand lockup, drawn from the company's own sign: the faceted tub with flames
 * on either side, the HOTTUB wordmark and the Russian line beneath. Vector, so
 * it stays crisp at any size and takes the colour of the text around it.
 */
export function Logo({
  size = 'md',
  layout = 'stacked',
  withTagline = true,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  /** `inline` puts the mark beside the words, `stacked` above them. */
  layout?: 'inline' | 'stacked'
  withTagline?: boolean
  className?: string
}) {
  const scale = {
    sm: { mark: 'size-8', word: 'text-sm', tag: 'text-[0.5rem]' },
    md: { mark: 'size-9', word: 'text-base', tag: 'text-[0.5625rem]' },
    lg: { mark: 'size-20', word: 'text-3xl', tag: 'text-xs' },
  }[size]

  const words = (
    <span className="flex flex-col leading-none">
      <span className={`${scale.word} font-semibold tracking-[0.14em]`}>HOTTUB</span>
      {withTagline && (
        <span className={`mt-[0.4em] ${scale.tag} tracking-[0.22em] opacity-70`}>
          горячий чан
        </span>
      )}
    </span>
  )

  if (layout === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <TubMark className={scale.mark} />
        {words}
      </span>
    )
  }

  return (
    <span className={`inline-flex flex-col items-center gap-2 text-center ${className}`}>
      <TubMark className={scale.mark} />
      {words}
    </span>
  )
}

/**
 * The faceted tub between two tongues of flame. Deliberately coarse: at the
 * size the header uses it, finer detail turns to mush.
 */
function TubMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true" className={className} fill="none">
      <g fill="currentColor">
        <path d="M7.5 32c-2.8-3.4-1.6-6.3.6-8.7.1 1.7.7 2.8 1.6 3.5-.2-3.4 1.2-5.8 3.5-7.6-.4 2.9.2 4.8 1.3 6.2 1.6 2 1.7 4.8.1 6.6-1.6 1.8-4.8 1.7-7.1 0Z" />
        <path d="M40.5 32c2.8-3.4 1.6-6.3-.6-8.7-.1 1.7-.7 2.8-1.6 3.5.2-3.4-1.2-5.8-3.5-7.6.4 2.9-.2 4.8-1.3 6.2-1.6 2-1.7 4.8-.1 6.6 1.6 1.8 4.8 1.7 7.1 0Z" />
      </g>

      <rect x="11" y="6" width="26" height="3.6" rx="1.8" fill="currentColor" />
      <path
        d="M13.5 13h21l-2.8 11.5A9 9 0 0 1 24 31a9 9 0 0 1-7.7-6.5L13.5 13Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M24 14v16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}
