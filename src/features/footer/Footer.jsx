import { SOCIAL_LINKS, FOOTER_LINKS, CONTACT_INFO, ACCREDITATIONS } from '../../constants/navigation'

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between gap-12">
          {/* Company Info */}
          <div className="flex flex-col w-full lg:w-auto">
            <h3 className="text-2xl font-bold mb-4">AIQM India</h3>
            <p className="text-gray-400 mb-4 max-w-xs">
              Leading provider of Lean Six Sigma and Quality Excellence training across India and beyond.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white mb-2 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <p className="text-gray-400 mb-2">📧 {CONTACT_INFO.email}</p>
            <p className="text-gray-400 mb-2">📞 {CONTACT_INFO.phone}</p>
            <p className="text-gray-400 mb-2">📍 {CONTACT_INFO.address}</p>
          </div>

          {/* Accreditations */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg mb-4">Accreditations</h4>
            <div className="flex flex-wrap gap-3">
              {ACCREDITATIONS.map((accreditation) => (
                <div key={accreditation} className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                  {accreditation}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AIQM India. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
