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

function chooseRotatingAdvice(adviceData) {
  const messages =
    adviceData.messages && adviceData.messages.length > 0
      ? adviceData.messages
      : [{ priority: adviceData.priority, message: adviceData.message }]

  const lastIndex = Number(localStorage.getItem('dougalAdviceIndex') ?? '-1')
  const nextIndex = (lastIndex + 1) % messages.length

  localStorage.setItem('dougalAdviceIndex', String(nextIndex))

  return messages[nextIndex]

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
  let timeoutId

  setAdvice({
    priority: 'info',
    message: "Hi, I'm Dougal the Frugal Sloth. I'm here to keep your saving on track.",
  })

  async function loadData() {
    try {
      const adviceRes = await apiFetch('/api/advice')
      const data = await adviceRes.json()

      console.log('Advice data:', data)

      timeoutId = setTimeout(() => {
        if (adviceRes.ok) {
          setAdvice(chooseRotatingAdvice(data))
        } else {
          setAdvice({
            priority: 'warning',
            message: 'Dougal could not load your advice right now.',
          })
        }
      }, 4000)
    } catch (error) {
      console.warn('Could not load advice:', error)

      timeoutId = setTimeout(() => {
        setAdvice({
          priority: 'warning',
          message: 'Dougal could not load your advice right now.',
        })
      }, 2200)
    }
  }

  loadData()

  return () => {
    clearTimeout(timeoutId)
  }
}, []);
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
            <div
            key={advice.message}
             className={`speech-bubble ${advice.priority} speech-bubble--${advice.priority}`}>
              <p>{advice.message}</p>
            </div>
          )}
        </div>
      </div>
    </Base>
  )}