import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/AdminDashboard'
import DatabaseViewer from './pages/Admin/DatabaseViewer'
import './index.css'

function AdminLayout() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <div className="min-h-screen bg-primary-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-3">
            <svg className="w-8 h-8 text-primary-600" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5 C30 25 20 50 35 70 C45 80 55 80 65 70 C80 50 70 25 50 5 Z" />
            </svg>
            <span className="font-display text-xl text-primary-700">后台管理</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-gray-600 hover:text-primary-600">查看网站</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              📸 照片管理
            </button>
            <button
              onClick={() => setActiveView('database')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'database'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              🗄️ 数据库
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'dashboard' ? <AdminDashboard /> : <DatabaseViewer />}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#faf9f7]">
        <div className="grain-overlay" />
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App