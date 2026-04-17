import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GAMES } from '../data/games'
import GameCard from '../components/GameCard'
import './GameDetail.css'

export default function GameDetail() {
  const { id } = useParams()
  const game = GAMES.find(g => g.id === parseInt(id))
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  if (!game) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-highlight)', marginBottom: 16 }}>Game not found</h2>
        <Link to="/store" className="btn btn-primary">Back to Store</Link>
      </div>
    )
  }

  const discountedPrice = game.discount > 0
    ? (game.price - game.price * game.discount / 100).toFixed(2)
    : game.price.toFixed(2)

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('vapor_cart') || '[]')
    if (!cart.find(item => item.id === game.id)) {
      cart.push(game)
      localStorage.setItem('vapor_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('vapor_update'))
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const similar = GAMES
    .filter(g => g.id !== game.id && g.genre.some(gen => game.genre.includes(gen)))
    .slice(0, 4)

  const reviewLabel = (rating) => {
    if (rating >= 95) return 'Overwhelmingly Positive'
    if (rating >= 85) return 'Very Positive'
    if (rating >= 70) return 'Mostly Positive'
    if (rating >= 50) return 'Mixed'
    return 'Mostly Negative'
  }

  const reviewColor = (rating) => {
    if (rating >= 85) return '#66c0f4'
    if (rating >= 70) return '#a0c3d2'
    return '#c6d4df'
  }

  return (
    <div className="game-detail-page">
      {/* Banner */}
      <div
        className="game-detail-banner"
        style={{ backgroundImage: `url(${game.banner || game.image})` }}
      >
        <div className="game-detail-banner-overlay" />
        <div className="container game-detail-banner-content">
          <Link to="/store" className="back-btn">← Back to Store</Link>
        </div>
      </div>

      <div className="container game-detail-body">
        {/* Main Info */}
        <div className="game-detail-main">
          <div className="game-detail-sidebar">
            <img
              src={game.image}
              alt={game.title}
              className="game-detail-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/300x400/1b2838/66c0f4?text=${encodeURIComponent(game.title)}`
              }}
            />
            <div className="game-detail-buy">
              {game.discount > 0 && (
                <div className="detail-discount-row">
                  <span className="discount-badge">-{game.discount}%</span>
                  <span className="price-original">${game.price.toFixed(2)}</span>
                </div>
              )}
              <div className="detail-price">
                {game.price === 0 ? (
                  <span className="price-free" style={{ fontSize: 24 }}>Free to Play</span>
                ) : (
                  <span className="price-tag" style={{ fontSize: 26 }}>${discountedPrice}</span>
                )}
              </div>
              <button
                className={`btn ${added ? 'btn-green' : 'btn-primary'} detail-cart-btn`}
                onClick={addToCart}
              >
                {added ? '✓ Added to Cart!' : game.price === 0 ? 'Play Now — Free' : 'Add to Cart'}
              </button>
              <button
                className={`btn btn-secondary detail-wish-btn`}
                onClick={() => setWishlisted(!wishlisted)}
              >
                {wishlisted ? '♥ Wishlisted' : '♡ Add to Wishlist'}
              </button>
              <div className="game-detail-meta-mini">
                <div><span>Developer</span><span>{game.developer}</span></div>
                <div><span>Publisher</span><span>{game.publisher}</span></div>
                <div><span>Release</span><span>{new Date(game.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
              </div>
            </div>
          </div>

          <div className="game-detail-content">
            <div className="game-detail-header">
              {game.badge && (
                <span className={`badge badge-${game.badge}`}>
                  {game.badge === 'new' ? 'NEW' : game.badge === 'sale' ? 'SALE' : game.badge.toUpperCase()}
                </span>
              )}
              <h1 className="game-detail-title">{game.title}</h1>
              <div className="game-detail-genres">
                {game.genre.map(g => (
                  <Link to={`/store`} key={g} className="genre-chip">{g}</Link>
                ))}
              </div>
            </div>

            <div className="game-detail-description">
              <h3>About This Game</h3>
              <p>{game.description}</p>
            </div>

            <div className="game-detail-reviews">
              <h3>Overall Reviews</h3>
              <div className="review-summary">
                <div
                  className="review-label"
                  style={{ color: reviewColor(game.rating) }}
                >
                  {reviewLabel(game.rating)}
                </div>
                <div className="review-bar-wrap">
                  <div className="review-bar">
                    <div className="review-fill" style={{ width: `${game.rating}%` }} />
                  </div>
                  <span className="review-pct">{game.rating}%</span>
                </div>
                <div className="review-count">Based on {game.reviews.toLocaleString()} user reviews</div>
              </div>
            </div>

            <div className="game-detail-tags">
              <h3>Popular Tags</h3>
              <div className="tags-wrap">
                {game.tags.map(tag => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Games */}
        {similar.length > 0 && (
          <section className="game-detail-similar">
            <h2 className="section-title">Similar Games</h2>
            <div className="grid-games">
              {similar.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
