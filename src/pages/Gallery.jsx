import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { photos, categories } from '../data/photos'

const PhotoCard = ({ photo, index, onClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={() => onClick(photo)}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-md bg-primary-50 aspect-[4/3]">
        <img
          src={photo.src}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-medium text-sm">{photo.title}</h3>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-primary-700">
            {photo.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

const Lightbox = ({ photo, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
        onClick={onClose}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src.replace('w=800', 'w=1600')}
          alt={photo.title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        <div className="mt-4 text-center">
          <h3 className="text-white font-display text-2xl mb-2">{photo.title}</h3>
          <p className="text-white/70 text-sm">{photo.description}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary-600/30 rounded-full text-primary-200 text-xs">
            {photo.category}
          </span>
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        按 ESC 关闭
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const filteredPhotos = activeCategory === '全部'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <section ref={headerRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-primary-600 text-sm tracking-[0.2em] uppercase">
              Campus Lens
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-800 mt-3 mb-6">
              作品集
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              这里收录了我镜头下的校园故事<br />
              每一个瞬间都弥足珍贵
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onClick={setSelectedPhoto}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPhotos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500">该分类下暂无作品</p>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}