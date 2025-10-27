import { Navigation } from '../features/navigation/Navigation'
import { Footer } from '../features/footer/Footer'
import { ConsultancyHero } from '../features/consultancy/ConsultancyHero'
import { ServicesGrid } from '../features/consultancy/ServicesGrid'
import { CaseStudies } from '../features/consultancy/CaseStudies'
import { IndustriesServed } from '../features/consultancy/IndustriesServed'
import { ConsultancyCTA } from '../features/consultancy/ConsultancyCTA'

export function ConsultancyPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <ConsultancyHero />
      <ServicesGrid />
      <CaseStudies />
      <IndustriesServed />
      <ConsultancyCTA />
      <Footer />
    </div>
  )
}
