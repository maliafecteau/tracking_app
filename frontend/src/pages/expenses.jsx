import { useState, useEffect } from 'react'
import Base from './base'
import ExpensesForm from './expenses_form'
import Bill from './bill'
import { apiFetch } from '../utils/api'
import ExpenseChip from '../components/ExpenseChip/ExpenseChip'
import ToggleBtns from '../components/ToggleBtns/ToggleBtns'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  const [spendingCategories, setSpendingCategories] = useState([])
  const [categoryColors, setCategoryColors] = useState({})

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Expenses', value: 'expense' },
    { label: 'Bills', value: 'bill' },
  ]

  async function loadSpending() {
    try {
      const [summaryRes, categoriesRes] = await Promise.all([
        apiFetch('/api/expenses/summary'),
        apiFetch('/api/categories'),
      ])

      if (summaryRes.ok) {
        const data = await summaryRes.json()
        setSpendingCategories(data.summary || [])
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        const colorMap = {}

        data.forEach((category) => {
          colorMap[category.name] = category.color
        })

        setCategoryColors(colorMap)
      }
    } catch {
      console.error('Unable to load spending chart data.')
    }
  }

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
    loadSpending()
  }, [])

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

      if (type === 'expense') {
        loadSpending()
      }

      return
    }

    setError(data.error || 'Unable to delete item. Please log in first.')
  }

  return (
    <Base title="Expenses & Bills" header="Your Expenses & Bills">
      {spendingCategories.length > 0 && (
        <div className="savings-chart">
          <h3>Spending by Category</h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={spendingCategories}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {spendingCategories.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={categoryColors[entry.category] || '#D3D3D3'}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <p>Here you can view, manage, and log your expenses and bills.</p>

      <div className="add-btns">
        <button
          id="expense-form-btn"
          type="button"
          onClick={() => {
            setShowExpenseForm(true)
            setShowBillForm(false)
          }}
        >
          Add Expense
        </button>

        <button
          id="bill-form-btn"
          type="button"
          onClick={() => {
            setShowBillForm(true)
            setShowExpenseForm(false)
          }}
        >
          Add Bill
        </button>
      </div>

      <div id="add-expense-form" className={showExpenseForm ? undefined : 'hidden'}>
        <ExpensesForm
          onSuccess={() => {
            setShowExpenseForm(false)
            initialLoad()
            loadSpending()
          }}
        />
      </div>

      <div id="add-bill-form" className={showBillForm ? undefined : 'hidden'}>
        <Bill
          onSuccess={() => {
            setShowBillForm(false)
            initialLoad()
          }}
        />
      </div>

      <ToggleBtns options={filterOptions} value={filter} onChange={setFilter} />

      
      <div className="expenses-container">
        {loading && <p>Loading...</p>}

        {!loading && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ExpenseChip
<<<<<<< Updated upstream
              itemID={item.id}
=======
              key={`${item.type}-${item.id}`}
              itemId={item.id}
>>>>>>> Stashed changes
              type={item.type}
              description={item.description}
              date={item.date}
              amount={item.amount}
              category={item.category}
              onDelete={() => handleDelete(item.type, item.id)}
<<<<<<< Updated upstream
              key={`${item.type}-${item.id}`}
=======
              onCategoryChange={(newCategory) => {
                if (item.type === 'expense') {
                  setExpenses((prev) =>
                    prev.map((expense) =>
                      (expense.id ?? expense.ex_id) === item.id
                        ? { ...expense, category: newCategory }
                        : expense
                    )
                  )

                  loadSpending()
                }
              }}
>>>>>>> Stashed changes
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