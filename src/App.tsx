import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { EventsProvider } from './context/EventsContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'
import InvitationDashboard from './components/InvitationDashboard'
import GuestInvitation from './components/GuestInvitation'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'


import PlatformLayout from './components/PlatformLayout'
import AccountSettings from './components/AccountSettings'
import EventDetails from './components/EventDetails'
import ExploreDesigns from './components/ExploreDesigns'
import Messages from './components/Messages'
import Directory from './components/Directory'
import ReceivedEvents from './components/ReceivedEvents'
import GuestsPage from './components/GuestsPage'
import Settings from './components/Settings'
import HelpCenter from './components/HelpCenter'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <EventsProvider>
          <LanguageProvider>
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
                  <Route path="/dashboard/event/:id" element={<EventDetails />} />
                  <Route path="/dashboard/event/edit/:id" element={<InvitationDashboard />} />
                  <Route path="/create" element={<InvitationDashboard />} />
                  <Route path="/explore" element={<ExploreDesigns />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/directory" element={<Directory />} />
                  <Route path="/received" element={<ReceivedEvents />} />
                  <Route path="/guests" element={<GuestsPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<HelpCenter />} />
                </Route>


                <Route path="/invitacion" element={<GuestInvitation />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </EventsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
