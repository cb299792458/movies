import { useEffect, useState } from 'react'
import {
  fetchDiscoverMovies,
  fetchMovieGenres,
  formatVoteCount,
  getGenreNames,
  getPosterUrl,
  getReleaseYear,
  getTmdbMovieUrl,
  YEAR_FILTER_DEFAULT_MAX,
  YEAR_FILTER_DEFAULT_MIN,
} from '../api/movies'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import GenreFilter from './GenreFilter'
import MovieCard from './MovieCard'
import MovieCardSkeleton from './MovieCardSkeleton'
import YearFilter from './YearFilter'

const SKELETON_COUNT = 10
const YEAR_DEBOUNCE_MS = 350
const GRID_CLASS =
  'grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-8 px-2 py-8 sm:px-4'

function mapMovies(results, genreMap) {
  return results.map((movie) => ({
    id: movie.id,
    tmdbUrl: getTmdbMovieUrl(movie.id),
    title: movie.title,
    posterUrl: getPosterUrl(movie.poster_path),
    genres: getGenreNames(movie.genre_ids, genreMap),
    releaseYear: getReleaseYear(movie.release_date),
    voteAverage: movie.vote_average,
    voteCount: formatVoteCount(movie.vote_count),
    voteCountRaw: movie.vote_count,
    overview: movie.overview,
  }))
}

function MovieGrid() {
  const [movies, setMovies] = useState([])
  const [genreMap, setGenreMap] = useState(null)
  const [minYear, setMinYear] = useState(YEAR_FILTER_DEFAULT_MIN)
  const [maxYear, setMaxYear] = useState(YEAR_FILTER_DEFAULT_MAX)
  const [selectedGenreIds, setSelectedGenreIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const debouncedMinYear = useDebouncedValue(minYear, YEAR_DEBOUNCE_MS)
  const debouncedMaxYear = useDebouncedValue(maxYear, YEAR_DEBOUNCE_MS)
  const isPendingFetch =
    minYear !== debouncedMinYear || maxYear !== debouncedMaxYear

  useEffect(() => {
    fetchMovieGenres()
      .then(setGenreMap)
      .catch((err) => {
        setError(err.message ?? 'Failed to load genres')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!genreMap) return

    let cancelled = false

    async function loadMovies() {
      setLoading(true)
      setError(null)

      try {
        const results = await fetchDiscoverMovies({
          minYear: debouncedMinYear,
          maxYear: debouncedMaxYear,
          genreIds: selectedGenreIds,
        })
        if (!cancelled) {
          setMovies(mapMovies(results, genreMap))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load movies')
          setMovies([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      cancelled = true
    }
  }, [debouncedMinYear, debouncedMaxYear, selectedGenreIds, genreMap])

  const handleYearChange = ({ minYear: nextMin, maxYear: nextMax }) => {
    setMinYear(nextMin)
    setMaxYear(nextMax)
  }

  const showInitialSkeleton = loading && movies.length === 0
  const showGrid = movies.length > 0
  const isRefetching = (loading || isPendingFetch) && showGrid

  return (
    <>
      <YearFilter
        minYear={minYear}
        maxYear={maxYear}
        onChange={handleYearChange}
        isUpdating={isRefetching}
      />

      <GenreFilter
        selectedGenreIds={selectedGenreIds}
        onChange={setSelectedGenreIds}
      />

      {showInitialSkeleton && (
        <section
          className={GRID_CLASS}
          aria-busy="true"
          aria-label="Loading movies"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </section>
      )}

      {!showInitialSkeleton && error && (
        <p className="py-16 text-center text-red-400">Error: {error}</p>
      )}

      {!showInitialSkeleton && !error && !showGrid && !loading && (
        <p className="py-16 text-center text-slate-400">
          No movies found for the selected filters.
        </p>
      )}

      {showGrid && !error && (
        <section
          className={`${GRID_CLASS} transition-opacity duration-200 ${
            isRefetching ? 'opacity-50' : 'opacity-100'
          }`}
          aria-busy={isRefetching}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </section>
      )}
    </>
  )
}

export default MovieGrid
