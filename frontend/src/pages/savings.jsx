import { useEffect, useState } from 'react'
import Base from './base'
import { apiFetch } from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Savings() {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [fundAmount, setFundAmount] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [goals, setGoals] = useState([])
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false)
  const [isFundFormOpen, setIsFundFormOpen] = useState(false)
  const [activeMenuGoalId, setActiveMenuGoalId] = useState(null)
  const [fadingGoalIds, setFadingGoalIds] = useState([])
  const [activeTab, setActiveTab] = useState('active')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isRemoveFundFormOpen, setIsRemoveFundFormOpen] = useState(false)
  const [removeFundAmount, setRemoveFundAmount] = useState('')
  const [selectedGoalIdForRemoval, setSelectedGoalIdForRemoval] = useState(null)
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [savingsTotal, setSavingsTotal] = useState(0)
  const [dateRangeLabel, setDateRangeLabel] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSpending() {
      const summaryRes = await apiFetch('/api/savings/monthly-summary')

      if (summaryRes.ok) {
        const data = await summaryRes.json()
        if (isMounted) {
          setIncomeTotal(Number(data.income_total || 0))
          setTotalSpent(Number(data.total_spent || 0))
          setSavingsTotal(Number(data.savings_total || 0))
          const fromText = formatDate(data.from)
          const toText = formatDate(data.to)
          setDateRangeLabel(`${fromText} - ${toText}`)
        }
      }
    }

    loadSpending()

    async function loadGoals() {
      try {
        const response = await apiFetch('/api/savings/goals')
        const data = await response.json()

        if (!response.ok) {
          if (response.status !== 401 && isMounted) {
            setError(data.error || 'Unable to load savings goals right now.')
          }
          return
        }

        const fetchedGoals = (data.goals || []).map((goal) => ({
          goal_id: goal.id,
          title: goal.title,
          target_amount: goal.target_amount,
          current_amount: goal.current_amount || 0,
          is_completed: goal.is_completed || false,
          deadline: goal.deadline,
          progress: goal.progress || 0,
        }))

        if (!isMounted) return

        setGoals(fetchedGoals)
        setSelectedGoalId(fetchedGoals[0] ? String(fetchedGoals[0].goal_id) : '')
      } catch {
        if (isMounted) {
          setError('Unable to load savings goals right now.')
        }
      }
    }

    loadGoals()

    return () => {
      isMounted = false
    }
  }, [])

  function formatAmount(amount) {
    return Number(amount || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
  }

  function formatDate(dateValue) {
    if (!dateValue) return 'No deadline'

    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return 'No deadline'

    return parsed.toLocaleDateString('en-GB')
  }

  const monthlyChartData = [
    {
      period: '1 Month',
      incomeTotal: Number(incomeTotal || 0),
      expensesTotal: Number(totalSpent || 0),
    },
  ]

  const chartMax = Math.max(Number(incomeTotal || 0), Number(totalSpent || 0), 1)

  function formatCurrencyTick(value) {
    if (!value) return '$0'
    return `$${Math.round(value)}`
  }

  function SavingsTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="savings-chart-tooltip">
        <p><strong>{dateRangeLabel || 'Last 30 Days'}</strong></p>
        <p>Income: {formatAmount(incomeTotal)}</p>
        <p>Expenses: {formatAmount(totalSpent)}</p>
        <p>Savings: {formatAmount(savingsTotal)}</p>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const response = await apiFetch('/api/savings/goals', {
      method: 'POST',
      body: JSON.stringify({
        title,
        target_amount: targetAmount,
        deadline,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      setGoals((current) => [
        ...current,
        {
          goal_id: data.id,
          title: data.title,
          target_amount: data.target_amount,
          current_amount: data.current_amount || 0,
          is_completed: false,
          deadline,
          progress: 0,
        },
      ])
      setSelectedGoalId((current) => (current || String(data.id)))
      setTitle('')
      setTargetAmount('')
      setDeadline('')
      setIsGoalFormOpen(false)
      setMessage('Savings goal added successfully.')
      return
    }

    setError(data.error || 'Unable to create savings goal. Please log in first.')
  }

  async function handleDelete(goalId) {
    setMessage('')
    setError('')

    const response = await apiFetch(`/api/savings/goals/${goalId}`, {
      method: 'DELETE',
    })
    const data = await response.json()

    if (response.ok) {
      setGoals((current) => {
        const updatedGoals = current.filter((goal) => goal.goal_id !== goalId)
        setSelectedGoalId((selected) => {
          if (selected !== String(goalId)) return selected
          return updatedGoals[0] ? String(updatedGoals[0].goal_id) : ''
        })
        return updatedGoals
      })
      setActiveMenuGoalId(null)
      setMessage('Goal deleted successfully.')
      return
    }

    setError(data.error || 'Unable to delete . Please log in first.')
  }

  async function handleAddFund(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const goalId = Number(selectedGoalId)
    const amountToAdd = Number(fundAmount)

    if (!goalId || !amountToAdd || amountToAdd <= 0) {
      setError('Please select a goal and enter a valid amount.')
      return
    }

    const response = await apiFetch(`/api/savings/goals/${goalId}/fund`, {
      method: 'POST',
      body: JSON.stringify({ amount: amountToAdd }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Unable to add funds right now.')
      return
    }

    setGoals((current) => current.map((goal) => {
      if (goal.goal_id !== goalId) return goal
      return {
        ...goal,
        current_amount: data.current_amount,
        progress: data.progress,
      }
    }))

    setFundAmount('')
    setIsFundFormOpen(false)
    setMessage('Funds added to your selected goal.')
  }

  async function handleRemoveFund(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const goalId = Number(selectedGoalIdForRemoval)
    const amountToRemove = Number(removeFundAmount)

    if (!goalId || !amountToRemove || amountToRemove <= 0) {
      setError('Please select a goal and enter a valid amount.')
      return
    }

    const response = await apiFetch(`/api/savings/goals/${goalId}/remove-fund`, {
      method: 'POST',
      body: JSON.stringify({ amount: amountToRemove }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Unable to remove funds right now.')
      return
    }

    setGoals((current) => current.map((goal) => {
      if (goal.goal_id !== goalId) return goal
      return {
        ...goal,
        current_amount: data.current_amount,
        progress: data.progress,
      }
    }))

    setRemoveFundAmount('')
    setIsRemoveFundFormOpen(false)
    setSelectedGoalIdForRemoval(null)
    setActiveMenuGoalId(null)
    setMessage('Funds removed from your goal.')
  }

  function handleComplete(goalId) {
    setFadingGoalIds((current) => {
      if (current.includes(goalId)) return current
      return [...current, goalId]
    })

    window.setTimeout(async () => {
      const response = await apiFetch(`/api/savings/goals/${goalId}/complete`, { method: 'POST' })
      if (response.ok) {
        setGoals((current) => current.map((goal) =>
          goal.goal_id === goalId ? { ...goal, is_completed: true } : goal
        ))
        setActiveTab('completed')
        setMessage('Goal completed!')
      } else {
        setError('Unable to mark goal as completed.')
      }
      setFadingGoalIds((current) => current.filter((id) => id !== goalId))
    }, 420)
  }

  const sortedGoals = [...goals].sort((a, b) => a.goal_id - b.goal_id)
  const activeGoals = sortedGoals.filter((g) => !g.is_completed)
  const completedGoals = sortedGoals.filter((g) => g.is_completed)
  const visibleGoals = activeTab === 'active' ? activeGoals : completedGoals

  return (
    <Base title="Savings" header="Savings">
      <section className="savings-page">
        <p className="savings-subtitle">Set your goals!</p>

        <div className="savings-tab-toggle" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`savings-tab-btn ${activeTab === 'active' ? 'savings-tab-btn--active' : ''}`}
            onClick={() => {
              setActiveTab('active')
              setIsGoalFormOpen(false)
              setIsFundFormOpen(false)
            }}
          >
            Saved Goals
          </button>
          <button
            type="button"
            className={`savings-tab-btn ${activeTab === 'completed' ? 'savings-tab-btn--active' : ''}`}
            onClick={() => {
              setActiveTab('completed')
              setIsGoalFormOpen(false)
              setIsFundFormOpen(false)
            }}
          >
            Completed
          </button>
        </div>

        {activeTab === 'active' && (
          <div className="savings-actions" role="group" aria-label="Savings actions">
            <button
              type="button"
              className="savings-action-btn savings-action-btn--primary"
              onClick={() => {
                setIsGoalFormOpen((current) => !current)
                setIsFundFormOpen(false)
                setActiveMenuGoalId(null)
              }}
            >
              Add Goal +
            </button>
            <button
              type="button"
              className="savings-action-btn savings-action-btn--secondary"
              onClick={() => {
                setIsFundFormOpen((current) => !current)
                setIsGoalFormOpen(false)
                setActiveMenuGoalId(null)
                setSelectedGoalId((current) => {
                  const firstActive = activeGoals[0]
                  if (!firstActive) return current
                  const currentIsActive = activeGoals.some((g) => String(g.goal_id) === current)
                  return currentIsActive ? current : String(firstActive.goal_id)
                })
              }}
            >
              Add Fund +
            </button>
          </div>
        )}

        {activeTab === 'active' && isGoalFormOpen && (
          <form className="savings-inline-form" onSubmit={handleSubmit}>
            <div className="form-group login-field">
              <label htmlFor="title">Goal Name</label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. New Car"
                required
              />
            </div>

            <div className="form-group login-field">
              <label htmlFor="target_amount">Target Amount</label>
              <input
                id="target_amount"
                name="target_amount"
                type="number"
                step="0.01"
                min="1"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                placeholder="2500"
                required
              />
            </div>

            <div className="form-group login-field">
              <label htmlFor="deadline">Deadline (optional)</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>

            <button type="submit" className="login-submit">Save Goal</button>
          </form>
        )}

        {activeTab === 'active' && isFundFormOpen && (
          <form className="savings-inline-form" onSubmit={handleAddFund}>
            <div className="form-group login-field">
              <label htmlFor="goal_select">Select Goal</label>
              <select
                id="goal_select"
                name="goal_select"
                value={selectedGoalId}
                onChange={(event) => setSelectedGoalId(event.target.value)}
                required
              >
                {activeGoals.map((goal) => (
                  <option key={goal.goal_id} value={goal.goal_id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group login-field">
              <label htmlFor="fund_amount">Fund Amount</label>
              <input
                id="fund_amount"
                name="fund_amount"
                type="number"
                step="0.01"
                min="1"
                value={fundAmount}
                onChange={(event) => setFundAmount(event.target.value)}
                placeholder="150"
                required
              />
            </div>

            <button type="submit" className="login-submit">Add Funds</button>
          </form>
        )}

        {isRemoveFundFormOpen && (
          <form className="savings-inline-form" onSubmit={handleRemoveFund}>
            <div className="form-group login-field">
              <label htmlFor="remove_fund_amount">Remove Amount</label>
              <input
                id="remove_fund_amount"
                name="remove_fund_amount"
                type="number"
                step="0.01"
                min="0"
                value={removeFundAmount}
                onChange={(event) => setRemoveFundAmount(event.target.value)}
                placeholder="50"
                required
              />
            </div>

            <div className="savings-form-actions">
              <button type="submit" className="login-submit">Remove Funds</button>
              <button 
                type="button" 
                className="savings-form-cancel-btn"
                onClick={() => {
                  setIsRemoveFundFormOpen(false)
                  setRemoveFundAmount('')
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {message && <p className="savings-feedback savings-feedback--success">{message}</p>}
        {error && <p className="savings-feedback savings-feedback--error">{error}</p>}



        <div className="savings-goal-list">
          {visibleGoals.length ? (
            visibleGoals.map((goal, index) => {
              const isComplete = Number(goal.current_amount || 0) >= Number(goal.target_amount || 0)
              const isFading = fadingGoalIds.includes(goal.goal_id)

              return (
              <article
                key={goal.goal_id}
                className={`savings-goal-card ${index % 2 === 0 ? 'savings-goal-card--green' : 'savings-goal-card--blue'} ${isComplete ? 'savings-goal-card--complete' : ''} ${isFading ? 'savings-goal-card--fading' : ''}`}
              >
                <div className="savings-goal-copy">
                  <h3>{goal.title}</h3>
                  <p>{formatDate(goal.deadline)}</p>
                </div>

                <div className="savings-goal-meter">
                  <strong className="savings-goal-amount">
                    {formatAmount(goal.current_amount)} / {formatAmount(goal.target_amount)}
                  </strong>
                  {isComplete && activeTab === 'active' && (
                    <button
                      type="button"
                      className="savings-complete-btn"
                      onClick={() => handleComplete(goal.goal_id)}
                      disabled={isFading}
                    >
                      Complete
                    </button>
                  )}
                </div>

                <div className="savings-goal-actions">
                  <button
                    type="button"
                    className="savings-goal-menu-btn"
                    aria-label={`Goal actions for ${goal.title}`}
                    onClick={() => {
                      setActiveMenuGoalId((current) => (current === goal.goal_id ? null : goal.goal_id))
                      if (activeMenuGoalId === goal.goal_id) {
                        setIsRemoveFundFormOpen(false)
                      }
                    }}
                  >
                    ...
                  </button>

                  {activeMenuGoalId === goal.goal_id && (
                    <div className="savings-goal-menu">
                      <button
                        type="button"
                        className="savings-menu-option"
                        onClick={() => {
                          setSelectedGoalIdForRemoval(goal.goal_id)
                          setIsRemoveFundFormOpen(true)
                          setActiveMenuGoalId(null)
                        }}
                      >
                        Remove Funds
                      </button>
                      <button
                        type="button"
                        className="savings-delete-btn"
                        onClick={() => handleDelete(goal.goal_id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
              )
            })
          ) : (
            <p className="savings-empty">
              {activeTab === 'active' ? 'No savings goals yet. Start by adding one.' : 'No completed goals yet.'}
            </p>
          )}
        </div>
        {(incomeTotal > 0 || totalSpent > 0) && (
            <div className="savings-chart">
              <h3>Monthly Financial Summary</h3>
              <p className="savings-chart-caption">
                {dateRangeLabel || 'Last 30 Days'}
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  barGap={-56}
                  barCategoryGap="48%"
                >
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, Math.ceil(chartMax * 1.1)]} tickFormatter={formatCurrencyTick} />
                  <Tooltip content={<SavingsTooltip />} wrapperStyle={{ pointerEvents: 'none' }} />
                  <Legend />
                  <Bar
                    dataKey="incomeTotal"
                    fill="#49854c"
                    stroke="#468029"
                    name="Income"
                    barSize={56}
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="expensesTotal"
                    fill="#d47260"
                    stroke="#b56d56"
                    name="Expenses"
                    barSize={56}
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
      </section>
    </Base>
  )
}
