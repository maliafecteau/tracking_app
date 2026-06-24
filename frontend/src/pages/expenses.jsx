import { useState, useEffect, useCallback } from 'react'
import Base from './base'
import ExpensesForm from './expenses_form'
import Bill from './bill'
import { apiFetch } from '../utils/api'
import ExpenseChip from '../components/ExpenseChip/ExpenseChip'
import ToggleBtns from '../components/ToggleBtns/ToggleBtns'

const LIMIT = 20

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [bills, setBills] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
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

  // Initial load — fetches bills once + first page of expenses
  async function initialLoad() {
    setLoading(true)
    setError('')

    const [expensesRes, billsRes] = await Promise.all([
      apiFetch(`/api/expenses?page=1&limit=${LIMIT}`),
      apiFetch('/api/bills'),
    ])

    if (!expensesRes.ok || !billsRes.ok) {
      setError('Unable to load data. Please log in.')
      setLoading(false)
      return
    }

    const expensesRaw = await expensesRes.json()
    const billsRaw = await billsRes.json()

    const fetchedExpenses = Array.isArray(expensesRaw.expenses) ? expensesRaw.expenses : []
    const fetchedBills = Array.isArray(billsRaw) ? billsRaw : (billsRaw.bills ?? [])

    setExpenses(fetchedExpenses)
    setBills(fetchedBills)
    setPage(1)
    setHasMore(expensesRaw.pagination?.has_next ?? false)
    setLoading(false)
  }

  // Load more — appends next page of expenses
  async function loadMore() {
    setLoadingMore(true)
    setError('')

    const nextPage = page + 1
    const res = await apiFetch(`/api/expenses?page=${nextPage}&limit=${LIMIT}`)

    if (!res.ok) {
      setError('Failed to load more expenses.')
      setLoadingMore(false)
      return
    }

    const raw = await res.json()
    const fetched = Array.isArray(raw.expenses) ? raw.expenses : []

    setExpenses((prev) => [...prev, ...fetched])
    setPage(nextPage)
    setHasMore(raw.pagination?.has_next ?? false)
    setLoadingMore(false)
  }

  useEffect(() => {
    initialLoad()
  }, [])

  // Merge + sort whenever expenses or bills change
  const items = [
    ...expenses.map((e) => ({
      type: 'expense',
      id: e.id,
      description: e.description,
      amount: e.amount,
      date: e.date,
      category: e.category,
    })),
    ...bills.map((b) => ({
      type: 'bill',
      id: b.id,
      description: b.title,
      amount: b.amount,
      date: `Due day ${b.day_due}`,
      category: 'Bill',
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1))

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true
    return item.type === filter
  })

  async function handleDelete(type, itemId) {
    setError('')
    setMessage('')

    const endpoint = type === 'expense' ? `/api/expenses/${itemId}` : `/api/bills/${itemId}`
    const response = await apiFetch(endpoint, { method: 'DELETE' })
    const data = response.status !== 204 ? await response.json() : {}

    if (response.ok) {
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`)
      setTimeout(() => setMessage(''), 3000)
      initialLoad()
      return
    }

    setError(data.error || 'Unable to delete item. Please log in first.')
  }

  return (
    <Base title="Expenses & Bills" header="Your Expenses & Bills">
      <p>Here you can view, manage, and log your expenses and bills.</p>

      <div className="add-btns">
        <button id="expense-form-btn" type="button" onClick={() => { setShowExpenseForm(true); setShowBillForm(false) }}>
          Add Expense
        </button>
        <button id="bill-form-btn" type="button" onClick={() => { setShowBillForm(true); setShowExpenseForm(false) }}>
          Add Bill
        </button>
      </div>

      <div id="add-expense-form" className={showExpenseForm ? undefined : 'hidden'}>
        <ExpensesForm onSuccess={() => { setShowExpenseForm(false); initialLoad() }} />
      </div>

      <div id="add-bill-form" className={showBillForm ? undefined : 'hidden'}>
        <Bill onSuccess={() => { setShowBillForm(false); initialLoad() }} />
      </div>

      <ToggleBtns options={filterOptions} value={filter} onChange={setFilter} />

      <div className='expenses-container'>
        {loading && <p>Loading...</p>}
        {!loading && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ExpenseChip
              itemID={item.id}
              type={item.type}
              description={item.description}
              date={item.date}
              amount={item.amount}
              category={item.category}
              onDelete={() => handleDelete(item.type, item.id)}
              key={`${item.type}-${item.id}`}
            />
          ))
        ) : (
          !loading && <p>No expenses or bills yet. Use a button above to add one.</p>
        )}

        {hasMore && !loading && (
          <button type="button" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>

      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}
    </Base>
  )
}