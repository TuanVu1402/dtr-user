import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import UserHomePage from './pages/UserHomePage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TrainingSessionsProvider } from './context/TrainingSessionsContext'
import { FeedbackProvider } from './context/FeedbackContext'
import { SubmissionsProvider } from './context/SubmissionsContext'
import FloatingActions from './components/FloatingActions'
import type { Role } from './types/dtr'

function AppShell() {
  const { role, login } = useAuth()
  const navigate = useNavigate()

  function handleAuthenticated(nextRole: Role) {
    login(nextRole)
    navigate('/')
  }

  if (!role) {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  return (
    <SubmissionsProvider>
      <TrainingSessionsProvider>
        <FeedbackProvider>
          <Routes>
            <Route path="/" element={<UserHomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FloatingActions />
        </FeedbackProvider>
      </TrainingSessionsProvider>
    </SubmissionsProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
