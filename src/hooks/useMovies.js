import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  appendUniqueMovies,
  fetchBriansFavoritesMovies,
  fetchDiscoverMovies,
  fetchMovieGenres,
  getTmdbGenreIds,
  isBriansFavoritesSelected,
  mapDiscoverResults,
} from '../api/movies'
import { INFINITE_SCROLL_ROOT_MARGIN } from '../constants'
import { getErrorMessage } from '../utils/errorMessage'

export function useMovies({
  debouncedMinYear,
  debouncedMaxYear,
  selectedGenreIds,
}) {
  const [movies, setMovies] = useState([])
  const [genreMap, setGenreMap] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [resultsKey, setResultsKey] = useState(0)

  const loadMoreRef = useRef(null)
  const pageRef = useRef(1)
  const hasMoreRef = useRef(true)
  const loadingMoreRef = useRef(false)

  const briansFavoritesSelected = isBriansFavoritesSelected(selectedGenreIds)

  const filterParams = useMemo(
    () => ({
      minYear: debouncedMinYear,
      maxYear: debouncedMaxYear,
      genreIds: getTmdbGenreIds(selectedGenreIds),
      briansFavoritesSelected,
    }),
    [debouncedMinYear, debouncedMaxYear, selectedGenreIds, briansFavoritesSelected],
  )

  useEffect(() => {
    fetchMovieGenres()
      .then(setGenreMap)
      .catch((err) => {
        setError(getErrorMessage(err, 'Failed to load genres'))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!genreMap) return

    let cancelled = false

    async function loadFirstPage() {
      setLoading(true)
      setLoadingMore(false)
      loadingMoreRef.current = false
      setError(null)
      pageRef.current = 1

      try {
        const data = filterParams.briansFavoritesSelected
          ? await fetchBriansFavoritesMovies()
          : await fetchDiscoverMovies({ ...filterParams, page: 1 })

        if (!cancelled) {
          setMovies(mapDiscoverResults(data.results, genreMap))
          const moreAvailable = data.page < data.totalPages
          setHasMore(moreAvailable)
          hasMoreRef.current = moreAvailable
          setResultsKey((key) => key + 1)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Failed to load movies'))
          setMovies([])
          setHasMore(false)
          hasMoreRef.current = false
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadFirstPage()

    return () => {
      cancelled = true
    }
  }, [filterParams, genreMap])

  const loadNextPage = useCallback(async () => {
    if (
      !genreMap ||
      loading ||
      loadingMoreRef.current ||
      !hasMoreRef.current ||
      filterParams.briansFavoritesSelected
    ) {
      return
    }

    loadingMoreRef.current = true
    setLoadingMore(true)
    const nextPage = pageRef.current + 1

    try {
      const data = await fetchDiscoverMovies({
        ...filterParams,
        page: nextPage,
      })

      setMovies((current) =>
        appendUniqueMovies(
          current,
          mapDiscoverResults(data.results, genreMap),
        ),
      )
      pageRef.current = nextPage
      const moreAvailable = data.page < data.totalPages
      setHasMore(moreAvailable)
      hasMoreRef.current = moreAvailable
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load more movies'))
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [genreMap, loading, filterParams])

  const showGrid = movies.length > 0

  useEffect(() => {
    const sentinel = loadMoreRef.current
    if (!sentinel || movies.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage()
        }
      },
      { rootMargin: INFINITE_SCROLL_ROOT_MARGIN },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [loadNextPage, movies.length, hasMore, loading, resultsKey])

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasMore,
    resultsKey,
    loadMoreRef,
    showInitialSkeleton: loading && movies.length === 0,
    showGrid,
  }
}
