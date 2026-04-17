import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [points, setPoints] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('vapor_cart') || '[]')
      setCartCount(cart.length)
      const pts = parseInt(localStorage.getItem('vapor_points') || '0')
      setPoints(pts)
    }
    
    const updateAuth = () => {
      const auth = localStorage.getItem('vapor_authenticated') === 'true'
      const userData = JSON.parse(localStorage.getItem('vapor_user') || 'null')
      setIsAuthenticated(auth)
      setUser(userData)
    }
    
    updateCounts()
    updateAuth()
    window.addEventListener('vapor_update', updateCounts)
    window.addEventListener('vapor_auth_change', updateAuth)
    return () => {
      window.removeEventListener('vapor_update', updateCounts)
      window.removeEventListener('vapor_auth_change', updateAuth)
    }
  }, [location])

  const handleSignOut = () => {
    localStorage.removeItem('vapor_authenticated')
    localStorage.removeItem('vapor_user')
    setIsAuthenticated(false)
    setUser(null)
    window.dispatchEvent(new Event('vapor_auth_change'))
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">VAPOR</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/store" className={`nav-link ${isActive('/store') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Store</Link>
          <Link to="/points" className={`nav-link ${isActive('/points') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Points</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>About</Link>
        </div>

        <div className="navbar-right">
          <div className="points-display">
            <span className="points-icon">⬡</span>
            <span className="points-count">{points.toLocaleString()} pts</span>
          </div>
          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
              <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="sign-in-btn">Sign In</Link>
              <Link to="/signup" className="sign-up-btn">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}
