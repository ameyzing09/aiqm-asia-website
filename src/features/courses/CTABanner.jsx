import { Button } from '../../components/Button'

export function CTABanner() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ready to accelerate your career?
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Join our next batch today and become a certified quality excellence professional!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href="#enroll"
            variant="secondary"
            size="lg"
            className="bg-white hover:bg-gray-100 text-primary-700 border-none shadow-xl"
          >
            Get Started Today
          </Button>
          <Button
            href="#contact"
            size="lg"
            className="bg-accent-600 hover:bg-accent-700 text-white border-2 border-white/30"
          >
            Talk to Our Advisors
          </Button>
        </div>
        <p className="text-primary-100 text-sm mt-6">
          🎓 Next batch starts in 2 weeks • Limited seats available
        </p>
      </div>
    </section>
  )
}
