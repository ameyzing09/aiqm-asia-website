import { Navigation } from '../features/navigation/Navigation'
import { Footer } from '../features/footer/Footer'
import { AboutHero } from '../features/about/AboutHero'
import { StorySection } from '../features/about/StorySection'
import { GlobalPresence } from '../features/about/GlobalPresence'
import { Leadership } from '../features/about/Leadership'
import { MissionVision } from '../features/about/MissionVision'

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AboutHero />
      <StorySection />
      <GlobalPresence />
      <Leadership />
      <MissionVision />
      <Footer />
    </div>
  )
}
