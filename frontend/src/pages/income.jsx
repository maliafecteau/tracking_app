import { useState } from 'react'
import Base from './base'

const sampleIncomes = [
  { income_id: 1, amount: 2500, date: '2026-06-01' },
  { income_id: 2, amount: 500, date: '2026-05-15' },
]

// income page that posts new income to the api and shows a list
export default function Income() {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [incomes, setIncomes] = useState(sampleIncomes)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  async function handleAddIncome(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const response = await fetch('/api/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ amount, date }),
    })

    const data = await response.json()
    if (response.ok) {
      setIncomes((current) => [
        ...current,
        { income_id: data.id, amount: data.amount, date: data.date },
      ])
      setAmount('')
      setDate('')
      setMessage('Income added successfully.')
      return
    }

    setError(data.error || 'Unable to add income. Please log in first.')
  }

  async function handleDeleteIncome(incomeId) {
    setError('')
    setMessage('')

    const response = await fetch(`/api/income/${incomeId}`, {
      method: 'DELETE',
      headers: {
        ...authHeader,
      },
    })

    if (response.ok) {
      setIncomes((current) => current.filter((income) => income.income_id !== incomeId))
      setMessage('Income deleted successfully.')
      return
    }

    const data = await response.json()
    setError(data.error || 'Unable to delete income. Please log in first.')
  }

  return (
    <Base title="Income" header="Your Income">
      <p>Here you can view, manage, and log your income.</p>
      <section className="income-form">
        <h2>Add New Income</h2>
        <form onSubmit={handleAddIncome}>
          <div>
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
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>
          <button type="submit">Add Income</button>
        </form>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="income-list">
        {incomes.length ? (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.income_id}>
                  <td>${income.amount}</td>
                  <td>{income.date}</td>
                  <td>
                    <a href={`/income/edit/${income.income_id}`}>Edit</a>
                    <button
                      type="button"
                      onClick={() => handleDeleteIncome(income.income_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No income recorded yet.</p>
        )}
      </section>
    </Base>
  )
}
