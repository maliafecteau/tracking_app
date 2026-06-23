import { useState, useEffect } from 'react'
import Base from './base'
import SlothMascot from '../components/SlothMascot'
import { apiFetch } from '../utils/api'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 18) return 'Afternoon'
  return 'Evening'
}

function formatOrdinal(day) {
  const suffix = day % 10 === 1 && day !== 11 ? 'st'
    : day % 10 === 2 && day !== 12 ? 'nd'
    : day % 10 === 3 && day !== 13 ? 'rd'
    : 'th'
  return `${day}${suffix}`
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [categoryColors, setCategoryColors] = useState({})
  const [loading, setLoading] = useState(true)

  let username
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      username = user?.username || user?.name || username
    } catch (error) {
      console.warn('Could not parse saved user:', error)
    }
  }

  const now = new Date()
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' })
  const month = now.toLocaleDateString(undefined, { month: 'long' })
  const dayInMonth = formatOrdinal(now.getDate())

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const [summaryRes, categoriesRes] = await Promise.all([
        apiFetch('/api/expenses/summary'),
        apiFetch('/api/categories'),
      ])

      if (summaryRes.ok) {
        const data = await summaryRes.json()
        setCategories(data.summary)
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        const colorMap = {}
        data.forEach(c => { colorMap[c.name] = c.color })
        setCategoryColors(colorMap)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <Base title=" ">
      <h2 className="home-regular">Good {getGreeting()}, <span className="username">{username}</span></h2>
      <p className="home-regular">{weekday} {dayInMonth} {month}</p>

      <div className="home-dashboard-row">
        <div className="mascot-card">
          <SlothMascot size={0.5} />
        </div>

        <div className="dashboard-box">
          {loading ? (
            <p>Loading...</p>
          ) : categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  >
                
                  {categories.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={categoryColors[entry.category] || '#D3D3D3'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => ['$' + value.toFixed(2), 'Spent']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No spending data yet.</p>
          )}
        </div>
      </div>
    </Base>
  )
}