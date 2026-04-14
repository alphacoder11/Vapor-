import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">◈</span>
            <span className="footer-logo-text">VAPOR</span>
          </div>
          <p className="footer-tagline">Your gateway to gaming universes.</p>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Vapor Gaming, Inc. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Store</h4>
            <Link to="/store">Browse Games</Link>
            <Link to="/store">New Releases</Link>
            <Link to="/store">Top Sellers</Link>
            <Link to="/store">On Sale</Link>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <a href="#">Discussions</a>
            <a href="#">Workshop</a>
            <a href="#">Reviews</a>
            <a href="#">Guides</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Refund Policy</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-col">
            <h4>Vapor Points</h4>
            <Link to="/points">Buy Points</Link>
            <Link to="/points">Rewards Shop</Link>
            <a href="#">Points FAQ</a>
            <a href="#">Gift Cards</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Vapor is not affiliated with or endorsed by Valve Corporation. Steam is a trademark of Valve Corporation.</p>
      </div>
    </footer>
  )
}
