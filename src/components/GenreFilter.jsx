import { COMMON_GENRES } from '../api/movies'

function GenreFilter({ selectedGenreIds, onChange }) {
  const toggleGenre = (genreId) => {
    if (selectedGenreIds.includes(genreId)) {
      onChange(selectedGenreIds.filter((id) => id !== genreId))
      return
    }

    onChange([...selectedGenreIds, genreId])
  }

  return (
    <section className="border-b border-slate-700 bg-slate-800/80 px-2 py-4 sm:px-4">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Genre
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {selectedGenreIds.length === 0
              ? 'Showing all genres'
              : 'Movies must include every selected genre'}
          </p>
        </div>

        <div className="flex flex-wrap justify-evenly gap-y-3">
          {COMMON_GENRES.map((genre) => {
            const isSelected = selectedGenreIds.includes(genre.id)

            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                aria-pressed={isSelected}
                className={`cursor-pointer rounded-full border px-6 py-3 text-lg font-medium transition ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400 text-slate-900'
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
