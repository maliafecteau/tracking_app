import { useState } from 'react'
import Base from './base'
import { apiFetch } from '../utils/api'

const sampleGoals = [
  { goal_id: 1, title: 'Vacation', target_amount: 1500, deadline: '2026-12-31', progress: 42 },
  { goal_id: 2, title: 'Emergency Fund', target_amount: 5000, deadline: null, progress: 18 },
]

export default function Savings() {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [goals, setGoals] = useState(sampleGoals)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
        { goal_id: data.id, title: data.title, target_amount: data.target_amount, deadline: deadline || 'No deadline', progress: 0 },
      ])
      setTitle('')
      setTargetAmount('')
      setDeadline('')
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
      setGoals((current) => current.filter((goal) => goal.goal_id !== goalId))
      setMessage('Goal deleted successfully.')
      return
    }

    setError(data.error || 'Unable to delete . Please log in first.')
  }

  return (
    <Base title="Savings" header="Your Savings">
      <section className="savings-summary">
        <h2>Summary</h2>
        <table>
          <tbody>
            <tr>
              <td>Total Income</td>
              <td>$4,200</td>
            </tr>
            <tr>
              <td>Total Expenses</td>
              <td>$1,500</td>
            </tr>
            <tr>
              <td>Total Bills</td>
              <td>$650</td>
            </tr>
            <tr>
              <td>Total Outgoings</td>
              <td>$2,150</td>
            </tr>
            <tr>
              <td><strong>Net Savings</strong></td>
              <td><strong>$2,050</strong></td>
            </tr>
            <tr>
              <td>Savings Rate</td>
              <td>48.8%</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="savings-goals">
        <h2>Savings Goals</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Goal Name</label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="target_amount">Target Amount</label>
            <input
              id="target_amount"
              name="target_amount"
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(event) => setTargetAmount(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="deadline">Deadline (optional)</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
          </div>
          <button type="submit">Add Goal</button>
        </form>

        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        {goals.length ? (
          <table>
            <thead>
              <tr>
                <th>Goal</th>
                <th>Target</th>
                <th>Deadline</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.goal_id}>
                  <td>{goal.title}</td>
                  <td>${goal.target_amount}</td>
                  <td>{goal.deadline || 'No deadline'}</td>
                  <td>
                    {goal.progress}%
                    <progress value={goal.progress} max="100" />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleDelete(goal.goal_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No savings goals set yet.</p>
        )}
      </section>
    </Base>
  )
}
