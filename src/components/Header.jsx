import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const LeafIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
    <path
      d="M50 5 C30 25 20 50 35 70 C45 80 55 80 65 70 C80 50 70 25 50 5 Z"
      fill="#4A7C59"
    />
    <path
      d="M50 20 L50 85"
      stroke="#2f5a3d"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M50 35 Q62 45 55 60"
      stroke="#2f5a3d"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M50 35 Q38 45 45 60"
      stroke="#2f5a3d"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
)

const navLinks = [
  { path: '/', label: '首页' },
  { path: '/gallery', label: '作品集' },
  { path: '/about', label: '关于我' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <LeafIcon />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-semibold text-primary-700 tracking-wide">
              校园光影
            </span>
            <span className="text-xs text-primary-500 tracking-widest uppercase">
              Campus Lens
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-body text-sm tracking-wide transition-colors duration-300 ${
                location.pathname === link.path
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        <Link
              key="/admin"
              to="/admin"
              className="font-body text-sm tracking-wide transition-colors duration-300 text-gray-600 hover:text-primary-600"
            >
              管理
            </Link>
          </nav>

        <button
          className="md:hidden p-2 text-primary-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="菜单"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`h-0.5 bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-primary-100"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body py-2 ${
                    location.pathname === link.path
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}