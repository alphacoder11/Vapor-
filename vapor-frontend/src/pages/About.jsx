import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="about-hero">
        <div className="about-content">
          <h1>About Vapor</h1>
          <p className="tagline">Your Ultimate Gaming Universe</p>
        </div>
      </div>

      <div className="about-sections">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Vapor is a cutting-edge gaming platform designed by gamers, for gamers. 
            We're passionate about creating the ultimate destination where players can discover, 
            purchase, and enjoy the best games from around the world.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To revolutionize the gaming experience by providing a seamless, community-driven 
            platform that connects players with their next favorite game. We believe in fair 
            pricing, instant access, and putting the player first.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>🎮 Massive Library</h3>
              <p>Access thousands of games from AAA blockbusters to indie gems</p>
            </div>
            <div className="feature-item">
              <h3>💎 Vapor Points</h3>
              <p>Earn rewards with every purchase and unlock exclusive content</p>
            </div>
            <div className="feature-item">
              <h3>🎬 Game Trailers</h3>
              <p>Watch HD trailers and gameplay videos for every game</p>
            </div>
            <div className="feature-item">
              <h3>🛡️ Secure Platform</h3>
              <p>Safe transactions and instant digital delivery</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Active Gamers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Games Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Countries Served</div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Join the Community</h2>
          <p>
            Ready to level up your gaming experience? Join millions of players who've made 
            Vapor their home for gaming. Whether you're into RPGs, FPS, strategy games, 
            or something in between, we've got you covered.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Browse Games</button>
            <button className="btn btn-secondary">Sign Up Free</button>
          </div>
        </section>
      </div>

      <div className="about-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/investors">Investors</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/refund">Refund Policy</a></li>
              <li><a href="/system">System Requirements</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">YouTube</a>
              <a href="#" className="social-link">Discord</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Vapor. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default About;
