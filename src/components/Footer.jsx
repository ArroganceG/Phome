import { Link } from 'react-router-dom'

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 6l-10 7L2 6"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white/90">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 5 C30 25 20 50 35 70 C45 80 55 80 65 70 C80 50 70 25 50 5 Z"
                  fill="#8FBC8F"
                />
                <path d="M50 20 L50 85" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <span className="font-display text-lg text-white">校园光影</span>
                <span className="block text-xs text-primary-300 tracking-widest">CAMPUS LENS</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              用镜头记录校园里的每一个温暖瞬间<br/>
              守护童年最纯粹的笑容
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-white">快速导航</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-white/70 hover:text-primary-300 transition-colors">
                首页
              </Link>
              <Link to="/gallery" className="text-sm text-white/70 hover:text-primary-300 transition-colors">
                作品集
              </Link>
              <Link to="/about" className="text-sm text-white/70 hover:text-primary-300 transition-colors">
                关于我
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-white">联系方式</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="mailto:contact@campuslens.com"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="邮箱"
              >
                <MailIcon />
              </a>
            </div>
            <p className="text-sm text-white/60 mt-4">
              记录每一个不可复制的瞬间
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <p className="text-xs text-white/50">
            © 2024 校园光影 Campus Lens. 用爱记录成长
          </p>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300" />
    </footer>
  )
}