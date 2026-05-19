import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/signup.css'
import BottomNav from '../components/BottomNav'
import TopRightActions from '../components/TopRightActions'
import { setAuthSession } from '../utils/auth'
import { apiRegister } from '../utils/api'
const eyeOpen = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
const eyeClosed = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`

export default function Signup() {
  const [country, setCountry] = useState('')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [showPw1, setShowPw1] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!country) { alert('Please select your country region.'); return }
    if (!account.trim()) { alert('Please enter a register account name.'); return }
    if (!password) { alert('Please enter a password.'); return }
    if (password !== confirmPassword) { alert('Passwords do not match.'); return }
    try {
      const data = await apiRegister({
        username: account.trim(),
        password,
        country,
        invite_code: inviteCode,
      })
      setAuthSession(data.user)
      navigate('/')
    } catch (err) {
      alert(err.message || 'Registration failed. Is MySQL + PHP API running?')
    }
  }

  return (
    <>
      <div className="glow-bl"></div>
      <div className="glow-tr"></div>
      <div className="dot d1"></div><div className="dot d2"></div><div className="dot d3"></div>
      <div className="dot d4"></div><div className="dot d5"></div><div className="dot d6"></div>
      <div className="dot d7"></div><div className="dot d8"></div><div className="dot d9"></div>
      <div className="dot d10"></div><div className="dot d11"></div><div className="dot d12"></div>

      <Link to="/login" className="btn-back" title="Go back">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>

      <TopRightActions />

      <div className="page-center">
        <div className="avatar">
          <Link to="/"><img src="/images/CoinSwtich.png" alt="" /></Link>
        </div>

        <h1 className="heading">Create <span>Account</span></h1>
        <p className="subheading">Join the future of digital assets</p>

        <div className="card">
          {/* Country */}
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
            </svg>
            <select className="select-field" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="" disabled>Select your country region</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="PK">Pakistan</option>
              <option value="IN">India</option>
              <option value="AE">UAE</option>
              <option value="SG">Singapore</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
            </select>
            <svg className="caret-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Username */}
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <input type="text" className="input-field" placeholder="Register Account" autoComplete="username"
              value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>

          {/* Password */}
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input type={showPw1 ? 'text' : 'password'} className="input-field" placeholder="Enter your account password" autoComplete="new-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="toggle-pw" type="button" title="Show/Hide" onClick={() => setShowPw1(!showPw1)}>
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: showPw1 ? eyeClosed : eyeOpen }} />
            </button>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input type={showPw2 ? 'text' : 'password'} className="input-field" placeholder="Confirm your password" autoComplete="new-password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="toggle-pw" type="button" title="Show/Hide" onClick={() => setShowPw2(!showPw2)}>
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: showPw2 ? eyeClosed : eyeOpen }} />
            </button>
          </div>

          {/* Invitation code */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <svg className="input-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
            <input type="text" className="input-field" placeholder="Enter invitation code" autoComplete="off"
              value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
          </div>

          <button className="btn-register" type="button" onClick={handleRegister}>Register</button>

          <p className="signin-row">
            Do you have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
      <BottomNav activePage="/notification" />
    </>
  )
}
