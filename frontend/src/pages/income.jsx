import { useState, useEffect } from 'react'
import Base from './base'
import ExpenseChip from '../components/ExpenseChip/ExpenseChip'
import { apiFetch } from '../utils/api'

export default function Income() {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadIncomes() {
    setLoading(true)
    setError('')

    const response = await apiFetch('/api/income')

    if (!response.ok) {
      setError('Unable to load income. Please log in.')
      setLoading(false)
      return
    }

    const data = await response.json()
    setIncomes(Array.isArray(data) ? data : (data.incomes ?? []))
    setLoading(false)
  }

  useEffect(() => {
    loadIncomes()
  }, [])

  async function handleAddIncome(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const response = await apiFetch('/api/income', {
      method: 'POST',
      body: JSON.stringify({ amount, date, description }),
    })

    const data = await response.json()
    if (response.ok) {
      setIncomes((current) => [
        ...current,
        { id: data.id, amount: data.amount, date: data.date, description: data.description }
      ])
      setAmount('')
      setDate('')
      setDescription('')
      setIsFormVisible(false)
      setMessage('Income added successfully.')
      return
    }

    setError(data.error || 'Unable to add income. Please log in first.')
  }

  async function handleDeleteIncome(incomeId) {
    setError('')
    setMessage('')

    const response = await apiFetch(`/api/income/${incomeId}`, { method: 'DELETE' })

    if (response.ok) {
      setIncomes((current) => current.filter((i) => i.id !== incomeId))
      setMessage('Income deleted successfully.')
      return
    }

    const data = await response.json()
    setError(data.error || 'Unable to delete income. Please log in first.')
  }

  return (
    <Base title="Income" header="Your Income">
      <p>Here you can view, manage, and log your income.</p>

      <button type="button" onClick={() => setIsFormVisible(prev => !prev)}>
        {isFormVisible ? 'Cancel' : 'Add Income +'}
      </button>

      {isFormVisible && (
        <section className="income-form">
          <h2>Add New Income</h2>
          <form onSubmit={handleAddIncome}>
            <div>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                name="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Salary, Freelance"
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button type="submit">Add Income</button>
          </form>
        </section>
      )}

      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="expenses-container">
        {loading ? (
          <p>Loading...</p>
        ) : incomes.length ? (
          incomes.map((item) => (
            <ExpenseChip
              key={`income-${item.id}`}
              itemId={item.id}
              type="income"
              description={item.description || 'Income'}
              date={item.date}
              amount={item.amount}
              onDelete={() => handleDeleteIncome(item.id)}
            />
          ))
        ) : (
          <p>No income recorded yet.</p>
        )}
      </div>
    </Base>
  )
}