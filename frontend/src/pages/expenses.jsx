import { useState } from 'react'
import Base from './base'
import ExpensesForm from './expenses_form'
import Bill from './bill'
import { apiFetch } from '../utils/api'
import ExpenseChip from '../components/ExpenseChip/ExpenseChip'
import ToggleBtns from '../components/ToggleBtns/ToggleBtns'

const sampleMerged = [
  { type: 'expense', id: 1, description: 'Groceries', amount: 54.75, date: '2026-06-10' },
  { type: 'bill', id: 2, description: 'Electricity', amount: 120.0, date: '2026-06-12' },
]

// expenses page that can delete items through the api
export default function Expenses() {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showBillForm, setShowBillForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Expenses', value: 'expense' },
    { label: 'Bills', value: 'bill' },
  ]

  const filteredItems = sampleMerged.filter((item) => {
    if (filter === 'all') return true
    return item.type === filter
  })

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

      <ToggleBtns options={filterOptions} value={filter} onChange={setFilter} />

      <div className='expenses-container'>
        {filteredItems.length ? (
          filteredItems.map((item) => (
              <ExpenseChip 
                itemID={item.id}
                type={item.type}
                description={item.description}
                date={item.date}
                amount={item.amount}
                key={`${item.type}-${item.id}`}/>
          ))
        ) : (
          <p>No expenses or bills yet. Use a button above to add one.</p>
        )}
      </div>
      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </Base>
  )
}
