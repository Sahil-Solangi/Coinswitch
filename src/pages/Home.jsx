import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import TradingModal from '../components/TradingModal'
import CoinIcon from '../components/CoinIcon'
import { isLoggedIn, getAuthUser } from '../utils/auth'
import { fetchCoinList } from '../utils/coinApi'
import { apiGetSpotBalance } from '../utils/api'
import '../styles/style.css'
const HIDE_BALANCE_KEY = 'coinswitch-hide-balances'

function formatVolume(volume) {
  if (volume >= 1e9) return '$' + (volume / 1e9).toFixed(2) + 'B'
  if (volume >= 1e6) return '$' + (volume / 1e6).toFixed(2) + 'M'
  if (volume >= 1e3) return '$' + (volume / 1e3).toFixed(2) + 'K'
  return '$' + volume.toFixed(2)
}

function formatPrice(price) {
  if (price < 0.01) return price.toFixed(6)
  if (price < 1) return price.toFixed(4)
  return price.toFixed(2)
}

export default function Home() {
  const navigate = useNavigate()
  const [currentCoins, setCurrentCoins] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCoin, setModalCoin] = useState({ code: '', rate: 0, chgPercent: 0 })
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())
  const [hideBalance, setHideBalance] = useState(() => localStorage.getItem(HIDE_BALANCE_KEY) === '1')
  const [totalUsdt, setTotalUsdt] = useState('0.00')
  const [totalFiat, setTotalFiat] = useState('≈$0.00')
  const coinsRef = useRef([])

  const fetchCoins = useCallback(async () => {
    try {
      const coins = await fetchCoinList(50)
      if (coins.length) {
        coinsRef.current = coins
        setCurrentCoins([...coins])
      }
    } catch (error) {
      console.error('Error fetching coin data:', error)
    }
  }, [])

  const fetchBalance = useCallback(async () => {
    if (!isLoggedIn()) {
      setTotalUsdt('0.00')
      setTotalFiat('≈$0.00')
      return
    }
    try {
      const data = await apiGetSpotBalance()
      if (data.status === 'success') {
        setTotalUsdt(parseFloat(data.total_usdt || 0).toFixed(2))
        setTotalFiat(`≈$${data.total_fiat || '0.00'}`)
      }
    } catch {
      setTotalUsdt('0.00')
      setTotalFiat('≈$0.00')
    }
  }, [])

  useEffect(() => {
    fetchCoins()
    fetchBalance()
    const fetchInterval = setInterval(fetchCoins, 60000)
    const fluctInterval = setInterval(() => {
      if (!coinsRef.current.length) return
      coinsRef.current.forEach((c) => {
        const fluctuation = 1 + (Math.random() * 0.001 - 0.0005)
        let newRate = c.currentRate * fluctuation
        if (newRate > c.realRate * 1.005) newRate = c.realRate * 1.005
        if (newRate < c.realRate * 0.995) newRate = c.realRate * 0.995
        c.currentRate = newRate
        c.rate = newRate
      })
      setCurrentCoins([...coinsRef.current])
    }, 1000)
    return () => {
      clearInterval(fetchInterval)
      clearInterval(fluctInterval)
    }
  }, [fetchCoins, fetchBalance])

  useEffect(() => {
    setLoggedIn(isLoggedIn())
    const onStorage = () => setLoggedIn(isLoggedIn())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    localStorage.setItem(HIDE_BALANCE_KEY, hideBalance ? '1' : '0')
  }, [hideBalance])

  const requireAuth = (e, path) => {
    if (isLoggedIn()) return true
    e.preventDefault()
    alert('Please register or log in to access this feature.')
    navigate('/login', { state: { from: path } })
    return false
  }

  const openTradingModal = (code, rate, chgPercent) => {
    setModalCoin({ code, rate, chgPercent })
    setModalOpen(true)
  }

  const user = getAuthUser()
  const targetSymbols = ['BTC', 'ETH', 'DOGE']
  const topCoins = targetSymbols.map((sym) => currentCoins.find((c) => c.code === sym)).filter(Boolean)
  const displayCoins = topCoins.length === 3 ? topCoins : currentCoins.slice(0, 3)

  const tickerData = currentCoins.slice(0, 10).map((c) => {
    const deltaDay = c.delta?.day ?? 1
    const chgPercent = ((deltaDay - 1) * 100)
    const isRed = chgPercent < 0
    return {
      label: `${c.code}: ${formatPrice(c.rate)}`,
      chg: (chgPercent > 0 ? '+' : '') + chgPercent.toFixed(2) + '%',
      red: isRed,
    }
  })
  const combinedTicker = [...tickerData, ...tickerData]

  const eyeOpen = (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  )
  const eyeClosed = (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </>
  )

  return (
    <div className={hideBalance ? 'hide-balances' : ''}>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {combinedTicker.map((t, i) => (
            <div className="ticker-item" key={i}>
              <span className={t.red ? 'dot red' : 'dot'} />
              <span className="ticker-label">{t.label}</span>
              <span className={`ticker-badge ${t.red ? 'badge-red' : 'badge-green'}`}>{t.chg}</span>
            </div>
          ))}
        </div>
      </div>

      <header>
        <div className="logo-wrap">
          <Link to="/"><img src="/images/CoinSwtich.png" alt="" /></Link>
          <span className="welcome-text">
            {loggedIn && user?.username ? `Hi, ${user.username}` : 'Welcome!'}
          </span>
        </div>
        <Link to="/notification" className="bell-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Link>
      </header>

      <main>
        <section className="home-assets">
          <div className="home-assets-head">
            <span className="home-assets-label">Total assets (USDT)</span>
            {loggedIn && (
              <button
                type="button"
                className="home-assets-eye"
                onClick={() => setHideBalance((h) => !h)}
                aria-label={hideBalance ? 'Show balance' : 'Hide balance'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {hideBalance ? eyeClosed : eyeOpen}
                </svg>
              </button>
            )}
          </div>
          {loggedIn ? (
            <>
              <div className="home-assets-values">
                <span className="home-assets-main val-sensitive">{totalUsdt}</span>
                <span className="home-assets-fiat val-sensitive">{totalFiat}</span>
              </div>
              <Link to="/spot" className="home-assets-freeze" onClick={(e) => requireAuth(e, '/spot')}>
                Manage freeze on Spot →
              </Link>
            </>
          ) : (
            <p className="home-assets-guest">
              <Link to="/login">Log in</Link> or <Link to="/signup">register</Link> to view balance, recharge, withdraw &amp; spot.
            </p>
          )}
        </section>

        <section className="market-overview">
          <h1 className="section-title">Market <span>Overview</span></h1>
          <div className="market-cards">
            {displayCoins.map((c) => {
              const deltaDay = c.delta?.day ?? 1
              const chgPercent = ((deltaDay - 1) * 100)
              const isRed = chgPercent < 0
              const chgStr = Math.abs(chgPercent).toFixed(2) + '%'
              const arrow = isRed ? '▼' : '▲'
              const priceStr = formatPrice(c.rate)
              return (
                <div className="market-card" key={c.code}>
                  <div className="market-card-top">
                    <CoinIcon code={c.code} png={c.png32 || c.png64} color={c.color} size={28} />
                    <div className="pair">{c.code}<span>/USD</span></div>
                  </div>
                  <div className="price" style={priceStr.length > 8 ? { fontSize: '13px' } : {}}>{priceStr}</div>
                  <div className="change" style={{ color: isRed ? '#e84545' : '#00c896' }}>
                    <span className="change-arrow">{arrow}</span> {chgStr}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="qa-grid">
            <div className="qa-card">
              <Link to="/recharge" onClick={(e) => requireAuth(e, '/recharge')}>
                <img src="/images/recharge.png" alt="Recharge" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
              </Link>
              <span className="qa-label">Recharge</span>
            </div>
            <div className="qa-card">
              <Link to="/withdraw" onClick={(e) => requireAuth(e, '/withdraw')}>
                <img src="/images/withdraw.png" alt="Withdraw" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
              </Link>
              <span className="qa-label">Withdraw</span>
            </div>
            <div className="qa-card">
              <Link to="/exchange" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <img src="/images/convert.jpg" alt="Convert" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                <span className="qa-label">Exchange</span>
              </Link>
            </div>
            <div className="qa-card">
              <Link
                to="/spot"
                onClick={(e) => requireAuth(e, '/spot')}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a4a8a, #0b5ed7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px #0b5ed740' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <span className="qa-label" style={{ color: '#c9d2de' }}>Spot</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="trading-hall">
          <div className="trading-hall-header">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Trading Hall</h2>
            <div className="live-badge"><span className="live-dot" /> Live</div>
          </div>
          <table className="trade-table">
            <thead>
              <tr>
                <th>Name/Turnover</th>
                <th style={{ textAlign: 'center' }}>Last price</th>
                <th style={{ textAlign: 'right' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {currentCoins.slice(0, 15).map((c) => {
                const deltaDay = c.delta?.day ?? 1
                const chgPercent = ((deltaDay - 1) * 100)
                const isRed = chgPercent < 0
                const priceColor = isRed ? '#e84545' : '#00c896'
                const chgStr = (chgPercent > 0 ? '+' : '') + chgPercent.toFixed(2) + '%'
                const priceStr = formatPrice(c.rate)
                const usdStr = '$' + priceStr
                const turnoverStr = formatVolume(c.volume || 0)
                return (
                  <tr key={c.code} onClick={() => openTradingModal(c.code, c.rate, chgPercent)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="coin-cell">
                        <CoinIcon code={c.code} png={c.png32 || c.png64} color={c.color} />
                        <div className="coin-name-wrap">
                          <div><span className="coin-base">{c.code}</span><span className="coin-quote">/USD</span></div>
                          <div className="coin-turnover">{turnoverStr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-main" style={{ color: priceColor }}>{priceStr}</div>
                      <div className="price-usd">{usdStr}</div>
                    </td>
                    <td className="change-cell">
                      <span className={`chg-badge ${isRed ? 'chg-red' : 'chg-green'}`}>{chgStr}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </main>

      <BottomNav activePage="/" />

      <TradingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        coinCode={modalCoin.code}
        coinRate={modalCoin.rate}
        chgPercent={modalCoin.chgPercent}
        currentCoins={currentCoins}
        formatPrice={formatPrice}
      />
    </div>
  )
}
