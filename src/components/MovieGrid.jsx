import { useState } from 'react'
import {
  YEAR_FILTER_DEFAULT_MAX,
  YEAR_FILTER_DEFAULT_MIN,
} from '../api/movies'
import {
  FIRST_PAGE_ANIMATION_COUNT,
  GRID_CLASS,
  LOAD_MORE_SKELETON_COUNT,
  SKELETON_COUNT,
  YEAR_DEBOUNCE_MS,
} from '../constants'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useMovies } from '../hooks/useMovies'
import GenreFilter from './GenreFilter'
import MovieCard from './MovieCard'
import MovieCardSkeleton from './MovieCardSkeleton'
import YearFilter from './YearFilter'

function MovieGrid() {
  const [minYear, setMinYear] = useState(YEAR_FILTER_DEFAULT_MIN)
  const [maxYear, setMaxYear] = useState(YEAR_FILTER_DEFAULT_MAX)
  const [selectedGenreIds, setSelectedGenreIds] = useState([])

  const debouncedMinYear = useDebouncedValue(minYear, YEAR_DEBOUNCE_MS)
  const debouncedMaxYear = useDebouncedValue(maxYear, YEAR_DEBOUNCE_MS)
  const isPendingFetch =
    minYear !== debouncedMinYear || maxYear !== debouncedMaxYear

  const {
    movies,
    loading,
    loadingMore,
    error,
    hasMore,
    resultsKey,
    loadMoreRef,
    showInitialSkeleton,
    showGrid,
  } = useMovies({
    debouncedMinYear,
    debouncedMaxYear,
    selectedGenreIds,
  })

  const isRefetching = (loading || isPendingFetch) && showGrid

  return (
    <>
      <YearFilter
        minYear={minYear}
        maxYear={maxYear}
        onChange={({ minYear: nextMin, maxYear: nextMax }) => {
          setMinYear(nextMin)
          setMaxYear(nextMax)
        }}
        isUpdating={isRefetching}
      />

      <GenreFilter
        selectedGenreIds={selectedGenreIds}
        onChange={setSelectedGenreIds}
      />

      {showInitialSkeleton && (
        <section
          className={`${GRID_CLASS} skeleton-grid-enter`}
          aria-busy="true"
          aria-label="Loading movies"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      )}

      {!showInitialSkeleton && error && movies.length === 0 && (
        <p className="py-16 text-center text-red-400">{error}</p>
      )}

      {!showInitialSkeleton && !error && !showGrid && !loading && (
        <p className="py-16 text-center text-slate-400">
          No movies found for the selected filters.
        </p>
      )}

      {showGrid && (
        <>
          <section
            key={resultsKey}
            className={`${GRID_CLASS} movies-grid-enter transition-opacity duration-500 ease-in-out ${
              isRefetching ? 'opacity-50' : 'opacity-100'
            }`}
            aria-busy={isRefetching || loadingMore}
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={
                  index < FIRST_PAGE_ANIMATION_COUNT ? 'movie-card-enter' : ''
                }
                style={
                  index < FIRST_PAGE_ANIMATION_COUNT
                    ? {
                        animationDelay: `${Math.min(index, 14) * 70}ms`,
                      }
                    : undefined
                }
              >
                <MovieCard {...movie} />
              </div>
            ))}

            {loadingMore &&
              Array.from({ length: LOAD_MORE_SKELETON_COUNT }, (_, index) => (
                <MovieCardSkeleton key={`loading-more-${index}`} />
              ))}
          </section>

          <div ref={loadMoreRef} className="h-px w-full" aria-hidden="true" />

          {error && movies.length > 0 && (
            <p className="pb-8 text-center text-sm text-red-400">{error}</p>
          )}

          {!hasMore && !loading && (
            <p className="pb-10 text-center text-sm text-slate-500">
              No more movies to load
            </p>
          )}
        </>
      )}
    </>
  )
}

export default MovieGrid
