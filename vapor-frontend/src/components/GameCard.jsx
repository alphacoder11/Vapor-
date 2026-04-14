import { Link } from 'react-router-dom'
import './GameCard.css'

export default function GameCard({ game }) {
  const discountedPrice = game.discount > 0
    ? (game.price - (game.price * game.discount / 100)).toFixed(2)
    : game.price.toFixed(2)

  return (
    <Link to={`/game/${game.id}`} className="game-card">
      <div className="game-card-img-wrap">
        <img
          src={game.image}
          alt={game.title}
          className="game-card-img"
          onError={(e) => {
            e.target.src = `https://placehold.co/200x300/1b2838/66c0f4?text=${encodeURIComponent(game.title)}`
          }}
        />
        {game.badge && (
          <span className={`game-card-badge badge badge-${game.badge}`}>
            {game.badge === 'new' ? 'NEW' : game.badge === 'sale' ? `-${game.discount}%` : game.badge.toUpperCase()}
          </span>
        )}
        {game.discount > 0 && !game.badge && (
          <span className="game-card-badge badge badge-sale">-{game.discount}%</span>
        )}
      </div>
      <div className="game-card-info">
        <p className="game-card-title">{game.title}</p>
        <div className="game-card-rating">
          <div className="rating-bar">
            <div className="rating-fill" style={{ width: `${game.rating}%` }} />
          </div>
          <span className="rating-pct">{game.rating}%</span>
        </div>
        <div className="game-card-price">
          {game.price === 0 ? (
            <span className="price-free">Free to Play</span>
          ) : (
            <>
              {game.discount > 0 && (
                <span className="price-original">${game.price.toFixed(2)}</span>
              )}
              <span className="price-tag">${discountedPrice}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
