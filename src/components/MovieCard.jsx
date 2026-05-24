import { useState } from 'react'
import { getRatingBadgeStyle } from '../utils/ratingBadge'
import { getTooltipPosition } from '../utils/tooltip'
import MovieCardTooltip from './MovieCardTooltip'

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
        className="group relative z-0 block w-full cursor-pointer no-underline transition-[z-index] duration-500 hover:z-20"
      >
        <div
          className="pointer-events-none absolute -inset-3 rounded-2xl bg-amber-400/0 opacity-0 blur-2xl transition-all duration-500 ease-out group-hover:bg-amber-400/50 group-hover:opacity-100"
          aria-hidden="true"
        />

        <article className="relative flex w-full scale-100 flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-white/10 transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-500/25 group-hover:ring-amber-400/40">
          <div className="relative aspect-[2/3] bg-gray-200">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt=""
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
