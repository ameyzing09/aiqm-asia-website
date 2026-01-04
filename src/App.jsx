import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CoursesPage } from './pages/CoursesPage'
import { CertificationsPage } from './pages/CertificationsPage'
import { ConsultancyPage } from './pages/ConsultancyPage'
import { AboutPage } from './pages/AboutPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { AdminPage } from './features/admin/AdminPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/consultancy" element={<ConsultancyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
