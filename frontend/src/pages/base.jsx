import { Link } from 'react-router-dom'

export default function Base({ title, header, children, showNav = true }) {
  return (
    <div className="container">
      <header>
        <h1>{header || title || 'Expense Tracker'}</h1>
      </header>
      <main>{children}</main>
      {showNav && (
        <nav>
          <Link to="/home" title="Home">Home</Link>
          <Link to="/expenses" title="Expenses">Expenses</Link>
          <Link to="/income" title="Income">Income</Link>
          <Link to="/savings" title="Savings">Savings</Link>
          <Link to="/bank" title="Bank">Bank</Link>
          <Link to="/splashpage" title="Logout">Logout</Link>
        </nav>
      )}
    </div>
  )
}
