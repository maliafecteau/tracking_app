import Base from './base'
import SlothMascot from '../components/SlothMascot'

export default function Home() {
  const username = 'User'

  return (
    <Base title=" ">
      <h2 className="home-regular">Hello, {username}!</h2>
      <p className="home-regular">Welcome to the dashboard!</p>
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

