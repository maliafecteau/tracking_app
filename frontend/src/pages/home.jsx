import Base from './base'

export default function Home() {
  const username = 'User'

  return (
    <Base title="Home">
      <h2>Hello, {username}!</h2>
      <p>Welcome to the dashboard!</p>
      <img src="/mascot.png" alt="Mascot image" className="dashboard-image" />
      <div className="dashboard-chips">
        <p>You spent $307 this month</p>
      </div>
      <div className="dashboard-chips">
        <p>You saved $200 this month</p>
      </div>
    </Base>
  )
}
