import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Base from './base'

// login form that sends creds to the backend api
export default function Login() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const payload = {
      username: formData.get('username'),
      password: formData.get('password'),
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/home')
      return
    }

    setError(data.error || 'Login failed. Please try again.')
  }

  return (
    <Base title="Login" header="Log in">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or Email:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className="form-error">{error}</p>}
      <p>Don't have an account?</p>
      <a href="/register">
        <button type="button">Register here</button>
      </a>
    </Base>
  )
}
