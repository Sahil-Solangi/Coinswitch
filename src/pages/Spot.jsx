import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import CoinIcon from '../components/CoinIcon'
import { fetchCoinLogoMap } from '../utils/coinApi'
import { apiGetSpotBalance, apiUpdateFreeze } from '../utils/api'
import '../styles/spot.css'

const HIDE_BALANCE_KEY = 'coinswitch-hide-balances'

const previewCoins = [
  { symbol: "USDT", pair: "USDT/USDT", available: "0.00", lockup: "0.00", freeze: "0.00", color: "#26a17b", fiat: "0.0" },
  { symbol: "BTC", pair: "BTC/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#f7931a", fiat: "0.0" },
  { symbol: "ETH", pair: "ETH/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#627eea", fiat: "0.0" },
  { symbol: "DOGE", pair: "DOGE/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#f3ba2f", fiat: "0.0" },
  { symbol: "BNB", pair: "BNB/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#f3ba2f", fiat: "0.0" },
  { symbol: "SOL", pair: "SOL/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#14f195", fiat: "0.0" },
  { symbol: "ADA", pair: "ADA/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#0033ad", fiat: "0.0" },
  { symbol: "XRP", pair: "XRP/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#23292f", fiat: "0.0" },
  { symbol: "BCH", pair: "BCH/USDT", available: "0.00000000", lockup: "0.00000000", freeze: "0.00000000", color: "#8dc351", fiat: "0.0" },
]

