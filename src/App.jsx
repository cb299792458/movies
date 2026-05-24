import Header from './components/Header'
import MovieGrid from './components/MovieGrid'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <Header />
      <main className="w-full">
        <MovieGrid />
      </main>
    </div>
  )
}

export default App
