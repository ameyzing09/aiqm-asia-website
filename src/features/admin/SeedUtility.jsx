import { useState } from 'react'
import { ref, set } from 'firebase/database'
import { db } from '../../services/firebase'

const siteContentData = {
  global: {
    companyInfo: {
      name: 'AIQM India',
      tagline: "India's Leading Institute for Lean Six Sigma & Quality Excellence",
      shortTagline: 'Quality Excellence',
      description:
        'Leading provider of Lean Six Sigma and Quality Excellence training across India and beyond.',
      establishedYear: 1998,
      copyrightYear: 2025,
    },
    contact: {
      email: 'info@aiqmindia.com',
      phone: '+91 (800) 123-4567',
      address: 'Mumbai, Maharashtra, India',
    },
    navigationLabels: {
      home: 'Home',
      courses: 'Courses',
      certifications: 'Certifications',
      consultancy: 'Consultancy',
      about: 'About',
      contact: 'Contact',
      ctaButton: 'Enroll Now',
    },
    socialLinks: {
      facebook: { name: 'Facebook', url: 'https://facebook.com/aiqmindia' },
      twitter: { name: 'Twitter', url: 'https://twitter.com/aiqmindia' },
      linkedin: { name: 'LinkedIn', url: 'https://linkedin.com/company/aiqmindia' },
    },
    accreditations: {
      iso9001: 'ISO 9001',
      iassc: 'IASSC',
      asq: 'ASQ',
      cssc: 'CSSC',
    },
    enquiryLink: 'https://forms.gle/sesk7HG3vheSZYQt5',
    features: {
      enableThemeSwitcher: false,
    },
  },

  stats: {
    professionals: { label: 'Professionals Trained', value: 95000, suffix: '+', order: 1 },
    belts: { label: 'Belts Certified', value: 40000, suffix: '+', order: 2 },
    projects: { label: 'Projects Delivered', value: 15000, suffix: '+', order: 3 },
    countries: { label: 'Countries Served', value: 13, suffix: '', order: 4 },
  },

  heroes: {
    home: {
      headline: "India's Leading Institute for",
      highlightText: 'Lean Six Sigma & Quality Excellence',
      subheadline: '95,000+ professionals trained | 40,000+ belts certified | 13 countries served',
      primaryCtaText: 'Explore Courses',
      secondaryCtaText: 'Get Certified',
    },
    about: {
      title: 'About AIQM India',
      description: "India's most trusted partner in quality excellence",
      establishedBadge: 'Est. 1998',
      heroImage: '',
    },
    certifications: {
      title: 'Globally Recognized Certifications',
      badge: 'Internationally Accredited',
    },
    consultancy: {
      title: 'Driving Business Excellence Through Consultancy',
      heroImage: '',
    },
  },

  courses: {
    'yellow-belt': {
      title: 'Lean Six Sigma Yellow Belt',
      level: 'Entry Level',
      duration: '2 Weeks',
      mode: { online: true, onsite: true, hybrid: false },
      accreditation: { cssc: true, iaf: false },
      idealFor: 'Team members, Entry-level professionals, Process participants',
      outcome: 'CSSC Certified Yellow Belt - Foundation in process improvement and quality tools',
      certification: 'Lean Six Sigma Yellow Belt Certification by CSSC',
      description:
        'Perfect introduction to Lean Six Sigma methodologies. Learn fundamental problem-solving tools and support improvement projects.',
      priceDisplay: '₹15,000',
      priceValue: 15000,
      currency: 'INR',
      order: 1,
      featured: true,
      active: true,
    },
    'green-belt': {
      title: 'Lean Six Sigma Green Belt',
      level: 'Intermediate',
      duration: '4 Weeks',
      mode: { online: true, onsite: true, hybrid: true },
      accreditation: { cssc: true, iaf: true },
      idealFor: 'Project leaders, Quality analysts, Process improvement professionals',
      outcome: 'CSSC & IAF Certified Green Belt - Lead small to medium improvement projects',
      certification: 'Dual Certification: CSSC Green Belt + IAF Accredited Certificate',
      description:
        'Master the fundamentals of process improvement and lead small to medium-scale projects with confidence.',
      priceDisplay: '₹35,000',
      priceValue: 35000,
      currency: 'INR',
      order: 2,
      featured: true,
      active: true,
    },
    'black-belt': {
      title: 'Lean Six Sigma Black Belt',
      level: 'Advanced',
      duration: '6 Weeks',
      mode: { online: true, onsite: false, hybrid: true },
      accreditation: { cssc: true, iaf: true },
      idealFor: 'Senior analysts, Department heads, Improvement champions',
      outcome: 'CSSC & IAF Certified Black Belt - Drive complex projects and mentor Green Belts',
      certification: 'Dual Certification: CSSC Black Belt + IAF Accredited Master Certificate',
      description:
        'Advanced training for leading complex improvement projects and mentoring Green Belts in your organization.',
      priceDisplay: '₹75,000',
      priceValue: 75000,
      currency: 'INR',
      order: 3,
      featured: true,
      active: true,
    },
    'master-black-belt': {
      title: 'Lean Six Sigma Master Black Belt',
      level: 'Expert',
      duration: '8 Weeks',
      mode: { online: false, onsite: false, hybrid: true },
      accreditation: { cssc: true, iaf: true },
      idealFor: 'Executives, Program directors, Organizational leaders',
      outcome:
        'CSSC & IAF Certified Master Black Belt - Strategic leadership in organizational excellence',
      certification: 'Elite Dual Certification: CSSC Master Black Belt + IAF Excellence Award',
      description:
        'Elite certification for strategic leaders driving organizational excellence and mentoring Black Belts.',
      priceDisplay: '₹1,50,000',
      priceValue: 150000,
      currency: 'INR',
      order: 4,
      featured: false,
      active: true,
    },
    'lean-practitioner': {
      title: 'Lean Practitioner',
      level: 'Specialized',
      duration: '3 Weeks',
      mode: { online: true, onsite: true, hybrid: false },
      accreditation: { cssc: true, iaf: false },
      idealFor: 'Operations managers, Manufacturing professionals, Supply chain specialists',
      outcome: 'CSSC Certified Lean Practitioner - Implement Lean principles across operations',
      certification: 'CSSC Lean Practitioner Certificate with Value Stream Mapping Specialization',
      description:
        'Specialized training in Lean principles, waste elimination, and continuous flow improvement for operational excellence.',
      priceDisplay: '₹28,000',
      priceValue: 28000,
      currency: 'INR',
      order: 5,
      featured: false,
      active: true,
    },
  },

  courseTopics: {
    'yellow-belt': {
      t1: 'DMAIC Framework',
      t2: 'Basic Statistics',
      t3: 'Process Mapping',
      t4: 'Root Cause Analysis',
      t5: 'Waste Identification',
    },
    'green-belt': {
      t1: 'Advanced DMAIC',
      t2: 'Statistical Analysis',
      t3: 'Hypothesis Testing',
      t4: 'Control Charts',
      t5: 'Project Management',
    },
    'black-belt': {
      t1: 'Advanced Statistics',
      t2: 'Design of Experiments',
      t3: 'Regression Analysis',
      t4: 'Team Leadership',
      t5: 'Change Management',
    },
    'master-black-belt': {
      t1: 'Strategic Deployment',
      t2: 'Advanced Analytics',
      t3: 'Organizational Design',
      t4: 'Executive Coaching',
      t5: 'Program Management',
    },
    'lean-practitioner': {
      t1: 'Value Stream Mapping',
      t2: '5S Implementation',
      t3: 'Kanban Systems',
      t4: 'Pull Production',
      t5: 'Kaizen Events',
    },
  },

  testimonials: {
    testimonial_001: {
      quote:
        "AIQM's Black Belt certification transformed my career. The practical approach and expert mentorship were invaluable.",
      author: 'Rajesh Kumar',
      role: 'Quality Manager, Manufacturing',
      company: 'Manufacturing',
      rating: 5,
      featured: true,
      order: 1,
    },
    testimonial_002: {
      quote:
        'Exceptional training program! The skills I gained have directly contributed to significant cost savings in our operations.',
      author: 'Priya Sharma',
      role: 'Process Excellence Lead, IT Services',
      company: 'IT Services',
      rating: 5,
      featured: true,
      order: 2,
    },
    testimonial_003: {
      quote:
        'World-class curriculum delivered by industry experts. This certification opened doors I never thought possible.',
      author: 'Amit Patel',
      role: 'Operations Director, Healthcare',
      company: 'Healthcare',
      rating: 5,
      featured: true,
      order: 3,
    },
  },

  sectionHeaders: {
    featuredCourses: {
      title: 'Featured Certification Programs',
      description:
        'Industry-recognized certifications to accelerate your career in quality management',
    },
    testimonials: {
      title: 'What Our Alumni Say',
      description: 'Success stories from certified professionals',
    },
    services: {
      title: 'Our Consultancy Services',
      description:
        'Comprehensive consulting solutions tailored to your business needs, delivered by industry experts',
    },
    industries: {
      title: 'Industries We Serve',
      description: 'Delivering excellence across diverse sectors with industry-specific expertise',
    },
    caseStudies: {
      title: 'Proven Results Across Industries',
      description: 'Real case studies demonstrating measurable impact and sustainable improvements',
    },
    story: {
      title: 'Our Story',
      description:
        "From humble beginnings to becoming India's premier quality excellence institute",
    },
    missionVision: {
      title: 'Our Mission & Vision',
      description: 'Guided by our commitment to excellence and driven by our vision for the future',
    },
    globalPresence: {
      title: 'Our Global Footprint',
      description:
        'Serving organizations across 13 countries with world-class quality management solutions',
    },
    leadership: {
      title: 'Leadership & Faculty',
      description:
        'Led by distinguished professionals from premier institutes, our team brings decades of combined experience in quality excellence',
    },
    accreditations: {
      title: 'Our Accreditations',
      description:
        'AIQM India is accredited by leading international bodies, ensuring that your certification is recognized and valued across the globe.',
    },
    benefits: {
      title: 'Why Get Certified with AIQM India?',
      description:
        'Transform your career with certifications that deliver real, measurable results',
    },
  },

  about: {
    storyParagraphs: {
      p1: 'Founded in 1998 by distinguished alumni from IIT Bombay and IIM Ahmedabad, AIQM India began with a singular vision: to transform quality management practices across India.',
      p2: "What started as a small training center in Mumbai has grown into India's most trusted partner in quality excellence, serving organizations across 13 countries and training over 95,000 professionals.",
      p3: 'Our journey has been marked by continuous innovation, unwavering commitment to excellence, and a deep understanding of the unique challenges faced by Indian organizations in their quest for operational excellence.',
    },
    storyImage: '',
    globalMapImage: '',
    keyFacts: {
      alumni: {
        title: 'IIT & IIM Alumni',
        description: "Founded by graduates from India's premier institutes",
        order: 1,
      },
      years: {
        title: '25+ Years',
        description: 'Over two decades of continuous excellence',
        order: 2,
      },
      trained: {
        title: '95,000+',
        description: 'Professionals trained across industries',
        order: 3,
      },
      projects: { title: '11,000+', description: 'Projects successfully delivered', order: 4 },
    },
    mission: {
      title: 'Our Mission',
      statement:
        'To empower organizations and professionals across India and beyond with world-class quality management expertise, enabling them to achieve operational excellence and sustainable competitive advantage.',
    },
    missionPoints: {
      p1: 'Deliver world-class Lean Six Sigma training and certification programs',
      p2: 'Provide strategic consultancy for measurable business transformation',
      p3: 'Foster a culture of continuous improvement across industries',
    },
    vision: {
      title: 'Our Vision',
      statement:
        'To be recognized as the leading catalyst for operational excellence in Asia, transforming one million professionals and one thousand organizations by 2030 through innovative quality management solutions.',
    },
    visionPoints: {
      p1: 'Expand our global footprint to 25+ countries by 2030',
      p2: 'Pioneer AI-driven quality management methodologies',
      p3: 'Create sustainable impact through green belt and beyond initiatives',
    },
  },

  leadership: {
    director: {
      name: 'Mr. G.K.K. Singh',
      title: 'Founder & Director, AIQM India',
      education: 'B.Tech (Hons.), IIT Mumbai (Silver Medalist) | MBA, IIM Kolkata',
      credentials:
        'Lean Six Sigma Master Black Belt | ISO Lead Auditor | Certified Corporate Director (IOD)',
      experience:
        '30+ years across Johnson & Johnson, Baker Gauges, and leadership of AIQM since 1995',
      recognition:
        '"Outstanding People of the 20th Century Award" — International Biographical Center, Cambridge, UK',
      photoUrl: '',
    },
    directorImpact: {
      i1: { text: 'Mentored 4,300+ Lean Six Sigma projects', order: 1 },
      i2: { text: 'Trained 40,000+ professionals across 13 countries', order: 2 },
    },
    directorsMessage:
      "At AIQM, our mission is to empower professionals and organizations with the tools of excellence. Over the past three decades, I've had the privilege of mentoring 4,300+ Lean Six Sigma projects and training more than 40,000 professionals worldwide. Our approach blends academic rigor with practical impact — ensuring every participant leaves with skills that transform careers and businesses.",
  },

  faculty: {
    kawaljit: {
      name: 'Mrs. Kawaljit Singh Kathuria',
      title: 'Six Sigma Master Black Belt, IRCA-UK Lead Auditor',
      experience: '30+ years • 2,500+ projects mentored • 35,000+ trained',
      expertise: 'Lean Six Sigma, TQM, Integrated Management Systems',
      photoUrl: '',
      order: 1,
    },
    shreeniwas: {
      name: 'Mr. Shreeniwas Bhagwat',
      title: 'Lean Six Sigma Master Black Belt',
      experience: 'MBA, IIM Kolkata • 30 years in operations & process excellence',
      expertise: 'Quality Management, ISO Standards, TQM',
      photoUrl: '',
      order: 2,
    },
    ibrahim: {
      name: 'Mr. Ibrahim Naeem Ghaith',
      title: 'Certified International Professional Trainer (USA)',
      experience: 'Kaizen Lean Manager • Excellence Awards Consultant (UAE)',
      expertise: 'Kaizen, Lean Management, Customer Service Excellence',
      photoUrl: '',
      order: 3,
    },
    sucheta: {
      name: 'Mrs. Sucheta Mirashi',
      title: 'Six Sigma Master Black Belt, ASCB-USA Approved Faculty',
      experience: '24+ years • 18,000+ professionals trained',
      expertise: 'ISO Standards, TQM, Kaizen, Lean Management',
      photoUrl: '',
      order: 4,
    },
    nagaraju: {
      name: 'Mr. G.V.R. Nagaraju',
      title: 'Big Data & Business Analytics Expert',
      experience: '25+ years • 23,000+ trained • 1,800+ projects mentored',
      expertise:
        'MBA (Marketing) • Certified in Big Data Analytics (Wiley USA) & Business Analytics (IIM Kozhikode)',
      photoUrl: '',
      order: 5,
    },
  },

  countries: {
    IN: { name: 'India', flag: '🇮🇳', order: 1 },
    US: { name: 'United States', flag: '🇺🇸', order: 2 },
    GB: { name: 'United Kingdom', flag: '🇬🇧', order: 3 },
    SG: { name: 'Singapore', flag: '🇸🇬', order: 4 },
    AE: { name: 'UAE', flag: '🇦🇪', order: 5 },
    SA: { name: 'Saudi Arabia', flag: '🇸🇦', order: 6 },
    MY: { name: 'Malaysia', flag: '🇲🇾', order: 7 },
    TH: { name: 'Thailand', flag: '🇹🇭', order: 8 },
    AU: { name: 'Australia', flag: '🇦🇺', order: 9 },
    CA: { name: 'Canada', flag: '🇨🇦', order: 10 },
    DE: { name: 'Germany', flag: '🇩🇪', order: 11 },
    ZA: { name: 'South Africa', flag: '🇿🇦', order: 12 },
    PH: { name: 'Philippines', flag: '🇵🇭', order: 13 },
  },

  accreditationDetails: {
    cssc: {
      name: 'CSSC USA',
      fullName: 'Council for Six Sigma Certification',
      description: 'Council for Six Sigma Certification',
      logoColor: 'blue',
      order: 1,
    },
    iaf: {
      name: 'IAF',
      fullName: 'International Accreditation Forum',
      description: 'International Accreditation Forum',
      logoColor: 'green',
      order: 2,
    },
    iso: {
      name: 'ISO',
      fullName: 'International Organization for Standardization',
      description: 'International Organization for Standardization',
      subtext: '9001 Certified',
      logoColor: 'purple',
      order: 3,
    },
  },

  accreditationFeatures: {
    cssc: { f1: 'Globally recognized', f2: 'Industry standard', f3: 'Lifetime validity' },
    iaf: { f1: 'Worldwide acceptance', f2: 'Quality assurance', f3: 'Peer recognition' },
    iso: { f1: 'Quality management', f2: 'International standards', f3: 'Trusted worldwide' },
  },

  certificationBenefits: {
    salary: {
      title: '20-30% Salary Increase',
      description:
        'Certified professionals see an average salary boost of 20-30% within the first year of certification.',
      iconType: 'currency',
      order: 1,
    },
    global: {
      title: 'Globally Portable',
      description:
        'Your certification is recognized in 13+ countries, opening doors to international career opportunities.',
      iconType: 'globe',
      order: 2,
    },
    recognition: {
      title: 'Industry Recognition',
      description:
        'Our certifications are recognized and respected across all major industries including IT, manufacturing, healthcare, and finance.',
      iconType: 'education',
      order: 3,
    },
  },

  services: {
    'process-improvement': {
      title: 'Process Improvement',
      description:
        'Streamline your operations and eliminate waste through Lean Six Sigma methodologies.',
      colorTheme: 'blue',
      image: '',
      order: 1,
    },
    'business-excellence': {
      title: 'Business Excellence',
      description:
        'Achieve world-class quality standards with ISO certifications and excellence frameworks.',
      colorTheme: 'green',
      image: '',
      order: 2,
    },
    auditing: {
      title: 'Auditing',
      description:
        'Comprehensive internal and external audits to ensure compliance and identify improvement areas.',
      colorTheme: 'purple',
      image: '',
      order: 3,
    },
    'project-mentoring': {
      title: 'Project Mentoring',
      description:
        'Expert guidance and hands-on support for successful project implementation and completion.',
      colorTheme: 'orange',
      image: '',
      order: 4,
    },
  },

  serviceDeliverables: {
    'process-improvement': {
      d1: 'Value Stream Mapping',
      d2: 'Process Optimization',
      d3: 'Waste Reduction Strategies',
      d4: 'Efficiency Enhancement',
      d5: 'Cost Reduction Programs',
    },
    'business-excellence': {
      d1: 'ISO 9001 Implementation',
      d2: 'Quality Management Systems',
      d3: 'Excellence Framework Setup',
      d4: 'Compliance Assurance',
      d5: 'Continuous Improvement Culture',
    },
    auditing: {
      d1: 'Internal Quality Audits',
      d2: 'External Compliance Audits',
      d3: 'Gap Analysis Reports',
      d4: 'Risk Assessment',
      d5: 'Corrective Action Plans',
    },
    'project-mentoring': {
      d1: 'Project Planning Support',
      d2: 'Expert Mentorship',
      d3: 'Implementation Guidance',
      d4: 'Regular Progress Reviews',
      d5: 'Knowledge Transfer',
    },
  },

  industries: {
    manufacturing: {
      name: 'Manufacturing',
      description: 'Process optimization and quality improvement',
      projects: '5,000+',
      order: 1,
    },
    healthcare: {
      name: 'Healthcare',
      description: 'Patient care & operational efficiency',
      projects: '2,500+',
      order: 2,
    },
    it: {
      name: 'IT & Technology',
      description: 'Agile transformation & DevOps',
      projects: '3,200+',
      order: 3,
    },
    finance: {
      name: 'Finance & Banking',
      description: 'Risk management & compliance',
      projects: '1,800+',
      order: 4,
    },
    logistics: {
      name: 'Logistics',
      description: 'Supply chain optimization',
      projects: '2,000+',
      order: 5,
    },
    retail: {
      name: 'Retail',
      description: 'Customer experience & operations',
      projects: '1,500+',
      order: 6,
    },
  },

  caseStudies: {
    'manufacturing-case': {
      industry: 'Manufacturing',
      companySize: 'Large Enterprise (5000+ employees)',
      challenge:
        'High defect rates and production inefficiencies leading to significant waste and customer complaints',
      solution:
        'Implemented comprehensive Lean Six Sigma program with process mapping, DMAIC methodology, and team training',
      timeline: '6 months',
      teamSize: '8 consultants',
      colorTheme: 'blue',
      image: '',
      order: 1,
    },
    'logistics-case': {
      industry: 'Logistics & Supply Chain',
      companySize: 'Mid-sized Company (500-1000 employees)',
      challenge:
        'Inefficient warehouse operations and delivery delays causing revenue loss and poor customer experience',
      solution:
        'Redesigned warehouse layout, implemented WMS system, and optimized delivery routes using data analytics',
      timeline: '4 months',
      teamSize: '6 consultants',
      colorTheme: 'green',
      image: '',
      order: 2,
    },
    'healthcare-case': {
      industry: 'Healthcare',
      companySize: 'Hospital Network (10+ facilities)',
      challenge:
        'Patient wait times, operational inefficiencies, and high costs impacting patient care quality',
      solution:
        'Applied Lean Healthcare principles, optimized patient flow, and standardized clinical processes',
      timeline: '8 months',
      teamSize: '10 consultants',
      colorTheme: 'purple',
      image: '',
      order: 3,
    },
  },

  caseStudyOutcomes: {
    'manufacturing-case': {
      o1: { metric: '35%', description: 'Reduction in defect rates' },
      o2: { metric: '₹12 Cr', description: 'Annual cost savings' },
      o3: { metric: '40%', description: 'Faster production cycle' },
      o4: { metric: '92%', description: 'Customer satisfaction score' },
    },
    'logistics-case': {
      o1: { metric: '40%', description: 'Increase in operational efficiency' },
      o2: { metric: '₹8 Cr', description: 'Annual operational savings' },
      o3: { metric: '65%', description: 'Reduction in delivery time' },
      o4: { metric: '99.2%', description: 'On-time delivery rate' },
    },
    'healthcare-case': {
      o1: { metric: '₹2.5 Cr', description: 'Annual cost reduction' },
      o2: { metric: '50%', description: 'Reduction in patient wait time' },
      o3: { metric: '28%', description: 'Improvement in bed utilization' },
      o4: { metric: '4.8/5', description: 'Patient satisfaction rating' },
    },
  },

  ctaBanners: {
    courses: {
      headline: 'Ready to accelerate your career?',
      subheadline: 'Join our next batch today',
      primaryCtaText: 'Enroll Now',
      secondaryCtaText: 'Download Brochure',
      batchInfo: 'Next batch starts: January 15, 2025',
    },
    certifications: {
      headline: 'Ready to Get Certified?',
      trustIndicator1: 'Free Demo',
      trustIndicator2: '24/7 Support',
      trustIndicator3: '100% Placement',
    },
    consultancy: {
      headline: 'Partner with AIQM for Measurable ROI',
    },
  },

  ctaInfoCards: {
    certifications: {
      demo: { title: 'Free Demo Sessions', description: 'Experience our training methodology' },
      support: { title: '24/7 Support', description: 'Round-the-clock assistance' },
      placement: { title: '100% Placement Assistance', description: 'Career support and guidance' },
    },
  },
}

