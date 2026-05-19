import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/auth'

export default function BottomNav({ activePage }) {
  const location = useLocation()
  const navigate = useNavigate()
  const active = activePage || location.pathname

  const guardNav = (e, path) => {
    if (isLoggedIn()) return
    e.preventDefault()
    alert('Please register or log in to access this feature.')
    navigate('/login', { state: { from: path } })
  }

  const isActive = (path) => {
    if (path === '/' && active === '/') return true
    if (path !== '/' && active.startsWith(path)) return true
    return false
  }

  return (
    <nav className="bottom-nav">
      {/* Home */}
      <div className={`nav-item${isActive('/') && !isActive('/notification') && !isActive('/spot') && !isActive('/userinfo') && !isActive('/login') ? ' active' : ''}`} id="nav-home">
        <div className="nav-icon-wrap">
          <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <path d="M9 21V12h6v9" fill="#0b5ed7" />
            </svg>
          </Link>
        </div>
      </div>
      {/* Chart */}
      <div className="nav-item" id="nav-chart">
        <div className="nav-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="#6a7d9a" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
      </div>
      {/* Spot */}
      <div className={`nav-item${isActive('/spot') ? ' active' : ''}`} id="nav-spot">
        <div className="nav-icon-wrap">
          <Link to="/spot" onClick={(e) => guardNav(e, '/spot')} style={{ color: 'inherit', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={isActive('/spot') ? 'white' : '#6a7d9a'} strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </Link>
        </div>
      </div>
      {/* Notification */}
      <div className={`nav-item${isActive('/notification') ? ' active' : ''}`} id="nav-notification">
        <div className="nav-icon-wrap">
          <Link to="/notification" style={{ color: 'inherit', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={isActive('/notification') ? 'white' : '#6a7d9a'} strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Link>
        </div>
      </div>
      {/* Profile */}
      <div className={`nav-item${isActive('/userinfo') || isActive('/login') ? ' active' : ''}`} id="nav-profile">
        <div className="nav-icon-wrap">
          <Link to="/login" style={{ color: 'inherit', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={isActive('/userinfo') || isActive('/login') ? 'white' : '#6a7d9a'} strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}
