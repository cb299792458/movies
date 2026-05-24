import Header from './components/Header'
import MovieGrid from './components/MovieGrid'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main>
        <MovieGrid />
      </main>
    </div>
  )
}

export default App
