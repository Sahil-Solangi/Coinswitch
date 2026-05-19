import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { apiGetWithdraw, apiWithdraw } from '../utils/api'
import '../styles/withdraw.css'

export default function Withdraw() {
  const [inrBalance, setInrBalance] = useState('0.00')
  const [amount, setAmount] = useState('0')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiGetWithdraw()
      .then((data) => setInrBalance(parseFloat(data.inr_balance || 0).toFixed(2)))
      .catch(() => setInrBalance('0.00'))
  }, [])

  const handleSubmit = async () => {
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) {
      alert('Enter a valid withdrawal amount.')
      return
    }
    setSubmitting(true)
    try {
      const data = await apiWithdraw({
        amount: val,
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        ifsc,
      })
      setInrBalance(parseFloat(data.inr_balance || 0).toFixed(2))
      alert(data.message || 'Withdrawal submitted')
      setAmount('0')
    } catch (err) {
      alert(err.message || 'Withdrawal failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="top-header">
        <div className="left">
          <Link to="/" className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
          <span className="title">Coin withdrawal</span>
        </div>
      </header>

      <main>
        <section className="balance-card">
          <div className="card-title">Available Balance</div>
          <div className="card-amount">₹{inrBalance} <span className="currency">INR</span></div>
        </section>

        <section className="channel-section">
          <div className="channel-label">Cash withdrawal channel</div>
          <div className="channel-btn">Bank Card</div>
        </section>

        <section className="form-group">
          <label>Currency</label>
          <div className="select-wrapper"><div className="select-value">INR</div></div>
        </section>

        <section className="form-group">
          <label>Bank Name</label>
          <div className="input-wrapper"><input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} /></div>
        </section>

        <section className="form-group">
          <label>Account Name</label>
          <div className="input-wrapper"><input type="text" placeholder="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} /></div>
        </section>

        <section className="form-group">
          <label>Account Number</label>
          <div className="input-wrapper"><input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} /></div>
        </section>

        <section className="form-group">
          <label>IFSC</label>
          <div className="input-wrapper"><input type="text" placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} /></div>
        </section>

        <section className="form-group">
          <label>Amount</label>
          <div className="input-wrapper with-button">
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button type="button" className="total-btn" onClick={() => setAmount(inrBalance)}>Total</button>
          </div>
        </section>
      </main>

      <div className="submit-wrapper">
        <button type="button" className="submit-btn" disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Processing...' : 'Confirm coin withdrawal'}
        </button>
      </div>

      <BottomNav />
    </>
  )
}