export function SeedUtility() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSeed = async () => {
    setStatus('loading')
    setMessage('')

    try {
      const siteContentRef = ref(db, 'siteContent')
      await set(siteContentRef, siteContentData)
      setStatus('success')
      setMessage('Database seeded successfully!')
    } catch (error) {
      setStatus('error')
      setMessage(`Error: ${error.message}`)
      console.error('Seed error:', error)
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Database Seed Utility</h3>
      <p className="text-gray-400 text-sm mb-6">
        Push the initial content blueprint to Firebase Realtime Database at path{' '}
        <code className="text-primary-400">siteContent/</code>
      </p>

      <button
        onClick={handleSeed}
        disabled={status === 'loading'}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          status === 'loading'
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        } text-white`}
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Seeding...
          </span>
        ) : (
          'Seed Database'
        )}
      </button>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status === 'success'
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          <p className={status === 'success' ? 'text-green-400' : 'text-red-400'}>{message}</p>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>This will create/overwrite the following collections:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>global, stats, heroes</li>
          <li>courses, courseTopics</li>
          <li>testimonials, sectionHeaders</li>
          <li>about, leadership, faculty</li>
          <li>countries, accreditationDetails, accreditationFeatures</li>
          <li>certificationBenefits, services, serviceDeliverables</li>
          <li>industries, caseStudies, caseStudyOutcomes</li>
          <li>ctaBanners, ctaInfoCards</li>
        </ul>
      </div>
    </div>
  )
}
