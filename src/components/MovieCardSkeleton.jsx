function MovieCardSkeleton() {
  return (
    <article
      className="w-full overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-white/10"
      aria-hidden="true"
    >
      <div className="aspect-[2/3] animate-pulse bg-slate-200" />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex min-h-11 flex-col justify-center gap-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-2">
          <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
          <div className="flex justify-between gap-2">
            <div className="h-3 w-10 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default MovieCardSkeleton
