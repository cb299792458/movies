import { useState } from 'react'
import {
  YEAR_FILTER_MAX,
  YEAR_FILTER_MIN,
} from '../api/movies'

function yearToPercent(year) {
  return ((year - YEAR_FILTER_MIN) / (YEAR_FILTER_MAX - YEAR_FILTER_MIN)) * 100
}

function YearFilter({ minYear, maxYear, onChange, isUpdating }) {
  const [activeThumb, setActiveThumb] = useState(null)
  const minPercent = yearToPercent(minYear)
  const maxPercent = yearToPercent(maxYear)
  const thumbsClose = maxYear - minYear <= 1

  const minZIndex =
    activeThumb === 'min' || (thumbsClose && activeThumb !== 'max') ? 5 : 3
  const maxZIndex =
    activeThumb === 'max' || (thumbsClose && activeThumb !== 'min') ? 5 : 4

  const updateMin = (nextMin) => {
    onChange({
      minYear: Math.min(nextMin, maxYear),
      maxYear,
    })
  }

  const updateMax = (nextMax) => {
    onChange({
      minYear,
      maxYear: Math.max(nextMax, minYear),
    })
  }

  return (
    <section className="border-b border-slate-700 bg-slate-800/80 px-2 py-4 sm:px-4">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="w-28 shrink-0 sm:w-36">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Release year
          </h2>
          <p className="mt-0.5 text-lg font-medium text-white">
            {minYear} – {maxYear}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="w-10 shrink-0 text-right text-xs tabular-nums text-slate-500"
            aria-hidden="true"
          >
            {YEAR_FILTER_MIN}
          </span>

          <div className="year-range min-w-0 flex-1">
            <div className="year-range__track" aria-hidden="true">
              <div
                className="year-range__fill"
                style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                }}
              />
            </div>

            <input
              type="range"
              min={YEAR_FILTER_MIN}
              max={YEAR_FILTER_MAX}
              step={1}
              value={minYear}
              onInput={(event) => updateMin(Number(event.target.value))}
              onPointerDown={() => setActiveThumb('min')}
              onPointerUp={() => setActiveThumb(null)}
              onPointerCancel={() => setActiveThumb(null)}
              onBlur={() => setActiveThumb(null)}
              style={{ zIndex: minZIndex }}
              className="year-range__input"
              aria-label="Release year start"
              aria-valuemin={YEAR_FILTER_MIN}
              aria-valuemax={YEAR_FILTER_MAX}
              aria-valuenow={minYear}
              aria-valuetext={`${minYear}`}
            />
            <input
              type="range"
              min={YEAR_FILTER_MIN}
              max={YEAR_FILTER_MAX}
              step={1}
              value={maxYear}
              onInput={(event) => updateMax(Number(event.target.value))}
              onPointerDown={() => setActiveThumb('max')}
              onPointerUp={() => setActiveThumb(null)}
              onPointerCancel={() => setActiveThumb(null)}
              onBlur={() => setActiveThumb(null)}
              style={{ zIndex: maxZIndex }}
              className="year-range__input"
              aria-label="Release year end"
              aria-valuemin={YEAR_FILTER_MIN}
              aria-valuemax={YEAR_FILTER_MAX}
              aria-valuenow={maxYear}
              aria-valuetext={`${maxYear}`}
            />
          </div>

          <span
            className="w-10 shrink-0 text-xs tabular-nums text-slate-500"
            aria-hidden="true"
          >
            {YEAR_FILTER_MAX}
          </span>
        </div>

        {isUpdating && (
          <p className="shrink-0 text-xs text-slate-400 sm:text-sm">
            Updating…
          </p>
        )}
      </div>
    </section>
  )
}

export default YearFilter
