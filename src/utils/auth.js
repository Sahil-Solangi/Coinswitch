const AUTH_KEY = 'coinswitch-auth'

export function isLoggedIn() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return Boolean(data?.username && data?.userId)
  } catch {
    return false
  }
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuthSession(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    userId: user.id,
    username: String(user.username).trim(),
    loggedInAt: Date.now(),
  }))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY)
}
