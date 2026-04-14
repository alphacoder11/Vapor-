import { useState, useMemo } from 'react'
import GameCard from '../components/GameCard'
import { GAMES, GENRES } from '../data/games'
import './Store.css'

export default function Store() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')
  const [sort, setSort] = useState('popular')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    let games = [...GAMES]

    if (search) {
      games = games.filter(g => g.title.toLowerCase().includes(search.toLowerCase()))
    }

    if (genre !== 'All') {
      games = games.filter(g => g.genre.includes(genre))
    }

    if (filter === 'sale') {
      games = games.filter(g => g.discount > 0)
    } else if (filter === 'free') {
      games = games.filter(g => g.price === 0)
    } else if (filter === 'new') {
      games = games.filter(g => g.badge === 'new' || new Date(g.releaseDate) > new Date('2022-01-01'))
    }

    if (sort === 'popular') {
      games.sort((a, b) => b.reviews - a.reviews)
    } else if (sort === 'rating') {
      games.sort((a, b) => b.rating - a.rating)
    } else if (sort === 'price-low') {
      games.sort((a, b) => {
        const pa = a.price - a.price * a.discount / 100
        const pb = b.price - b.price * b.discount / 100
        return pa - pb
      })
    } else if (sort === 'price-high') {
      games.sort((a, b) => {
        const pa = a.price - a.price * a.discount / 100
        const pb = b.price - b.price * b.discount / 100
        return pb - pa
      })
    } else if (sort === 'discount') {
      games.sort((a, b) => b.discount - a.discount)
    } else if (sort === 'newest') {
      games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    }

    return games
  }, [search, genre, sort, filter])

  return (
    <div className="store-page">
      <div className="store-header">
        <div className="container store-header-inner">
          <h1>Game Store</h1>
          <p>{filtered.length} games available</p>
        </div>
      </div>

      <div className="container store-body">
        {/* Filters Sidebar */}
        <aside className="store-sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <h3>Show</h3>
            {['all', 'sale', 'free', 'new'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All Games' : f === 'sale' ? 'On Sale' : f === 'free' ? 'Free to Play' : 'New Releases'}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Genre</h3>
            <div className="genre-list">
              {GENRES.map(g => (
                <button
                  key={g}
                  className={`genre-btn ${genre === g ? 'active' : ''}`}
                  onClick={() => setGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="discount">Biggest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Games Grid */}
        <div className="store-main">
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>🎮 No games found matching your criteria.</p>
              <button onClick={() => { setSearch(''); setGenre('All'); setFilter('all') }} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-games">
              {filtered.map(game => <GameCard key={game.id} game={game} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
