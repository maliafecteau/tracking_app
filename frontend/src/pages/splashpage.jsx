import { Link } from 'react-router-dom'
import Base from './base'
import SlothMascot from '../components/SlothMascot'
import paws from '../assets/icons/paws.svg'

export default function Splashpage() {
  return (
    <Base title="Welcome" header="Welcome to Expense Tracker" showNav={false}>
      <section className="login-page splash-page">
        <img className="splash-paws" src={paws} alt="" aria-hidden="true" />
        <div className="splash-hero">
          <div className="splash-mascot" aria-hidden="true">
            <SlothMascot size={0.33} />
          </div>

          <div className="splash-copy-block">
            <p className="splash-copy-lines">
              Manage Your Budgets
              <br />
              Track Your Expenses
              <br />
              Watch your savings grow
            </p>
          </div>
        </div>

        <Link to="/register" className="login-submit splash-action splash-primary">
          Get Started
        </Link>

        <p className="login-register-copy">Already have an account?</p>
        <Link to="/login" className="btn login-register-btn splash-action">
          Login
        </Link>
      </section>
    </Base>
  )
}
