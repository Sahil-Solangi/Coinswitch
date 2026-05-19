const API_BASE = 'http://localhost/coinswitch-react/api'

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export function apiLogin(username, password) {
  return apiFetch('/login.php', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function apiRegister(payload) {
  return apiFetch('/register.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function apiLogout() {
  return apiFetch('/logout.php', { method: 'POST' })
}

export function apiGetSpotBalance() {
  return apiFetch('/get_spot_balance.php')
}

export function apiUpdateFreeze(symbol, action, amount) {
  return apiFetch('/update_freeze.php', {
    method: 'POST',
    body: JSON.stringify({ symbol, action, amount }),
  })
}

export function apiRecharge(amount, paymentMethod = 'Bank Card') {
  return apiFetch('/recharge.php', {
    method: 'POST',
    body: JSON.stringify({ amount, payment_method: paymentMethod }),
  })
}

export function apiGetRecharge() {
  return apiFetch('/recharge.php')
}

export function apiWithdraw(payload) {
  return apiFetch('/withdraw.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function apiGetWithdraw() {
  return apiFetch('/withdraw.php')
}

export function apiGetProfile() {
  return apiFetch('/get_profile.php')
}
