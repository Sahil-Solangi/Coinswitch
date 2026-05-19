import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Exchange from './pages/Exchange'
import Spot from './pages/Spot'
import Recharge from './pages/Recharge'
import Withdraw from './pages/Withdraw'
import Notification from './pages/Notification'
import UserInfo from './pages/UserInfo'
import Language from './pages/Language'
import Support from './pages/Support'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/spot" element={<ProtectedRoute><Spot /></ProtectedRoute>} />
        <Route path="/recharge" element={<ProtectedRoute><Recharge /></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/userinfo" element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
        <Route path="/language" element={<Language />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  )
}

export default App
