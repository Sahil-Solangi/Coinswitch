import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopRightActions from '../components/TopRightActions'
import BottomNav from '../components/BottomNav'
import '../styles/login.css'
import '../styles/auth-subpages.css'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: '\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code: 'es', label: 'Spanish', native: 'Espa\u00f1ol' },
  { code: 'fr', label: 'French', native: 'Fran\u00e7ais' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'zh', label: 'Chinese', native: '\u4e2d\u6587' },
  { code: 'ja', label: 'Japanese', native: '\u65e5\u672c\u8a9e' },
  { code: 'ar', label: 'Arabic', native: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
  { code: 'pt', label: 'Portuguese', native: 'Portugu\u00eas' },
  { code: 'ru', label: 'Russian', native: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
]

const STORAGE_KEY = 'coinswitch-language'

export default function Language() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setSelected(saved)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, selected)
    const lang = LANGUAGES.find((l) => l.code === selected)
    alert(`Language set to ${lang?.label ?? selected}`)
    navigate(-1)
  }

  return (
    <>
      <div className="dot-glow-bl" />
      <div className="dot-glow-tr" />
      <div className="dot dot-1" />
      <div className="dot dot-2" />
      <div className="dot dot-3" />

      <Link to="/login" className="btn-back" title="Go back" aria-label="Go back">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>

      <nav className="nav">
        <div className="nav-logo-box">
          <Link to="/"><img src="/images/CoinSwtich.png" alt="CoinSwitch" /></Link>
        </div>
      </nav>

      <TopRightActions />

      <div className="subpage-wrap">
        <h1 className="heading">
          Choose <span>Language</span>
        </h1>
        <p className="subheading">Select your preferred app language</p>

        <div className="lang-list">
          {LANGUAGES.map((lang) => (
            <label
              key={lang.code}
              className={`lang-option${selected === lang.code ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={selected === lang.code}
                onChange={() => setSelected(lang.code)}
              />
              <div className="lang-labels">
                <strong>{lang.label}</strong>
                <span>{lang.native}</span>
              </div>
            </label>
          ))}
        </div>

        <button type="button" className="btn-login" style={{ maxWidth: 430, width: '100%', marginTop: 20 }} onClick={handleSave}>
          Save Language
        </button>
      </div>

      <BottomNav activePage="/login" />
    </>
  )
}
