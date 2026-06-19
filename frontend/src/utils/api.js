// helper to get the saved jwt token from local storage
export function getToken() {
  return localStorage.getItem('token')
}

// build auth headers if we have a token
export function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// fetch wrapper that always sends json and auth headers
export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers || {}),
  }

  return fetch(path, {
    ...options,
    headers,
  })
}