export default function Spot() {
  const [activeTab, setActiveTab] = useState('spot')
  const [isHidden, setIsHidden] = useState(() => localStorage.getItem(HIDE_BALANCE_KEY) === '1')
  const [logoMap, setLogoMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const [coins, setCoins] = useState([])
  const [totalUsdt, setTotalUsdt] = useState('0')
  const [totalFiat, setTotalFiat] = useState('≈$0.00')
  const [spinning, setSpinning] = useState(false)

  const fetchSpotBalances = useCallback(async () => {
    try {
      setLoading(true)
      setApiError(false)
      const data = await apiGetSpotBalance()
      if (data.status === "success" && data.balances) {
        setTotalUsdt(parseFloat(data.total_usdt).toString())
        setTotalFiat(`≈$${data.total_fiat || '0.00'}`)
        setCoins(data.balances.map(coin => ({
          symbol: coin.symbol, pair: `${coin.symbol}/USDT`,
          available: parseFloat(coin.available).toFixed(8).replace(/\.?0+$/, '') || '0',
          lockup: parseFloat(coin.lockup || 0).toFixed(8).replace(/\.?0+$/, '') || '0',
          freeze: parseFloat(coin.freeze || 0).toFixed(8).replace(/\.?0+$/, '') || '0',
          color: coin.color || '#333', fiat: coin.fiat || '0.0',
        })))
        setLoading(false)
      } else throw new Error("Invalid API response format")
    } catch (error) {
      console.error("Database connection failed:", error)
      setApiError(true)
      setLoading(false)
      setTotalUsdt('0')
      setTotalFiat('≈$0.00')
      setCoins(previewCoins)
    }
  }, [])

  useEffect(() => { fetchSpotBalances() }, [fetchSpotBalances])

  useEffect(() => {
    fetchCoinLogoMap(50).then(setLogoMap).catch(() => setLogoMap({}))
  }, [])

  useEffect(() => {
    localStorage.setItem(HIDE_BALANCE_KEY, isHidden ? '1' : '0')
  }, [isHidden])

  const handleRefresh = () => {
    setSpinning(true)
    setLoading(true)
    setApiError(false)
    fetchSpotBalances().then(() => {
      setTimeout(() => setSpinning(false), 500)
    })
  }

  const handleManageFreeze = async (symbol, action) => {
    const coin = coins.find((c) => c.symbol === symbol)
    if (!coin) return

    const amountStr = window.prompt(
      `How much ${symbol} do you want to ${action}? (${action === 'freeze' ? 'Available: ' + coin.available : 'Frozen: ' + coin.freeze})`
    )
    if (amountStr === null) return

    const amount = parseFloat(amountStr)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0.')
      return
    }

    try {
      const data = await apiUpdateFreeze(symbol, action, amount)
      setTotalUsdt(parseFloat(data.total_usdt).toString())
      setTotalFiat(`≈$${data.total_fiat || '0.00'}`)
      setCoins(data.balances.map((c) => ({
        symbol: c.symbol,
        pair: `${c.symbol}/USDT`,
        available: parseFloat(c.available).toFixed(8).replace(/\.?0+$/, '') || '0',
        lockup: parseFloat(c.lockup || 0).toFixed(8).replace(/\.?0+$/, '') || '0',
        freeze: parseFloat(c.freeze || 0).toFixed(8).replace(/\.?0+$/, '') || '0',
        color: c.color || '#333',
        fiat: c.fiat || '0.0',
      })))
    } catch (err) {
      alert(err.message || 'Freeze update failed')
    }
  }

  const handleTabClick = (target) => { setActiveTab(target) }

  const eyeOpenSvg = <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
  const eyeClosedSvg = <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>

  return (
    <div className={isHidden ? 'hide-balances' : ''}>
      {/* TOP TABS */}
      <header className="top-tabs">
        {['overview', 'spot', 'contract', 'financial'].map(tab => (
          <div key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => handleTabClick(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </header>

      <main>
        {/* API ERROR BANNER */}
        <div className="api-error-msg" style={{ display: apiError ? 'block' : 'none' }}>
          Could not connect to database (api/get_spot_balance.php). Please check your PHP/MySQL backend.
        </div>

        {/* TOTAL ASSETS */}
        <section className="total-assets-sec">
          <div className="assets-label-row">
            <span className="label-text">Total assets (USDT)</span>
            <svg className={`icon-eye`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={() => setIsHidden(!isHidden)} style={{ cursor: 'pointer' }}>
              {isHidden ? eyeClosedSvg : eyeOpenSvg}
            </svg>
            <svg className={`icon-refresh${spinning ? ' spinning' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={handleRefresh} style={{ cursor: 'pointer' }}>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <div className="hide-zero-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
          </div>

          <div className="assets-value-row">
            <span className="main-val val-text">{totalUsdt}</span>
            <span className="fiat-val val-text">{totalFiat}</span>
          </div>

          <div className="action-buttons">
            <Link to="/recharge" className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              Deposit
            </Link>
            <Link to="/withdraw" className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
              Withdraw
            </Link>
            <Link to="/exchange" className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 14 8 12 10"></polyline><line x1="14" y1="8" x2="14" y2="16"></line><polyline points="8 14 10 16 12 14"></polyline><line x1="10" y1="16" x2="10" y2="8"></line></svg>
              Exchange
            </Link>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section className="portfolio-sec">
          <h2 className="section-title">Portfolio</h2>

          {/* SPOT TAB */}
          <div style={{ display: activeTab === 'spot' ? 'block' : 'none' }}>
            {loading && <div className="loading-state">Connecting to database...</div>}
            <div className="coin-list" style={{ display: !loading ? 'flex' : 'none' }}>
              {coins.map(coin => {
                const total = (parseFloat(coin.available) + parseFloat(coin.lockup) + parseFloat(coin.freeze)).toString()
                return (
                  <div className="coin-item" key={coin.symbol}>
                    <div className="coin-header">
                      <div className="coin-header-left">
                        <CoinIcon
                          code={coin.symbol}
                          png={logoMap[coin.symbol]?.png32 || logoMap[coin.symbol]?.png64}
                          color={logoMap[coin.symbol]?.color || coin.color}
                        />
                        <div className="coin-name">{coin.pair}</div>
                      </div>
                      <div className="coin-header-right">
                        <div className="coin-total"><span className="val-text">{total}</span> <span style={{ fontSize: '12px', fontWeight: 'normal' }}>USDT</span></div>
                        <div className="coin-fiat val-text">≈$ {coin.fiat}</div>
                      </div>
                    </div>
                    <div className="coin-stats">
                      <div className="stat-item"><div className="stat-label">Available</div><div className="stat-value val-text">{coin.available}</div></div>
                      <div className="stat-item"><div className="stat-label">LOCK-UP</div><div className="stat-value val-text">{coin.lockup}</div></div>
                      <div className="stat-item">
                        <div className="stat-label">
                          Freeze
                          <span style={{ marginLeft: '4px', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: '11px' }} onClick={() => handleManageFreeze(coin.symbol, 'freeze')}>+</span>
                          <span style={{ marginLeft: '4px', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: '11px' }} onClick={() => handleManageFreeze(coin.symbol, 'unfreeze')}>-</span>
                        </div>
                        <div className="stat-value val-text">{coin.freeze}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* OVERVIEW TAB */}
          <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
            <div className="overview-list">
              {[
                { name: 'Spot', icon: <><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></> },
                { name: 'Contract', icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></> },
                { name: 'Delivery contract account', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></> },
                { name: 'Financial account', icon: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></> },
                { name: 'Miner assets', icon: <><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></> },
              ].map((item, i) => (
                <div className="overview-item" key={i}>
                  <div className="overview-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
                    {item.name}
                  </div>
                  <div className="overview-right">
                    <div className="overview-total"><span className="val-text">0</span> <span style={{ fontWeight: 'normal', fontSize: '12px' }}>USDT</span></div>
                    <div className="overview-fiat val-text">≈$ 0.00</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: activeTab === 'contract' ? 'block' : 'none', padding: '40px', textAlign: 'center', color: 'var(--text-sub)' }}>Contract Account Data</div>
          <div style={{ display: activeTab === 'financial' ? 'block' : 'none', padding: '40px', textAlign: 'center', color: 'var(--text-sub)' }}>Financial Account Data</div>
        </section>
      </main>

      <BottomNav activePage="/spot" />
    </div>
  )
}
