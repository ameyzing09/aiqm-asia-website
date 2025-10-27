import { Navigation } from '../features/navigation/Navigation'
import { Hero } from '../features/hero/Hero'
import { QuickStats } from '../features/stats/QuickStats'
import { FeaturedCourses } from '../features/courses/FeaturedCourses'
import { Testimonials } from '../features/testimonials/Testimonials'
import { Footer } from '../features/footer/Footer'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <QuickStats />
      <FeaturedCourses />
      <Testimonials />
      <Footer />
    </div>
  )
}
