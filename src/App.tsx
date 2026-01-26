import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import InvitationDashboard from './components/InvitationDashboard'
import GuestInvitation from './components/GuestInvitation'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'


import PlatformLayout from './components/PlatformLayout'
import AccountSettings from './components/AccountSettings'
import ExploreDesigns from './components/ExploreDesigns'
import MessagesCenter from './components/MessagesCenter'
import Directory from './components/Directory'
import HelpCenter from './components/HelpCenter'
import ReceivedEvents from './components/ReceivedEvents'
import EventDetails from './components/EventDetails'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Platform Routes with Sidebar */}
            <Route element={
              <ProtectedRoute>
                <PlatformLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/explore" element={<ExploreDesigns />} />
              <Route path="/messages" element={<MessagesCenter />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/received" element={<ReceivedEvents />} />
              <Route path="/dashboard/event/:id" element={<EventDetails />} />
              <Route path="/dashboard/event/edit/:id" element={<InvitationDashboard />} />
            </Route>

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <InvitationDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/invitacion" element={<GuestInvitation />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
