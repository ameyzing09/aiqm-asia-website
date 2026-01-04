import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export function AboutHero() {
  return (
    <section
      id="about"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="font-medium text-gray-900 dark:text-white">About</li>
          </ol>
        </nav>

        {/* Hero Content - Split Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Est. 1998</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              About
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                AIQM India
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              India&apos;s most trusted partner in quality excellence and operational transformation.
              For over 25 years, we&apos;ve been empowering organizations and professionals with world-class
              Lean Six Sigma methodologies.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">25+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years of Excellence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">95,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Professionals Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">13</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses">
                <Button variant="primary" size="lg">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/consultancy">
                <Button variant="secondary" size="lg">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="flex-1 order-first lg:order-last">
            <div className="relative">
              {/* Main Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 dark:from-primary-900 dark:via-gray-800 dark:to-accent-900 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <svg className="w-24 h-24 mx-auto text-primary-600 dark:text-primary-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Image Placeholder: Leadership Team
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Recommended: Professional team photo or office environment
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-500 rounded-full opacity-10 blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-500 rounded-full opacity-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
