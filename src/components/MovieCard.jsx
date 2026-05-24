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

function MovieCard({ title, posterUrl, genres, releaseYear, voteAverage }) {
  const ratingBadgeStyle = getRatingBadgeStyle(voteAverage)
  return (
    <div className="group relative z-0 w-full transition-[z-index] duration-300 hover:z-10">
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
            aria-label={`Rating ${voteAverage.toFixed(1)} out of 10`}
          >
            ★ {voteAverage.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="line-clamp-2 min-h-11 text-base font-semibold leading-snug text-gray-900">
            {title}
          </h2>

          <dl className="mt-auto space-y-1.5 text-sm text-gray-600">
            <div>
              <dt className="sr-only">Genre</dt>
              <dd className="line-clamp-1 min-h-5 leading-5" title={genres}>
                {genres || 'N/A'}
              </dd>
            </div>
            <div className="text-xs text-gray-500">
              <dt className="sr-only">Release year</dt>
              <dd>{releaseYear}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  )
}

export default MovieCard
