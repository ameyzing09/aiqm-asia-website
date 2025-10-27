import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CoursesPage } from './pages/CoursesPage'
import { CertificationsPage } from './pages/CertificationsPage'
import { ConsultancyPage } from './pages/ConsultancyPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/certifications" element={<CertificationsPage />} />
      <Route path="/consultancy" element={<ConsultancyPage />} />
    </Routes>
  )
}

export default App
