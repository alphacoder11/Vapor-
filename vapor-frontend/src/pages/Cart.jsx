import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [purchased, setPurchased] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vapor_cart') || '[]')
    setCart(stored)
  }, [])

  const removeItem = (id) => {
    const updated = cart.filter(g => g.id !== id)
    setCart(updated)
    localStorage.setItem('vapor_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('vapor_update'))
  }

  const getPrice = (game) => {
    if (game.price === 0) return 0
    return parseFloat((game.price - game.price * game.discount / 100).toFixed(2))
  }

  const total = cart.reduce((sum, g) => sum + getPrice(g), 0)

  const checkout = () => {
    const pts = parseInt(localStorage.getItem('vapor_points') || '0')
    const earned = Math.floor(total * 100)
    localStorage.setItem('vapor_points', pts + earned)
    localStorage.setItem('vapor_cart', '[]')
    setCart([])
    window.dispatchEvent(new Event('vapor_update'))
    setPurchased(true)
  }

  if (purchased) {
    return (
      <div className="container cart-page">
        <div className="cart-success">
          <div className="success-icon">🎮</div>
          <h2>Purchase Complete!</h2>
          <p>Your games have been added to your library. You earned <strong style={{ color: 'var(--vapor-purple-light)' }}>{Math.floor(total * 100).toLocaleString()} Vapor Points</strong>!</p>
          <div className="success-actions">
            <Link to="/store" className="btn btn-primary">Keep Shopping</Link>
            <Link to="/points" className="btn btn-purple">View Points</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Browse the store and find something you'll love!</p>
            <Link to="/store" className="btn btn-primary">Browse Store</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map(game => (
                <div key={game.id} className="cart-item">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/80x100/1b2838/66c0f4?text=${encodeURIComponent(game.title.charAt(0))}`
                    }}
                  />
                  <div className="cart-item-info">
                    <h3>{game.title}</h3>
                    <p>{game.genre.join(' · ')}</p>
                    <p className="cart-item-points">+{getPrice(game) * 100 | 0} Vapor Points</p>
                  </div>
                  <div className="cart-item-price">
                    {game.discount > 0 && (
                      <>
                        <span className="discount-badge">-{game.discount}%</span>
                        <span className="price-original">${game.price.toFixed(2)}</span>
                      </>
                    )}
                    <span className="price-tag">
                      {game.price === 0 ? 'Free' : `$${getPrice(game).toFixed(2)}`}
                    </span>
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeItem(game.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Items ({cart.length})</span>
                <span>${cart.reduce((s, g) => s + g.price, 0).toFixed(2)}</span>
              </div>
              {cart.some(g => g.discount > 0) && (
                <div className="cart-summary-row discount">
                  <span>Discounts</span>
                  <span>-${cart.reduce((s, g) => s + (g.price * g.discount / 100), 0).toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary-divider" />
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="cart-points-preview">
                <span className="points-icon">⬡</span>
                <span>You'll earn <strong>{Math.floor(total * 100).toLocaleString()}</strong> Vapor Points</span>
              </div>

              <button className="btn btn-green checkout-btn" onClick={checkout}>
                Purchase — ${total.toFixed(2)}
              </button>

              <div className="cart-safe-icons">
                <span>🔒 Secure checkout</span>
                <span>💳 All major cards</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
