import { Button } from '../../components/Button'

export function CertificationsHero() {
  return (
    <section
      id="certifications"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</a>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="font-medium text-gray-900 dark:text-white">Certifications</li>
            </ol>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Internationally Accredited</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Globally Recognized
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              Certifications
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl animate-slide-up">
            Elevate your career with certifications that are recognized and respected worldwide.
            Join thousands of professionals who have transformed their careers with AIQM India.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">40,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Belts Certified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">13</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto sm:justify-center">
            <Button href="#get-certified" variant="primary" size="lg">
              Get Certified Today
            </Button>
            <Button href="/courses" variant="secondary" size="lg">
              View Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
