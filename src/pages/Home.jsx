import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

const FloatingLeaf = ({ delay = 0, x = 0 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%` }}
    initial={{ y: -50, opacity: 0, rotate: 0 }}
    animate={{
      y: ['0vh', '110vh'],
      opacity: [0, 1, 1, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <svg className="w-6 h-6 text-primary-300/30" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5 C30 25 20 50 35 70 C45 80 55 80 65 70 C80 50 70 25 50 5 Z" />
    </svg>
  </motion.div>
)

const StatCard = ({ number, label, suffix = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="font-display text-5xl md:text-6xl text-primary-600 mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        {isInView && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {number}{suffix}
          </motion.span>
        )}
      </motion.div>
      <p className="text-sm text-gray-500 tracking-wide">{label}</p>
    </motion.div>
  )
}

const PhotoCard = ({ photo, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg">
        <img
          src={photo.src}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white font-medium">{photo.title}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  return (
    <div className="pt-16">
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-earth-100">
        {[...Array(8)].map((_, i) => (
          <FloatingLeaf key={i} delay={i * 2} x={10 + i * 12} />
        ))}

        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary-100/50 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary-200/30 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block text-primary-600 text-sm tracking-[0.3em] uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              校园摄影作品集
            </motion.span>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-primary-800 mb-6 leading-tight">
              记录童年
              <span className="block text-primary-500">温暖时光</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              用镜头捕捉校园里每一个纯真的笑容<br />
              每一张照片，都是一段不可复制的成长故事
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
              >
                浏览作品
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-full font-medium hover:bg-primary-50 transition-colors"
              >
                了解我
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard number={3} suffix="年+" label="拍摄经验" />
            <StatCard number={50} suffix="+" label="作品数量" />
            <StatCard number={20} suffix="+" label="学校合作" />
            <StatCard number={1000} suffix="+" label="快乐瞬间" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-600 text-sm tracking-[0.2em] uppercase">精选作品</span>
            <h2 className="font-display text-4xl md:text-5xl text-primary-800 mt-3 mb-6">
              最近的作品
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              每一张照片都承载着孩子们的欢笑与成长
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <PhotoCard
                key={index}
                photo={{
                  id: index + 1,
                  title: ['晨光中的早读', '操场上的笑声', '老师的温柔', '美术课上的专注', '运动会的拼搏', '午餐时间的欢乐'][index],
                  src: `https://images.unsplash.com/photo-${index === 0 ? '1503676260728-1c00da094a0b' : index === 1 ? '1503454537195-1dcabb73ffb9' : index === 2 ? '1544717297-fa95b6ee9643' : index === 3 ? '1502086223501-7ea6ecd79368' : index === 4 ? '1574629810360-7efbbe195018' : '1567521464027-f127ff144326'}?w=800&q=80`,
                }}
                index={index}
              />
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              查看全部作品
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="leaves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 2 C5 7 3 12 6 17 C8 19 12 19 14 17 C19 12 17 7 10 2 Z" fill="currentColor" opacity="0.3"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#leaves)"/>
          </svg>
        </div>

        <motion.div
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl mb-6">
            让我为您的孩子<br />记录这段美好时光
          </h2>
          <p className="text-primary-200 text-lg mb-10 max-w-2xl mx-auto">
            每一个微笑、每一次成长都值得被珍藏。欢迎联系我，为您的学校或活动留下珍贵的影像记忆。
          </p>
          <a
            href="mailto:contact@campuslens.com"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-700 rounded-full font-medium hover:bg-primary-50 transition-colors"
          >
            联系我
          </a>
        </motion.div>
      </section>
    </div>
  )
}