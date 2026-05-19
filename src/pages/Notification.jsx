import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import '../styles/style.css'

export default function Notification() {
  return (
    <>
      <header className="notif-header">
        <div className="notif-header-left">
          <Link to="/" className="notif-back">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <h1 className="notif-title">Notifications</h1>
        </div>
        <div className="notif-header-right">
          <span className="mark-read">Mark all read</span>
        </div>
      </header>

      <main className="notif-main">
        <div className="notif-list">
          {/* Unread Item */}
          <div className="notif-card unread">
            <div className="notif-icon system">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="notif-content">
              <h3>System Update Completed</h3>
              <p>Our platform has been updated to improve trading speed and reliability.</p>
              <span className="notif-time">2 mins ago</span>
            </div>
            <div className="unread-dot"></div>
          </div>

          {/* Read Items */}
          <div className="notif-card">
            <div className="notif-icon deposit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="notif-content">
              <h3>Deposit Successful</h3>
              <p>Your deposit of 500.00 USDT has been credited to your account.</p>
              <span className="notif-time">1 hour ago</span>
            </div>
          </div>

          <div className="notif-card">
            <div className="notif-icon alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="notif-content">
              <h3>BTC Price Alert</h3>
              <p>Bitcoin (BTC) has surged above $65,000. Check the trading hall for more details.</p>
              <span className="notif-time">Yesterday</span>
            </div>
          </div>

          <div className="notif-card">
            <div className="notif-icon promo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className="notif-content">
              <h3>Welcome Bonus</h3>
              <p>Claim your 10 USDT welcome bonus within the next 24 hours.</p>
              <span className="notif-time">3 days ago</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activePage="/notification" />
    </>
  )
}
