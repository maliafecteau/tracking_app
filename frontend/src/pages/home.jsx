import { useState, useEffect } from 'react'
import Base from './base'
import SlothMascot from '../components/SlothMascot'
import { apiFetch } from '../utils/api'

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
  const [advice, setAdvice] = useState(null)

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
      const adviceRes = await apiFetch('/api/advice')
      if (adviceRes.ok) setAdvice(await adviceRes.json())
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
          {advice && (
            <div className={`speech-bubble ${advice.priority}`}>
              <p>{advice.message}</p>
            </div>
          )}
        </div>
      </div>
    </Base>
  )}