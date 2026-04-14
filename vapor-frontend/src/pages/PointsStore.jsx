import { useState, useEffect } from 'react'
import { POINTS_PACKAGES, POINT_REWARDS } from '../data/games'
import './PointsStore.css'

export default function PointsStore() {
  const [currentPoints, setCurrentPoints] = useState(0)
  const [notification, setNotification] = useState(null)
  const [activeTab, setActiveTab] = useState('buy')

  useEffect(() => {
    const update = () => {
      const pts = parseInt(localStorage.getItem('vapor_points') || '0')
      setCurrentPoints(pts)
    }
    update()
    window.addEventListener('vapor_update', update)
    return () => window.removeEventListener('vapor_update', update)
  }, [])

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const buyPackage = (pkg) => {
    const pts = parseInt(localStorage.getItem('vapor_points') || '0')
    const earned = pkg.points + pkg.bonus
    localStorage.setItem('vapor_points', pts + earned)
    window.dispatchEvent(new Event('vapor_update'))
    setCurrentPoints(pts + earned)
    showNotif(`You received ${earned.toLocaleString()} Vapor Points! 🎉`)
  }

  const redeemReward = (reward) => {
    const pts = parseInt(localStorage.getItem('vapor_points') || '0')
    if (pts < reward.points) {
      showNotif(`Not enough points! You need ${(reward.points - pts).toLocaleString()} more.`, 'error')
      return
    }
    localStorage.setItem('vapor_points', pts - reward.points)
    window.dispatchEvent(new Event('vapor_update'))
    setCurrentPoints(pts - reward.points)
    showNotif(`"${reward.name}" redeemed! Enjoy! ✨`)
  }

  return (
    <div className="points-page">
      {notification && (
        <div className={`points-notif ${notification.type}`}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="points-header">
        <div className="container points-header-inner">
          <div className="points-header-text">
            <h1>Vapor Points</h1>
            <p>Buy points and redeem for exclusive rewards, cosmetics, and coupons.</p>
          </div>
          <div className="points-balance">
            <span className="balance-icon">⬡</span>
            <div>
              <span className="balance-label">Your Balance</span>
              <span className="balance-amount">{currentPoints.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* How it Works */}
        <div className="how-it-works">
          <div className="hiw-item">
            <span>🛒</span>
            <strong>Buy Games</strong>
            <p>Earn 100 pts per $1 spent</p>
          </div>
          <div className="hiw-arrow">→</div>
          <div className="hiw-item">
            <span>⬡</span>
            <strong>Collect Points</strong>
            <p>Points stack up automatically</p>
          </div>
          <div className="hiw-arrow">→</div>
          <div className="hiw-item">
            <span>🎁</span>
            <strong>Redeem Rewards</strong>
            <p>Get cosmetics, coupons & more</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="points-tabs">
          <button
            className={`points-tab ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy')}
          >
            Buy Points
          </button>
          <button
            className={`points-tab ${activeTab === 'redeem' ? 'active' : ''}`}
            onClick={() => setActiveTab('redeem')}
          >
            Redeem Rewards
          </button>
        </div>

        {activeTab === 'buy' && (
          <div>
            <p className="tab-desc">Purchase Vapor Points to unlock exclusive rewards and bonuses. Bigger packages give you more bonus points!</p>
            <div className="packages-grid">
              {POINTS_PACKAGES.map(pkg => (
                <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="package-label">{pkg.label}</div>
                  <div className="package-points-wrap">
                    <span className="package-icon">⬡</span>
                    <span className="package-points">{pkg.points.toLocaleString()}</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="package-bonus">+{pkg.bonus.toLocaleString()} Bonus Points!</div>
                  )}
                  <div className="package-total">
                    {pkg.bonus > 0 ? `${(pkg.points + pkg.bonus).toLocaleString()} total` : 'No bonus'}
                  </div>
                  <div className="package-price">${pkg.price.toFixed(2)}</div>
                  <button
                    className={`btn ${pkg.popular ? 'btn-purple' : 'btn-primary'} package-btn`}
                    onClick={() => buyPackage(pkg)}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'redeem' && (
          <div>
            <p className="tab-desc">Spend your Vapor Points on exclusive cosmetics, boosts, and in-game coupons. New rewards added regularly!</p>
            <div className="balance-row">
              <span>Your balance:</span>
              <span className="balance-inline">⬡ {currentPoints.toLocaleString()} pts</span>
            </div>
            <div className="rewards-grid">
              {POINT_REWARDS.map(reward => {
                const canAfford = currentPoints >= reward.points
                return (
                  <div key={reward.id} className={`reward-card ${!canAfford ? 'cant-afford' : ''}`}>
                    <div className="reward-icon">{reward.image}</div>
                    <div className="reward-type-badge">{reward.type}</div>
                    <h3 className="reward-name">{reward.name}</h3>
                    <div className="reward-cost">
                      <span className="reward-pts-icon">⬡</span>
                      <span>{reward.points.toLocaleString()} pts</span>
                    </div>
                    <button
                      className={`btn ${canAfford ? 'btn-purple' : 'btn-secondary'} reward-btn`}
                      onClick={() => redeemReward(reward)}
                      disabled={!canAfford}
                    >
                      {canAfford ? 'Redeem' : `Need ${(reward.points - currentPoints).toLocaleString()} more`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
