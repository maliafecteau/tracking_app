import { useState, React } from 'react'
import Base from './base'
import ExpenseChip from '../components/ExpenseChip/ExpenseChip'
import { apiFetch } from '../utils/api'

const sampleIncomes = [
  { income_id: 1, amount: 2500, date: '2026-06-01' },
  { income_id: 2, amount: 500, date: '2026-05-15' },
]

// income page that posts new income to the api and shows a list
export default function Income() {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [incomes, setIncomes] = useState(sampleIncomes)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  const toggleForm = () => {
    setIsFormVisible((prev) => !prev)
  }

  async function initialLoad() { // loads the incomes from bank using ahaku
    setLoading(true)
    setError('')

    const [incomesRes] = await ([
      apiFetch('/api/income')
    ])

    if (!incomesRes.ok) {
      setError('Unable to load data. Please log in.')
      setLoading(false)
      return
    }

    const incomesRaw = await incomesRes.json()

    const fetchedIncomes = Array.isArray(incomesRaw) ? incomesRaw : (incomesRaw.incomes ?? [])

    setIncomes(fetchedIncomes)
    setLoading(false)
  }

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

  const items = [
    ...incomes.map((i) => ({
      type: 'income',
      id: i.income_id,
      amount: i.amount,
      date: i.date
    }))
  ]

  return (
    <Base title="Income" header="Your Income">
      <p>Here you can view, manage, and log your income.</p>
      <button id="expense-form-btn" type="button" onClick={toggleForm}>
        {isFormVisible ? 'Cancel' : 'Add Income +'}
      </button>
      {isFormVisible && (
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
      )}
      

      <div className="expenses-container">
          {items.map((item) => (
            <ExpenseChip
              key={`${item.type}-${item.id}`}
              itemId={item.id}
              type={item.type}
              date={item.date}
              amount={item.amount}
              onDelete={() => handleDeleteIncome(item.id)}/>
          ))
        }
        </div>
    </Base>
  )
}
