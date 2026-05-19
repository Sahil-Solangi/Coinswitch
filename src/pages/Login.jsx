import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/login.css'
import BottomNav from '../components/BottomNav'
import TopRightActions from '../components/TopRightActions'
import { setAuthSession } from '../utils/auth'
import { apiLogin } from '../utils/api'

const eyeOpen = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
const eyeClosed = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      alert('Please fill in both fields.')
      return
    }
    try {
      const data = await apiLogin(username.trim(), password)
      setAuthSession(data.user)
      const from = location.state?.from
      navigate(from && from !== '/login' ? from : '/')
    } catch (err) {
      alert(err.message || 'Login failed. Is MySQL + PHP API running?')
    }
  }

  return (
    <>
      {/* Background glows */}
      <div className="dot-glow-bl"></div>
      <div className="dot-glow-tr"></div>

      {/* Scatter dots */}
      <div className="dot dot-1"></div>
      <div className="dot dot-2"></div>
      <div className="dot dot-3"></div>
      <div className="dot dot-4"></div>
      <div className="dot dot-5"></div>
      <div className="dot dot-6"></div>
      <div className="dot dot-7"></div>
      <div className="dot dot-8"></div>
      <div className="dot dot-9"></div>
      <div className="dot dot-10"></div>
      <div className="dot dot-11"></div>

      {/* Top-left logo */}
      <nav className="nav">
        <div className="nav-logo-box">
          <Link to="/"><img src="/images/CoinSwtich.png" alt="" /></Link>
        </div>
      </nav>

      <TopRightActions />

      {/* Centered content */}
      <div className="page-center">
        <div className="avatar">
          <div className="avatar-inner">
            <Link to="/"><img src="/images/CoinSwtich.png" alt="" /></Link>
          </div>
        </div>

        <h1 className="heading">Welcome <span>Back</span></h1>
        <p className="subheading">Sign in to your account</p>

        <div className="card">
          {/* Username */}
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <input id="username" type="text" className="input-field" placeholder="User Name" autoComplete="username"
              value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          {/* Password */}
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input id="password" type={showPassword ? 'text' : 'password'} className="input-field" placeholder="User Password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="toggle-pw" type="button" title="Show/Hide Password"
              onClick={() => setShowPassword(!showPassword)}>
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: showPassword ? eyeClosed : eyeOpen }} />
            </button>
          </div>

          <button className="btn-login" type="button" onClick={handleLogin}>Login</button>

          <p className="register-row">
            No account?
            <Link to="/signup" id="link-register">Register Now</Link>
          </p>
        </div>
      </div>
      <BottomNav activePage="/notification" />
    </>
  )
}
