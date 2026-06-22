import Base from './base'
import SlothMascot from '../components/SlothMascot'

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

/*Function that stores the users name to be printed at home*/
export default function Home() {
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

  return (
    <Base title=" ">
      <h2 className="home-regular">Good {getGreeting()}, <span className="username">{username}</span></h2>
      <p className="home-regular">{weekday} {dayInMonth} {month}</p>
      <div className="home-dashboard-row">
        <div className="mascot-card">
          <SlothMascot size={0.5} />
        </div>
        <div className="dashboard-box">
          <p>You spent $0 this month</p>
          <p>You saved $0 this month</p>
        </div>
      </div>
    </Base>
  )
}

