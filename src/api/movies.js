import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const YEAR_FILTER_MIN = 1970
export const YEAR_FILTER_MAX = new Date().getFullYear()
export const YEAR_FILTER_DEFAULT_MAX = YEAR_FILTER_MAX
export const YEAR_FILTER_DEFAULT_MIN = YEAR_FILTER_MAX - 1

export const BRIANS_FAVORITES_GENRE_ID = -1
export const BRIANS_FAVORITES_MOVIE_IDS = [
  1301421, // The Sheep Detectives
  2493, // The Princess Bride
  280, // Terminator 2: Judgment Day
  8363, // Superbad
  9502, // Kung Fu Panda
  10625, // Mean Girls
  94329, // The Raid
]

export const COMMON_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

export const EXTRA_GENRES = [
  { id: BRIANS_FAVORITES_GENRE_ID, name: "Brian's Favs" },
]

export function isBriansFavoritesSelected(selectedGenreIds) {
  return selectedGenreIds.includes(BRIANS_FAVORITES_GENRE_ID)
}

export function getTmdbGenreIds(selectedGenreIds) {
  return selectedGenreIds.filter((id) => id !== BRIANS_FAVORITES_GENRE_ID)
}

function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY
}

function mapMovieDetailsToDiscoverResult(data) {
  return {
    id: data.id,
    title: data.title,
    poster_path: data.poster_path,
    genre_ids: data.genres.map((genre) => genre.id),
    release_date: data.release_date,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    overview: data.overview,
  }
}

export async function fetchBriansFavoritesMovies() {
  const responses = await Promise.all(
    BRIANS_FAVORITES_MOVIE_IDS.map((movieId) =>
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: getApiKey(),
        },
      }),
    ),
  )

  return {
    results: responses.map(({ data }) => mapMovieDetailsToDiscoverResult(data)),
    page: 1,
    totalPages: 1,
  }
}

export async function fetchDiscoverMovies({
  minYear,
  maxYear,
  genreIds = [],
  page = 1,
}) {
  const params = {
    api_key: getApiKey(),
    page,
    sort_by: 'popularity.desc',
    'primary_release_date.gte': `${minYear}-01-01`,
    'primary_release_date.lte': `${maxYear}-12-31`,
  }

  if (genreIds.length > 0) {
    params.with_genres = genreIds.join(',')
  }

  const { data } = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
    params,
  })

  return {
    results: data.results,
    page: data.page,
    totalPages: data.total_pages,
  }
}

export async function fetchMovieGenres() {
  const { data } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
    params: {
      api_key: getApiKey(),
    },
  })

  return Object.fromEntries(data.genres.map((genre) => [genre.id, genre.name]))
}

export function getPosterUrl(posterPath) {
  return posterPath ? `${POSTER_BASE_URL}${posterPath}` : null
}

export function getTmdbMovieUrl(movieId) {
  return `https://www.themoviedb.org/movie/${movieId}`
}

export function getGenreNames(genreIds, genreMap) {
  return genreIds
    .map((id) => genreMap[id])
    .filter(Boolean)
    .join(', ')
}

export function getReleaseYear(releaseDate) {
  return releaseDate ? releaseDate.slice(0, 4) : 'N/A'
}

export function mapDiscoverResults(results, genreMap) {
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

export function appendUniqueMovies(existing, incoming) {
  const existingIds = new Set(existing.map((movie) => movie.id))
  const uniqueIncoming = incoming.filter((movie) => !existingIds.has(movie.id))
  return [...existing, ...uniqueIncoming]
}

export function formatVoteCount(count) {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(count)
}
