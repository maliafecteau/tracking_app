import { useState } from 'react'
import { apiFetch } from '../utils/api'

// bill form that creates a new bill via the api
export default function Bill() {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dayDue, setDayDue] = useState('1')
  const [isRecurring, setIsRecurring] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const response = await apiFetch('/api/bills', {
      method: 'POST',
      body: JSON.stringify({
        title,
        amount,
        day_due: dayDue,
        is_recurring: isRecurring,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      setMessage('Bill created successfully.')
      setTitle('')
      setAmount('')
      setDayDue('1')
      setIsRecurring(false)
      return
    }

    setError(data.error || 'Unable to create bill. Please log in first.')
  }

  return (
    <section className="bill-form">
      <h2>Add New Bill</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bill-title">Title</label>
          <input
            id="bill-title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="bill-amount">Amount</label>
          <input
            id="bill-amount"
            name="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="day-due">Day Due</label>
          <input
            id="day-due"
            name="day_due"
            type="number"
            min="1"
            max="31"
            value={dayDue}
            onChange={(event) => setDayDue(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="is-recurring">
            <input
              id="is-recurring"
              name="is_recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(event) => setIsRecurring(event.target.checked)}
            />
            Is Recurring?
          </label>
        </div>
        <button type="submit">Add Bill</button>
      </form>
      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </section>
  )
}
