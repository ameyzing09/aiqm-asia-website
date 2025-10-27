import { Navigation } from '../features/navigation/Navigation'
import { Footer } from '../features/footer/Footer'
import { CertificationsHero } from '../features/certifications/CertificationsHero'
import { AccreditationLogos } from '../features/certifications/AccreditationLogos'
import { BenefitsSection } from '../features/certifications/BenefitsSection'
import { FeatureBlocks } from '../features/certifications/FeatureBlocks'
import { CertificationCTA } from '../features/certifications/CertificationCTA'

export function CertificationsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <CertificationsHero />
      <AccreditationLogos />
      <BenefitsSection />
      <FeatureBlocks />
      <CertificationCTA />
      <Footer />
    </div>
  )
}
