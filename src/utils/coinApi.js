export const COIN_API_URL = 'https://api.livecoinwatch.com/coins/list'
export const COIN_API_KEY = '3c2c8d38-0771-4eb8-8a85-1b46e5fdcc29'

/** @returns {Promise<Record<string, { png32?: string, png64?: string, color?: string, name?: string }>>} */
export async function fetchCoinLogoMap(limit = 50) {
  const response = await fetch(COIN_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': COIN_API_KEY },
    body: JSON.stringify({
      currency: 'USD',
      sort: 'rank',
      order: 'ascending',
      offset: 0,
      limit,
      meta: true,
    }),
  })
  const data = await response.json()
  if (!Array.isArray(data)) return {}
  return Object.fromEntries(
    data.map((c) => [
      c.code,
      { png32: c.png32, png64: c.png64, color: c.color, name: c.name },
    ])
  )
}

export async function fetchCoinList(limit = 15) {
  const response = await fetch(COIN_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': COIN_API_KEY },
    body: JSON.stringify({
      currency: 'USD',
      sort: 'rank',
      order: 'ascending',
      offset: 0,
      limit,
      meta: true,
    }),
  })
  const data = await response.json()
  if (!Array.isArray(data)) return []
  return data.map((c) => ({ ...c, realRate: c.rate, currentRate: c.rate }))
}
