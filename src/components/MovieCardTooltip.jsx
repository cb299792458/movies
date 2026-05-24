import { createPortal } from 'react-dom'

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

  return createPortal(
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
    </div>,
    document.body,
  )
}

export default MovieCardTooltip
