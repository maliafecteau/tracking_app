import { Link, useNavigate } from 'react-router-dom'


export default function Base({ title, header, children, showNav = true }) {
  const navigate = useNavigate()

  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }
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
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}
    </div>
  )
}
