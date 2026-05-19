import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import '../styles/exchange.css'

const API_URL = "https://api.livecoinwatch.com/coins/list"
const API_KEY = "3c2c8d38-0771-4eb8-8a85-1b46e5fdcc29"
const WANTED = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "DOGE", "ADA", "MATIC", "LTC", "TRX", "AVAX", "SHIB", "DOT", "LINK"]

function fmt(n) {
  if (!n && n !== 0) return "0"
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 })
      if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 4 })
  return n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "") || "0"
}

function logoHTML(symbol, coin, size = 28) {
  if (coin && coin.png) {
    return <img src={coin.png} alt={symbol} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', background: '#222' }} onError={(e) => { e.target.outerHTML = `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${coin.color || '#555'};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.45)}px;font-weight:700;color:#fff;">${symbol.charAt(0)}</div>` }} />
  }
  const color = (coin && coin.color) ? coin.color : "#555"
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.45), fontWeight: 700, color: '#fff', flexShrink: 0 }}>{symbol.charAt(0)}</div>
}

export default function Exchange() {
  useEffect(() => {
    document.title = " Coinswitch | Exchange";
  }, []);

  const navigate = useNavigate()
  const [coinData, setCoinData] = useState({})
  const [fromSymbol, setFromSymbol] = useState("BTC")
  const [toSymbol, setToSymbol] = useState("USDT")
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromFiat, setFromFiat] = useState('≈ $0.00')
  const [toFiat, setToFiat] = useState('≈ $0.00')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [pickerTarget, setPickerTarget] = useState('from')
  const [pickerSearch, setPickerSearch] = useState('')
  const [bannerRate, setBannerRate] = useState('Loading...')
  const [exchangeRateDisplay, setExchangeRateDisplay] = useState('1 BTC = -- USDT')
  const [receiveDisplay, setReceiveDisplay] = useState('-- USDT')

  const recalculate = useCallback((data, from, to, amt) => {
    const fromAmt = parseFloat(amt) || 0
    const fr = (data[from] || {}).rate || 0
    const tr = (data[to] || {}).rate || 0
    const toAmt = (tr > 0) ? (fromAmt * fr) / tr : 0
    setToAmount(toAmt > 0 ? toAmt.toFixed(8) : '')
    setFromFiat(`≈ $${fmt(fromAmt * fr)}`)
    setToFiat(`≈ $${fmt(toAmt * tr)}`)
    setReceiveDisplay(toAmt > 0 ? `${fmt(toAmt)} ${to}` : `-- ${to}`)
    if (fr && tr) {
      setExchangeRateDisplay(`1 ${from} = ${fmt(fr / tr)} ${to}`)
      setBannerRate(`1 ${from} = ${fmt(fr / tr)} ${to}`)
    }
  }, [])

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ currency: "USD", sort: "rank", order: "ascending", offset: 0, limit: 50, meta: true }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const newCoinData = {}
        data.forEach(coin => {
          if (!coin.code) return
          newCoinData[coin.code] = { rate: coin.rate || 0, name: coin.name || coin.code, png: coin.png32 || coin.png64 || "", color: coin.color || "#555" }
        })
        if (!newCoinData["USDT"]) newCoinData["USDT"] = { rate: 1, name: "Tether", png: "", color: "#26a17b" }
        else newCoinData["USDT"].rate = 1
        setCoinData(newCoinData)
        recalculate(newCoinData, fromSymbol, toSymbol, fromAmount)
      }
    } catch (err) {
      console.error("Rate fetch failed:", err)
      // Fallback
      const fallback = { BTC: { rate: 65000, name: "Bitcoin", png: "", color: "#f7931a" }, ETH: { rate: 3200, name: "Ethereum", png: "", color: "#627eea" }, USDT: { rate: 1, name: "Tether", png: "", color: "#26a17b" }, BNB: { rate: 580, name: "BNB", png: "", color: "#f0b90b" }, SOL: { rate: 160, name: "Solana", png: "", color: "#9945ff" }, XRP: { rate: 0.52, name: "XRP", png: "", color: "#23292f" }, DOGE: { rate: 0.14, name: "Dogecoin", png: "", color: "#c2a633" }, ADA: { rate: 0.45, name: "Cardano", png: "", color: "#0033ad" }, MATIC: { rate: 0.8, name: "Polygon", png: "", color: "#8247e5" }, LTC: { rate: 84, name: "Litecoin", png: "", color: "#bebebe" }, TRX: { rate: 0.12, name: "TRON", png: "", color: "#ef0027" }, AVAX: { rate: 36, name: "Avalanche", png: "", color: "#e84142" }, SHIB: { rate: 0.000023, name: "Shiba Inu", png: "", color: "#ffa409" }, DOT: { rate: 7.5, name: "Polkadot", png: "", color: "#e6007a" }, LINK: { rate: 18, name: "Chainlink", png: "", color: "#2a5ada" } }
      setCoinData(fallback)
      recalculate(fallback, fromSymbol, toSymbol, fromAmount)
    }
  }, [fromSymbol, toSymbol, fromAmount, recalculate])

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 15000)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFromAmountChange = (val) => {
    setFromAmount(val)
    recalculate(coinData, fromSymbol, toSymbol, val)
  }

  const flipCoins = () => {
    const newFrom = toSymbol
    const newTo = fromSymbol
    setFromSymbol(newFrom)
    setToSymbol(newTo)
    recalculate(coinData, newFrom, newTo, fromAmount)
  }

  const setPct = (pct) => {
    const maxBalance = 1
    const val = ((maxBalance * pct) / 100).toFixed(8)
    setFromAmount(val)
    recalculate(coinData, fromSymbol, toSymbol, val)
  }

  const confirmExchange = () => {
    const fromAmt = parseFloat(fromAmount)
    if (!fromAmt || fromAmt <= 0) return
    const toAmt = parseFloat(toAmount) || 0
    setSuccessMsg(`${fmt(fromAmt)} ${fromSymbol} → ${fmt(toAmt)} ${toSymbol}. Order submitted at live market rate.`)
    setShowSuccess(true)
  }

  const closeSuccess = () => {
    setShowSuccess(false)
    setFromAmount('')
    setToAmount('')
    recalculate(coinData, fromSymbol, toSymbol, '')
  }

  const openPicker = (target) => {
    setPickerTarget(target)
    setPickerSearch('')
    setShowPicker(true)
  }

  const selectCoin = (symbol) => {
    if (pickerTarget === 'from') setFromSymbol(symbol)
    else setToSymbol(symbol)
    setShowPicker(false)
    const newFrom = pickerTarget === 'from' ? symbol : fromSymbol
    const newTo = pickerTarget === 'to' ? symbol : toSymbol
    recalculate(coinData, newFrom, newTo, fromAmount)
  }

  const filteredSymbols = pickerSearch.trim()
    ? WANTED.filter(s => { const d = coinData[s] || {}; return s.toLowerCase().includes(pickerSearch.toLowerCase()) || (d.name || "").toLowerCase().includes(pickerSearch.toLowerCase()) })
    : WANTED

  return (
    <>
      <header className="top-header">
        <div className="header-left">
          <a href="#" className="back-btn" onClick={(e) => { e.preventDefault(); navigate(-1) }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </a>
          <h1>Exchange</h1>
        </div>
        <a href="#" className="history-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          History
        </a>
      </header>

      <main>
        <div className="rate-banner">
          <div className="rate-banner-left"><div className="live-dot"></div>Live Rates</div>
          <div className="rate-text">{bannerRate}</div>
        </div>

        <div className="swap-container">
          <div className="swap-card" id="fromCard">
            <div className="swap-card-label">From</div>
            <div className="swap-card-body">
              <div className="coin-selector" onClick={() => openPicker('from')}>
                <div className="coin-selector-icon">{logoHTML(fromSymbol, coinData[fromSymbol], 28)}</div>
                <span className="coin-selector-name">{fromSymbol}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="amount-input">
                <input type="number" placeholder="0.00" min="0" step="any" value={fromAmount} onChange={(e) => handleFromAmountChange(e.target.value)} />
                <div className="fiat-equiv">{fromFiat}</div>
              </div>
            </div>
            <div className="swap-card-footer">
              <div className="balance-info">Available: <span>0.00</span></div>
              <div className="pct-buttons">
                <button className="pct-btn" onClick={() => setPct(25)}>25%</button>
                <button className="pct-btn" onClick={() => setPct(50)}>50%</button>
                <button className="pct-btn" onClick={() => setPct(75)}>75%</button>
                <button className="pct-btn" onClick={() => setPct(100)}>MAX</button>
              </div>
            </div>
          </div>

          <div className="swap-flip-wrap">
            <button className="swap-flip-btn" onClick={flipCoins}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
            </button>
          </div>

          <div className="swap-card" id="toCard">
            <div className="swap-card-label">To</div>
            <div className="swap-card-body">
              <div className="coin-selector" onClick={() => openPicker('to')}>
                <div className="coin-selector-icon">{logoHTML(toSymbol, coinData[toSymbol], 28)}</div>
                <span className="coin-selector-name">{toSymbol}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="amount-input">
                <input type="number" placeholder="0.00" readOnly value={toAmount} />
                <div className="fiat-equiv">{toFiat}</div>
              </div>
            </div>
            <div className="swap-card-footer">
              <div className="balance-info">Available: <span>0.00</span></div>
            </div>
          </div>
        </div>

        <div className="rate-info-box">
          <div className="rate-row"><span className="label">Exchange Rate</span><span className="value">{exchangeRateDisplay}</span></div>
          <div className="rate-row"><span className="label">Fee</span><span className="value green">0% (Free)</span></div>
          <div className="rate-row"><span className="label">You Receive</span><span className="value">{receiveDisplay}</span></div>
        </div>

        <div className="submit-wrap">
          <button className="submit-btn" onClick={confirmExchange}>Exchange Now</button>
        </div>
      </main>

      {/* Success Overlay */}
      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-card">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div className="success-title">Exchange Submitted!</div>
          <div className="success-desc">{successMsg}</div>
          <button className="success-close-btn" onClick={closeSuccess}>Done</button>
        </div>
      </div>

      {/* Coin Picker */}
      <div className={`picker-overlay${showPicker ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setShowPicker(false) }}>
        <div className="picker-sheet">
          <div className="picker-header">
            <span className="picker-title">Select Coin</span>
            <button className="picker-close" onClick={() => setShowPicker(false)}>×</button>
          </div>
          <div className="picker-search">
            <input type="text" placeholder="Search coin..." value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} />
          </div>
          <div className="picker-list">
            {filteredSymbols.map(s => {
              const coin = coinData[s] || { rate: 0, name: s, png: "", color: "#555" }
              const priceStr = coin.rate ? `$${fmt(coin.rate)}` : "…"
              return (
                <div className="picker-item" key={s} onClick={() => selectCoin(s)}>
                  <div className="picker-item-icon">{logoHTML(s, coin, 36)}</div>
                  <div className="picker-item-info"><h4>{s}</h4><p>{coin.name}</p></div>
                  <div className="picker-item-rate"><div className="price">{priceStr}</div></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
