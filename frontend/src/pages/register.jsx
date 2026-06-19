import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Base from './base'

// registration form that posts user info to auth api
export default function Register() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

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
  }

  return (
    <Base title="Register" header="Create an Account">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter a password (min 6 characters)"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="form-error">{error}</p>}
      <p>Already have an account?</p>
      <a href="/login">
        <button type="button">Login here</button>
      </a>
    </Base>
  )
}
