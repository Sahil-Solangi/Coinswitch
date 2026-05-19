import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { apiGetRecharge, apiRecharge } from '../utils/api'
import '../styles/recharge.css'

export default function Recharge() {
  const [amount, setAmount] = useState('10')
  const [activeBtn, setActiveBtn] = useState('10')
  const [inrBalance, setInrBalance] = useState('0.00')
  const [submitting, setSubmitting] = useState(false)
  const quickAmounts = ['10', '50', '100', '500', '1000', '5000']

  useEffect(() => {
    apiGetRecharge()
      .then((data) => setInrBalance(parseFloat(data.inr_balance || 0).toFixed(2)))
      .catch(() => setInrBalance('0.00'))
  }, [])

  const handleQuickSelect = (val) => {
    setActiveBtn(val)
    setAmount(val)
  }

  const handleSubmit = async () => {
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) {
      alert('Enter a valid recharge amount.')
      return
    }
    setSubmitting(true)
    try {
      const data = await apiRecharge(val, 'Bank Card')
      setInrBalance(parseFloat(data.inr_balance || 0).toFixed(2))
      alert(data.message || 'Recharge successful')
    } catch (err) {
      alert(err.message || 'Recharge failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="top-header">
        <div className="left">
          <Link to="/" className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <span className="title">Recharge Center</span>
        </div>
      </header>

      <main>
        <section className="balance-card">
          <div className="card-title">My Balance</div>
          <div className="card-amount">₹{inrBalance} <span className="currency">INR</span></div>
        </section>

        <section className="recharge-section">
          <h2>Recharge amount</h2>
          <div className="input-wrapper">
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </section>

        <section className="quick-select-section">
          <h2>Quick Select</h2>
          <div className="quick-grid">
            {quickAmounts.map((val) => (
              <div key={val} className={`quick-btn${activeBtn === val ? ' active' : ''}`} onClick={() => handleQuickSelect(val)}>₹{val}</div>
            ))}
          </div>
        </section>

        <section className="payment-method-section">
          <h2>Payment Method</h2>
          <div className="payment-option"><span className="method-name">Bank Card</span></div>
        </section>
      </main>

      <div className="submit-wrapper">
        <button type="button" className="submit-btn" disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Processing...' : 'Submit recharge'}
        </button>
      </div>

      <BottomNav />
    </>
  )
}
