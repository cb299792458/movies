import { useState } from 'react'

const TOOLTIP_WIDTH = 288
const TOOLTIP_OFFSET = 16
const TOOLTIP_ESTIMATED_HEIGHT = 220

function getRatingBadgeStyle(voteAverage) {
  const rating = Math.min(10, Math.max(0, voteAverage))
  const scale = (rating / 10) ** 1.35

  let backgroundColor = 'rgb(51 65 85 / 0.92)'
  let boxShadow = '0 1px 3px rgb(0 0 0 / 0.25)'

  if (rating >= 8) {
    backgroundColor = 'rgb(5 150 105 / 0.95)'
    boxShadow = '0 3px 14px rgb(16 185 129 / 0.6)'
  } else if (rating >= 7) {
    backgroundColor = 'rgb(217 119 6 / 0.95)'
    boxShadow = '0 2px 10px rgb(245 158 11 / 0.55)'
  } else if (rating >= 6) {
    backgroundColor = 'rgb(71 85 105 / 0.92)'
  }

  return {
    fontSize: `${0.6 + scale * 1.15}rem`,
    padding: `${0.2 + scale * 0.4}rem ${0.4 + scale * 0.85}rem`,
    backgroundColor,
    boxShadow,
    fontWeight: rating >= 7 ? 700 : 600,
    lineHeight: 1.1,
  }
}

function getTooltipPosition(clientX, clientY) {
  let x = clientX + TOOLTIP_OFFSET
  let y = clientY + TOOLTIP_OFFSET

  if (x + TOOLTIP_WIDTH > window.innerWidth - 8) {
    x = clientX - TOOLTIP_WIDTH - TOOLTIP_OFFSET
  }

  if (y + TOOLTIP_ESTIMATED_HEIGHT > window.innerHeight - 8) {
    y = clientY - TOOLTIP_ESTIMATED_HEIGHT - TOOLTIP_OFFSET
  }

  return {
    x: Math.max(8, x),
    y: Math.max(8, y),
  }
}

function MovieCardTooltip({
  visible,
  x,
  y,
  title,
  voteAverage,
  voteCount,
  voteCountRaw,
  releaseYear,
  genres,
  overviewText,
}) {
  if (!visible) return null

  return (
    <div
      role="tooltip"
      style={{ left: x, top: y }}
      className="pointer-events-none fixed z-[9999] w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-600 bg-slate-900 p-4 text-left text-sm text-slate-100 shadow-2xl"
    >
      <p className="text-base font-semibold leading-snug text-white">{title}</p>
      <dl className="mt-2 space-y-1 text-xs text-slate-300">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Rating</dt>
          <dd>★ {voteAverage.toFixed(1)} / 10</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Votes</dt>
          <dd>
            {(voteCountRaw ?? 0).toLocaleString()} ({voteCount})
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Year</dt>
          <dd>{releaseYear}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Genres</dt>
          <dd className="mt-0.5 text-slate-200">{genres || 'N/A'}</dd>
        </div>
      </dl>
      <p className="mt-3 max-h-40 overflow-y-auto text-xs leading-relaxed text-slate-300">
        {overviewText}
      </p>
    </div>
  )
}

function MovieCard({
  tmdbUrl,
  title,
  posterUrl,
  genres,
  releaseYear,
  voteAverage,
  voteCount,
  voteCountRaw,
  overview,
}) {
  const ratingBadgeStyle = getRatingBadgeStyle(voteAverage)
  const overviewText = overview || 'No overview available.'
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 })

  const handleMouseMove = (event) => {
    const { x, y } = getTooltipPosition(event.clientX, event.clientY)
    setTooltip({ visible: true, x, y })
  }

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 })
  }

  return (
    <>
      <MovieCardTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        title={title}
        voteAverage={voteAverage}
        voteCount={voteCount}
        voteCountRaw={voteCountRaw}
        releaseYear={releaseYear}
        genres={genres}
        overviewText={overviewText}
      />

      <a
        href={tmdbUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${title} on TMDB`}
        onMouseEnter={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative z-0 block w-full cursor-pointer no-underline transition-[z-index] duration-300 hover:z-20"
      >
        <div
          className="pointer-events-none absolute -inset-3 rounded-2xl bg-amber-400/0 opacity-0 blur-2xl transition-all duration-300 group-hover:bg-amber-400/50 group-hover:opacity-100"
          aria-hidden="true"
        />

        <article className="relative flex w-full scale-100 flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-white/10 transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-500/25 group-hover:ring-amber-400/40">
          <div className="relative aspect-[2/3] bg-gray-200">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No poster
              </div>
            )}
            <span
              className="absolute right-2 top-2 rounded-full text-white ring-2 ring-white/50"
              style={ratingBadgeStyle}
              aria-hidden="true"
            >
              ★ {voteAverage.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <h2 className="line-clamp-2 min-h-11 text-base font-semibold leading-snug text-gray-900">
              {title}
            </h2>

            <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-snug text-gray-600">
              {overviewText}
            </p>

            <dl className="mt-auto space-y-1.5 text-sm text-gray-600">
              <div>
                <dt className="sr-only">Genre</dt>
                <dd className="line-clamp-1 min-h-5 leading-5">
                  {genres || 'N/A'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                <div>
                  <dt className="sr-only">Release year</dt>
                  <dd>{releaseYear}</dd>
                </div>
                <div>
                  <dt className="sr-only">Vote count</dt>
                  <dd>{voteCount} votes</dd>
                </div>
              </div>
            </dl>
          </div>
        </article>
      </a>
    </>
  )
}

export default MovieCard
