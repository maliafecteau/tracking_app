import { useState } from 'react'
import { apiFetch } from '../utils/api'

export default function ExpensesForm({ onSuccess }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const response = await apiFetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description, amount, date }),
    })

    const data = await response.json()
    if (response.ok) {
      setDescription('')
      setAmount('')
      setDate('')
      if (onSuccess) onSuccess()
      return
    }

    setError(data.error || 'Unable to add expense. Please log in first.')
  }

  return (
    <section className="expense-form">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} >
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        <button type="submit">Add Expense</button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </section>
  )
}