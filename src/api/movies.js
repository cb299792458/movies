import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const YEAR_FILTER_MIN = 1970
export const YEAR_FILTER_MAX = new Date().getFullYear()
export const YEAR_FILTER_DEFAULT_MAX = YEAR_FILTER_MAX
export const YEAR_FILTER_DEFAULT_MIN = YEAR_FILTER_MAX - 1

export const COMMON_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
]

function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY
}

export async function fetchDiscoverMovies({ minYear, maxYear, genreIds = [] }) {
  const params = {
    api_key: getApiKey(),
    page: 1,
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

  return data.results
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

export function getGenreNames(genreIds, genreMap) {
  return genreIds
    .map((id) => genreMap[id])
    .filter(Boolean)
    .join(', ')
}

export function getReleaseYear(releaseDate) {
  return releaseDate ? releaseDate.slice(0, 4) : 'N/A'
}
