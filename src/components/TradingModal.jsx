import { useState, useEffect, useCallback } from 'react'

export default function TradingModal({ isOpen, onClose, coinCode, coinRate, chgPercent, currentCoins, formatPrice }) {
  const [tradeMode, setTradeMode] = useState('buy')
  const [priceInput, setPriceInput] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [totalValue, setTotalValue] = useState('0.00')
  const [bids, setBids] = useState([])
  const [asks, setAsks] = useState([])

  const generateOrderBook = useCallback((currentPrice) => {
    const newBids = []
    const newAsks = []
    let bidP = currentPrice * 0.9995
    for (let i = 0; i < 6; i++) {
      newBids.push({ price: formatPrice(bidP), amount: (Math.random() * 1.5).toFixed(2) })
      bidP *= 0.9995
    }
    let askP = currentPrice * 1.0005
    for (let i = 0; i < 6; i++) {
      newAsks.push({ price: formatPrice(askP), amount: (Math.random() * 1.5).toFixed(2) })
      askP *= 1.0005
    }
    setBids(newBids.reverse())
    setAsks(newAsks)
  }, [formatPrice])

  useEffect(() => {
    if (isOpen && coinRate) {
      setPriceInput(formatPrice(coinRate))
      setAmountInput('')
      setTotalValue('0.00')
      setTradeMode('buy')
      generateOrderBook(coinRate)
    }
  }, [isOpen, coinCode, coinRate, formatPrice, generateOrderBook])

  // Update live price from currentCoins
  useEffect(() => {
    if (!isOpen || !coinCode) return
    const coin = currentCoins.find(c => c.code === coinCode)
    if (!coin) return
    generateOrderBook(coin.rate)
  }, [isOpen, coinCode, currentCoins, generateOrderBook])

  const calculateTotal = useCallback((price, amount) => {
    const p = parseFloat(price) || 0
    const a = parseFloat(amount) || 0
    setTotalValue((p * a).toFixed(2))
  }, [])

  const handleAmountChange = (val) => {
    setAmountInput(val)
    calculateTotal(priceInput, val)
  }

  const handleSetTradeMode = (mode) => {
    setTradeMode(mode)
    calculateTotal(priceInput, amountInput)
  }

  const handleSetPercentage = (pct) => {
    alert("Real balance is required to calculate percentage. Please connect backend API.")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      pair: coinCode + '/USDT',
      mode: tradeMode,
      price: priceInput,
      amount: amountInput,
      total: totalValue
    }
    console.log("Order Submitted to Database:", payload)
    alert(`${tradeMode.toUpperCase()} Order Submitted!\nPair: ${payload.pair}\nAmount: ${payload.amount}\nTotal: ${payload.total} USDT`)
    setAmountInput('')
    setTotalValue('0.00')
  }

  if (!isOpen) return null

  const coin = currentCoins.find(c => c.code === coinCode)
  const currentRate = coin ? coin.rate : coinRate
  const deltaDay = coin && coin.delta && coin.delta.day ? coin.delta.day : 1
  const currentChgPercent = coin ? ((deltaDay - 1) * 100) : chgPercent
  const isRed = currentChgPercent < 0
  const chgStr = (currentChgPercent > 0 ? "+" : "") + currentChgPercent.toFixed(2) + "%"
  const currentPriceStr = formatPrice(currentRate)

  return (
    <div className="trading-modal open">
      <div className="tm-header">
        <div className="tm-header-left">
          <span className="tm-back" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </span>
          <h2>{coinCode}/USDT</h2>
          <span className="tm-change" style={{ color: isRed ? 'var(--red)' : 'var(--green)' }}>{chgStr}</span>
        </div>
        <div className="tm-header-right">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect x="4" y="10" width="4" height="10" rx="1" />
            <rect x="10" y="4" width="4" height="16" rx="1" />
            <rect x="16" y="14" width="4" height="6" rx="1" />
            <line x1="6" y1="22" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="18" y1="22" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div className="tm-body">
        <form className="tm-left" onSubmit={handleSubmit}>
          <div className="tm-tabs">
            <button type="button" className={`tm-tab${tradeMode === 'buy' ? ' active buy' : ''}`}
              style={tradeMode === 'buy' ? { backgroundColor: 'var(--green)', color: '#fff' } : {}}
              onClick={() => handleSetTradeMode('buy')}>Buy</button>
            <button type="button" className={`tm-tab${tradeMode === 'sell' ? ' active sell' : ''}`}
              style={tradeMode === 'sell' ? { backgroundColor: 'var(--red)', color: '#fff' } : {}}
              onClick={() => handleSetTradeMode('sell')}>Sell</button>
          </div>

          <div className="tm-dropdown">
            <span>Market Order</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          <div className="tm-input-group">
            <input type="number" step="any" value={priceInput} onChange={(e) => { setPriceInput(e.target.value); calculateTotal(e.target.value, amountInput) }} required />
            <span className="tm-unit">USDT</span>
          </div>

          <div className="tm-dropdown" style={{ justifyContent: 'center', background: '#202631', border: 'none' }}>
            <span>Market Order</span>
          </div>

          <div className="tm-sub-tabs">
            <button type="button" className="tm-sub-tab active">Number</button>
            <button type="button" className="tm-sub-tab">Fiat Amount</button>
          </div>

          <div className="tm-input-group">
            <input type="number" step="any" placeholder="Amount" value={amountInput} onChange={(e) => handleAmountChange(e.target.value)} required />
            <span className="tm-unit">{coinCode}</span>
          </div>

          <div className="tm-percentages">
            <button type="button" onClick={() => handleSetPercentage(0.25)}>25%</button>
            <button type="button" onClick={() => handleSetPercentage(0.50)}>50%</button>
            <button type="button" onClick={() => handleSetPercentage(0.75)}>75%</button>
            <button type="button" onClick={() => handleSetPercentage(1.00)}>100%</button>
          </div>

          <div className="tm-available">
            <span>Available -- {tradeMode === 'buy' ? 'USDT' : (coinCode || 'COIN')}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#0b5ed7" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>

          <div style={{ fontSize: '13px', color: '#c9d2de', textAlign: 'right', marginTop: '-5px', marginBottom: '5px' }}>
            Total: <span style={{ fontWeight: 'bold', color: '#fff' }}>{totalValue}</span> USDT
          </div>

          <button type="submit" className={`tm-action-btn ${tradeMode}`}
            style={{ backgroundColor: tradeMode === 'buy' ? 'var(--green)' : 'var(--red)' }}>
            {tradeMode === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </form>

        <div className="tm-right">
          <div className="ob-header">
            <span>Price<br /><span style={{ fontSize: '10px' }}>(USDT)</span></span>
            <span style={{ textAlign: 'right' }}>Number<br /><span style={{ fontSize: '10px' }}>({coinCode})</span></span>
          </div>

          <div className="ob-list green-list">
            {bids.map((b, i) => (
              <div className={`ob-row${i === bids.length - 1 ? ' active-row' : ''}`} key={i}>
                <span className="ob-price">{b.price}</span>
                <span className="ob-amount">{b.amount}</span>
              </div>
            ))}
          </div>

          <div className="ob-current-price">
            <div className="price-val" style={{ color: isRed ? 'var(--red)' : 'var(--green)' }}>{currentPriceStr}</div>
            <div className="price-eq">≈{currentPriceStr}</div>
          </div>

          <div className="ob-list red-list">
            {asks.map((a, i) => (
              <div className="ob-row" key={i}>
                <span className="ob-price">{a.price}</span>
                <span className="ob-amount">{a.amount}</span>
              </div>
            ))}
          </div>

          <div className="ob-footer">
            <div className="ob-dropdown">
              <span>0.1</span>
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <rect x="2" y="4" width="8" height="6" fill="#00c896" />
              <rect x="2" y="14" width="8" height="6" fill="#e84545" />
              <rect x="14" y="4" width="8" height="6" fill="#00c896" />
              <rect x="14" y="14" width="8" height="6" fill="#e84545" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
