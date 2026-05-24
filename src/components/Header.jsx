function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-800 px-2 py-5 shadow-sm sm:px-4">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Movie List
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Popular movies — adjust the year range below
      </p>
    </header>
  )
}

export default Header
