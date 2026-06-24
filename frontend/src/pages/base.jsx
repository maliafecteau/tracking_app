import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import ScrollTopBtn from '../components/ScrollTop/ScrollTopBtn'

export default function Base({ title, header, children, showNav = true }) {
  const navigate = useNavigate()

  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }
  return (
    <div className="container">
      <header id="header">
        <h1>{header || title || 'Expense Tracker'}</h1>
      </header>
      <main>{children}</main>
      {showNav && (
        <Navbar/>
      )}
      <ScrollTopBtn/>
      <footer><div className="placeholder"/></footer>
    </div>
  )
}
