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
import Bills from './pages/bill'
import ProtectedRoute from './components/ProtectedRoute'
import SlothMascot from './components/SlothMascot'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splashpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/splashpage" element={<Splashpage />} />

        <Route path="/home" element={
          <ProtectedRoute><Home /> </ProtectedRoute>
        } />
        <Route path="/bank" element={
          <ProtectedRoute><Bank /></ProtectedRoute>
          } />
        <Route path="/income" element={
          <ProtectedRoute><Income /></ProtectedRoute>
          } />
        <Route path="/savings" element={
          <ProtectedRoute><Savings/></ProtectedRoute>
          } />
        <Route path="/expenses" element={
          <ProtectedRoute><Expenses /></ProtectedRoute>
          } />
        <Route path="/wishlist" element={
          <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
