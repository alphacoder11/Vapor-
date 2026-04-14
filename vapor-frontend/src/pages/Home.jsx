import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { GAMES } from '../data/games'
import './Home.css'

const FEATURED = GAMES.filter(g => g.featured)
const TOP_SELLERS = [...GAMES].sort((a, b) => b.reviews - a.reviews).slice(0, 8)
const ON_SALE = GAMES.filter(g => g.discount > 0).slice(0, 8)
const NEW_RELEASES = [...GAMES].filter(g => g.badge === 'new' || new Date(g.releaseDate) > new Date('2022-01-01')).slice(0, 8)

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)
  const hero = FEATURED[heroIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % FEATURED.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const addToCart = (game) => {
    const cart = JSON.parse(localStorage.getItem('vapor_cart') || '[]')
    if (!cart.find(item => item.id === game.id)) {
      cart.push(game)
      localStorage.setItem('vapor_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('vapor_update'))
    }
  }

  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${hero.banner || hero.image})`,
          }}
        />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-tags">
            {hero.tags.slice(0, 3).map(t => (
              <span key={t} className="hero-tag">{t}</span>
            ))}
          </div>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-desc">{hero.description}</p>
          <div className="hero-actions">
            <Link to={`/game/${hero.id}`} className="btn btn-primary">View Game</Link>
            <button
              className="btn btn-secondary"
              onClick={() => addToCart(hero)}
            >
              Add to Cart
            </button>
            <div className="hero-price">
              {hero.discount > 0 && (
                <>
                  <span className="discount-badge">-{hero.discount}%</span>
                  <span className="price-original">${hero.price.toFixed(2)}</span>
                </>
              )}
              <span className="price-tag">
                {hero.price === 0 ? 'Free to Play' : `$${(hero.price - hero.price * hero.discount / 100).toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
        <div className="hero-dots">
          {FEATURED.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-item">
            <span>🎮</span>
            <div>
              <strong>45+ Games</strong>
              <p>Top titles across every genre</p>
            </div>
          </div>
          <div className="promo-item">
            <span>⚡</span>
            <div>
              <strong>Vapor Points</strong>
              <p>Earn points on every purchase</p>
            </div>
          </div>
          <div className="promo-item">
            <span>🔒</span>
            <div>
              <strong>Secure Platform</strong>
              <p>Your account, your games</p>
            </div>
          </div>
          <div className="promo-item">
            <span>🌍</span>
            <div>
              <strong>Global Community</strong>
              <p>Play with friends worldwide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Top Sellers */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Top Sellers</h2>
            <Link to="/store" className="see-all">See All →</Link>
          </div>
          <div className="grid-games">
            {TOP_SELLERS.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>

        {/* On Sale */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Special Offers</h2>
            <Link to="/store?filter=sale" className="see-all">See All →</Link>
          </div>
          <div className="grid-games">
            {ON_SALE.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>

        {/* New Releases */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">New Releases</h2>
            <Link to="/store?filter=new" className="see-all">See All →</Link>
          </div>
          <div className="grid-games">
            {NEW_RELEASES.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>

        {/* Points CTA */}
        <section className="points-cta">
          <div className="points-cta-content">
            <h2>Vapor Points</h2>
            <p>Collect Vapor Points every time you play games and make purchases. Redeem them for exclusive cosmetics, discounts, and more.</p>
            <Link to="/points" className="btn btn-purple">Buy Points Now</Link>
          </div>
          <div className="points-cta-visual">
            <div className="points-orb">⬡</div>
            <div className="points-rings" />
          </div>
        </section>
      </div>
    </div>
  )
}
