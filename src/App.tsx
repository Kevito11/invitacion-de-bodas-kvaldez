import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import InvitationBuilder from './components/InvitationBuilder'
import GuestInvitation from './components/GuestInvitation'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <InvitationBuilder />
              </ProtectedRoute>
            }
          />
          <Route path="/invitacion" element={<GuestInvitation />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
