import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { apiGetProfile, apiLogout } from '../utils/api'
import { clearAuthSession } from '../utils/auth'
import '../styles/userinfo.css'

export default function UserInfo() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    apiGetProfile()
      .then((data) => setProfile(data.user))
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch {
      /* ignore */
    }
    clearAuthSession()
    navigate('/login')
  }

  if (!profile) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#fff' }}>Loading...</div>
  }

  return (
    <>
      <main className="page">
        <div className="avatar-wrap">
          <img src="/avatar.svg" alt="Avatar" />
        </div>

        <section className="card stats">
          <div className="stat">
            <div className="circle c-blue">⛁</div>
            <div>
              <strong>₹{parseFloat(profile.inr_balance).toFixed(2)}</strong>
              <div className="meta">My Balance (INR)</div>
            </div>
          </div>
          <div className="stat">
            <div className="circle c-amber">🔒</div>
            <div>
              <strong>{profile.frozen_total?.toFixed?.(4) ?? profile.frozen_total}</strong>
              <div className="meta">Frozen</div>
            </div>
          </div>
          <div className="stat">
            <div className="circle c-green">⇡</div>
            <div>
              <strong>{profile.credit_score}</strong>
              <div className="meta">Credit Score</div>
            </div>
          </div>
          <div className="stat">
            <div className="circle c-green">☆</div>
            <div>
              <strong>{profile.vip_level}</strong>
              <div className="meta">Level</div>
            </div>
          </div>
        </section>

        <p style={{ textAlign: 'center', color: '#8fa3c4', marginBottom: 12 }}>
          {profile.username} · USDT {profile.total_usdt} · ≈${profile.total_fiat}
        </p>

        <h1 className="section-title">Account Settings</h1>

        <section className="card menu">
          <div className="menu-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>
            <div className="menu-left">
              <div className="circle c-red">↪</div>
              <b className="danger">Sign out</b>
            </div>
            <span className="arrow">›</span>
          </div>
        </section>
      </main>

      <BottomNav activePage="/userinfo" />
    </>
  )
}
