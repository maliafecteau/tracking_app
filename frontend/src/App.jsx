import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Splashpage from './pages/splashpage'
import Bank from './pages/bank'
import Income from './pages/income'
import Savings from './pages/savings'
import Expenses from './pages/expenses'
import Wishlist from './pages/wishlist'
import SlothMascot from './components/SlothMascot'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <SlothMascot size={1} />
      </div>
      <Routes>
        <Route path="/" element={<Splashpage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/splashpage" element={<Splashpage />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/income" element={<Income />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
