import { useEffect, useState } from 'react'
import {
  fetchDiscoverMovies,
  fetchMovieGenres,
  getGenreNames,
  getPosterUrl,
  getReleaseYear,
} from '../api/movies'
import MovieCard from './MovieCard'

function MovieGrid() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchDiscoverMovies(), fetchMovieGenres()])
      .then(([results, genreMap]) => {
        const sorted = [...results].sort(
          (a, b) => b.vote_average - a.vote_average,
        )
        setMovies(
          sorted.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterUrl: getPosterUrl(movie.poster_path),
            genres: getGenreNames(movie.genre_ids, genreMap),
            releaseYear: getReleaseYear(movie.release_date),
            voteAverage: movie.vote_average,
          })),
        )
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load movies')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="p-4">Loading...</p>
  }

  if (error) {
    return <p className="p-4">Error: {error}</p>
  }

  return (
    <section className="p-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </section>
  )
}

export default MovieGrid
