import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Base from './base'

// registration form that posts user info to auth api
export default function Register() {
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
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    try {
      const response = await fetch('/api/auth/register', {
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

      setError(data.error || 'Registration failed. Please try again.')
    } catch {
      setError('Unable to connect. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Base title="Register" header="Create Your Account" showNav={false}>
      <section className="login-page">

        <h2 className="login-title">Welcome!</h2>
        <p className="login-copy">Set up your profile and start tracking your money goals.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group login-field">
            <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
          </div>

          <div className="form-group login-field">
            <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          </div>

          <div className="form-group login-field">
            <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter a password (min 6 characters)"
            autoComplete="new-password"
            minLength={6}
            required
          />
          </div>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          {error && <p className="form-error login-error">{error}</p>}
        </form>

        <p className="login-register-copy">Already have an account?</p>
        <Link to="/login" className="btn login-register-btn">Sign in</Link>
      </section>
    </Base>
  )
}
