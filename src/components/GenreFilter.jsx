import {
  BRIANS_FAVORITES_GENRE_ID,
  COMMON_GENRES,
  EXTRA_GENRES,
  isBriansFavoritesSelected,
} from '../api/movies'

const ALL_GENRE_OPTIONS = [...COMMON_GENRES, ...EXTRA_GENRES]

function GenreFilter({ selectedGenreIds, onChange }) {
  const briansFavoritesSelected = isBriansFavoritesSelected(selectedGenreIds)

  const toggleGenre = (genreId) => {
    if (genreId === BRIANS_FAVORITES_GENRE_ID) {
      onChange(
        briansFavoritesSelected ? [] : [BRIANS_FAVORITES_GENRE_ID],
      )
      return
    }

    if (selectedGenreIds.includes(genreId)) {
      onChange(
        selectedGenreIds.filter(
          (id) => id !== genreId && id !== BRIANS_FAVORITES_GENRE_ID,
        ),
      )
      return
    }

    onChange([
      ...selectedGenreIds.filter((id) => id !== BRIANS_FAVORITES_GENRE_ID),
      genreId,
    ])
  }

  const helperText = briansFavoritesSelected
    ? "Showing Brian's Favs"
    : selectedGenreIds.length === 0
      ? 'Showing all genres'
      : 'Movies must include every selected genre'

  return (
    <section className="filter-panel border-b border-slate-700 bg-slate-800/80 px-2 py-4 sm:px-4">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="filter-label text-sm font-semibold uppercase tracking-wide text-slate-300">
            Genre
          </h2>
          <p className="filter-value mt-0.5 text-xs text-slate-500">{helperText}</p>
        </div>

        <div className="flex flex-wrap justify-evenly gap-y-2">
          {ALL_GENRE_OPTIONS.map((genre) => {
            const isSelected = selectedGenreIds.includes(genre.id)
            const isBriansFavorites = genre.id === BRIANS_FAVORITES_GENRE_ID

            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                aria-pressed={isSelected}
                className={`genre-filter-btn cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium ${
                  isSelected
                    ? isBriansFavorites
                      ? 'genre-filter-btn--selected border-violet-400 bg-violet-400 text-slate-900'
                      : 'genre-filter-btn--selected border-amber-400 bg-amber-400 text-slate-900'
                    : isBriansFavorites
                      ? 'border-violet-500/60 bg-violet-900/40 text-violet-100 hover:border-violet-400 hover:bg-violet-800/60'
                      : 'border-slate-600 bg-slate-700/80 text-slate-200 hover:border-slate-500 hover:bg-slate-700'
                }`}
              >
                {genre.name}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default GenreFilter
