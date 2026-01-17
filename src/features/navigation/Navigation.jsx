import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGlobal } from '../../hooks/firebase'
import { useTheme } from '../../hooks/useTheme'
import { Button } from '../../components/Button'
import { ThemeSwitcher } from './ThemeSwitcher'
import { MobileMenu } from './MobileMenu'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()
  const { data: global } = useGlobal()
  const queryClient = useQueryClient()

  // DEV: Press Ctrl+Shift+R to refresh all Firebase data
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        queryClient.invalidateQueries()
        console.log('Cache invalidated - refetching all data...')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [queryClient])

  // Build nav links from Firebase or use defaults
  const navLabels = global?.navigationLabels || {}
  const NAV_LINKS = [
    { name: navLabels.home || 'Home', href: '/' },
    { name: navLabels.courses || 'Courses', href: '/courses' },
    { name: navLabels.certifications || 'Certifications', href: '/certifications' },
    { name: navLabels.consultancy || 'Consultancy', href: '/consultancy' },
    { name: navLabels.about || 'About', href: '/about' },
  ]
  const ctaButtonText = navLabels.ctaButton || 'Enroll Now'
  const companyName = global?.companyInfo?.name || ''
  const companyTagline = global?.companyInfo?.shortTagline || ''

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                {global?.companyInfo?.logo ? (
                  <img
                    src={global.companyInfo.logo}
                    alt={companyName || 'Company Logo'}
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AI</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    {companyName}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{companyTagline}</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map(link => {
                const isRoute = link.href.startsWith('/')
                return isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                )
              })}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Theme Switcher - conditionally rendered based on feature flag */}
              {global?.features?.enableThemeSwitcher && (
                <ThemeSwitcher className="hidden md:flex" />
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Enroll Now Button */}
              <Button
                href={global?.enquiryLink || '#enroll'}
                target={global?.enquiryLink ? '_blank' : undefined}
                rel={global?.enquiryLink ? 'noopener noreferrer' : undefined}
                variant="accent"
                size="md"
                className="hidden md:block"
              >
                {ctaButtonText}
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - rendered outside nav for proper fixed positioning */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
        ctaButtonText={ctaButtonText}
        enquiryLink={global?.enquiryLink}
      />
    </>
  )
}
