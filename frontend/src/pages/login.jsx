import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Base from './base'

// login form that sends creds to the backend api
export default function Login() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const payload = {
      username: formData.get('username'),
      password: formData.get('password'),
    }

    try {
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
    } catch {
      setError('Unable to connect. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Base title="Login" header="Login" showNav={false}>
      <section className="login-page">
        <h2 className="login-title">Welcome back!</h2>
        <p className="login-copy">Log in to continue tracking your spending, savings and goals.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group login-field">
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>

          {error && <p className="form-error login-error">{error}</p>}
        </form>

        <p className="login-register-copy">Don't have an account?</p>
        <Link to="/register" className="btn login-register-btn">Create account</Link>
      </section>
    </Base>
  )
}
