import { Link } from 'react-router-dom'
import '../styles/top-right-actions.css'

export default function TopRightActions() {
  return (
    <div className="top-right">
      <Link to="/language" className="icon-btn" title="Language" aria-label="Choose language">
        <span className="badge badge-green" aria-hidden="true"></span>
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
        </svg>
      </Link>
      <Link to="/support" className="icon-btn" title="24/7 Support" aria-label="Contact support">
        <span className="badge badge-teal" aria-hidden="true"></span>
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      </Link>
    </div>
  )
}
