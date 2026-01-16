import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CoursesPage } from './pages/CoursesPage'
import { CertificationsPage } from './pages/CertificationsPage'
import { ConsultancyPage } from './pages/ConsultancyPage'
import { AboutPage } from './pages/AboutPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { CMSLayout } from './features/admin/cms/CMSLayout'
import { CMSDashboard } from './features/admin/cms/CMSDashboard'
import { HeroEditor } from './features/admin/cms/editors/HeroEditor'
import { StatsEditor } from './features/admin/cms/editors/StatsEditor'
import { CoursesEditor } from './features/admin/cms/editors/CoursesEditor'
import { TestimonialsEditor } from './features/admin/cms/editors/TestimonialsEditor'
import { AboutEditor } from './features/admin/cms/editors/AboutEditor'
import { LeadershipEditor } from './features/admin/cms/editors/LeadershipEditor'
import { ConsultancyEditor } from './features/admin/cms/editors/ConsultancyEditor'
import { GlobalEditor } from './features/admin/cms/editors/GlobalEditor'
import { CTABannersEditor } from './features/admin/cms/editors/CTABannersEditor'
import { TeamManagementEditor } from './features/admin/cms/editors/TeamManagementEditor'

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
              <CMSLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CMSDashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="stats" element={<StatsEditor />} />
          <Route path="courses" element={<CoursesEditor />} />
          <Route path="testimonials" element={<TestimonialsEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="leadership" element={<LeadershipEditor />} />
          <Route path="consultancy" element={<ConsultancyEditor />} />
          <Route path="cta-banners" element={<CTABannersEditor />} />
          <Route path="global" element={<GlobalEditor />} />
          <Route path="team" element={<TeamManagementEditor />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
