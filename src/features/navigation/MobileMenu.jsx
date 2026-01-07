import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export function MobileMenu({ isOpen, onClose, navLinks = [], ctaButtonText = 'Enroll Now', enquiryLink = '' }) {
  if (!isOpen) return null

  return (
    <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
      {navLinks.map((link) => {
        const isRoute = link.href.startsWith('/')
        return isRoute ? (
          <Link
            key={link.name}
            to={link.href}
            onClick={onClose}
            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            {link.name}
          </Link>
        ) : (
          <a
            key={link.name}
            href={link.href}
            onClick={onClose}
            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            {link.name}
          </a>
        )
      })}
      <Button
        href={enquiryLink || '#enroll'}
        target={enquiryLink ? '_blank' : undefined}
        rel={enquiryLink ? 'noopener noreferrer' : undefined}
        variant="accent"
        size="md"
        onClick={onClose}
        className="w-full mt-4"
      >
        {ctaButtonText}
      </Button>
    </div>
  )
}
