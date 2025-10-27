import { Button } from '../../components/Button'

export function Hero() {
  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            India's Leading Institute for
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              Lean Six Sigma & Quality Excellence
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl animate-slide-up">
            95,000+ professionals trained | 40,000+ belts certified | 13 countries served
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto sm:justify-center">
            <Button href="#courses" variant="primary" size="lg">
              Explore Courses
            </Button>
            <Button href="#certifications" variant="secondary" size="lg">
              Get Certified
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
