function MovieCard({ title, posterUrl, genres, releaseYear, voteAverage }) {
  return (
    <article className="border-b border-gray-200 py-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {posterUrl ? (
        <img src={posterUrl} alt={title} className="mt-2 h-48 w-auto" />
      ) : (
        <p className="mt-2 text-gray-500">No poster</p>
      )}
      <dl className="mt-2 space-y-1 text-sm">
        <div>
          <dt className="inline font-medium">Poster URL: </dt>
          <dd className="inline break-all">{posterUrl ?? 'N/A'}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Genre: </dt>
          <dd className="inline">{genres || 'N/A'}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Release year: </dt>
          <dd className="inline">{releaseYear}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Vote average: </dt>
          <dd className="inline">{voteAverage.toFixed(1)}</dd>
        </div>
      </dl>
    </article>
  )
}

export default MovieCard
