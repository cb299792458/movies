import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'

function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY
}

export async function fetchDiscoverMovies() {
  const { data } = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
    params: {
      api_key: getApiKey(),
      with_genres: 28,
      page: 1,
    },
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
