import { Link } from 'react-router-dom'
import Base from './base'

export default function Splashpage() {
  return (
    <Base title="Welcome" header="Welcome to Expense Tracker" showNav={false}>
      <p>Track your expenses and manage your budget effectively.</p>
      <Link to="/register" className="btn">Get Started</Link>
      <p>Already have an account?</p>
      <Link to="/login" className="btn">Login</Link>
    </Base>
  )
}
