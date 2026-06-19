import { useState } from 'react'
import Base from './base'
import ExpensesForm from './expenses_form'
import Bill from './bill'
import { apiFetch } from '../utils/api'

const sampleMerged = [
  { type: 'expense', id: 1, description: 'Groceries', amount: 54.75, date: '2026-06-10' },
  { type: 'bill', id: 2, description: 'Electricity', amount: 120.0, date: '2026-06-12' },
]

// expenses page that can delete items through the api
export default function Expenses() {
  const [showExpenseForm, setShowExpenseForm] = useState(true)
  const [showBillForm, setShowBillForm] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleDelete(type, itemId) {
    setError('')
    setMessage('')

    const endpoint = type === 'expense' ? `/api/expenses/${itemId}` : `/api/bills/${itemId}`
    const response = await apiFetch(endpoint, { method: 'DELETE' })
    const data = await response.json()

    if (response.ok) {
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`)
      return
    }

    setError(data.error || 'Unable to delete item. Please log in first.')
  }

  return (
    <Base title="Expenses & Bills" header="Your Expenses & Bills">
      <p>Here you can view, manage, and log your expenses and bills.</p>

      <button id="expense-form-btn" type="button" onClick={() => { setShowExpenseForm(true); setShowBillForm(false); }}>
        Add Expense
      </button>
      <button id="bill-form-btn" type="button" onClick={() => { setShowBillForm(true); setShowExpenseForm(false); }}>
        Add Bill
      </button>

      <div id="add-expense-form" className={showExpenseForm ? undefined : 'hidden'}>
        <ExpensesForm />
      </div>

      <div id="add-bill-form" className={showBillForm ? undefined : 'hidden'}>
        <Bill />
      </div>

      <div className="toggle-buttons">
        <button data-filter="all" className="toggle-btn active" type="button">All</button>
        <button data-filter="expense" className="toggle-btn" type="button">Expenses</button>
        <button data-filter="bill" className="toggle-btn" type="button">Bills</button>
      </div>

      {sampleMerged.length ? (
        <table id="expenses-bills-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleMerged.map((item) => (
              <tr key={item.id} data-type={item.type} className={item.type === 'bill' ? 'bill-row' : undefined}>
                <td>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                <td>{item.description}</td>
                <td>${item.amount}</td>
                <td>{item.date}</td>
                <td>
                  <span>{item.type === 'expense' ? 'Expense' : 'Bill'}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.type, item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses or bills yet. Use a button above to add one.</p>
      )}
      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </Base>
  )
}
