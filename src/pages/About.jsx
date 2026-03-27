import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TimelineItem = ({ year, title, description, isLast = false }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary-500 border-4 border-primary-100" />
        {!isLast && <div className="w-0.5 h-full bg-primary-200 my-2" />}
      </div>
      <div className="pb-10">
        <span className="text-primary-600 font-medium text-sm">{year}</span>
        <h3 className="font-display text-xl text-primary-800 mt-1 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

const ServiceCard = ({ icon, title, description, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100/50 hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="font-display text-xl text-primary-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function About() {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  return (
    <div className="pt-20 min-h-screen">
      <section ref={heroRef} className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80"
                    alt="摄影师照片"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-200 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-100 rounded-full -z-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-primary-600 text-sm tracking-[0.2em] uppercase">
                关于我
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-primary-800 mt-3 mb-6">
                用镜头守护<br />每一份童真
              </h1>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  你好，我是一名专注于校园生活的摄影师。从事教育摄影工作近三年，
                  我深深爱上了这份能够记录孩子们成长点滴的工作。
                </p>
                <p>
                  我的镜头捕捉过清晨教室里认真早读的身影，
                  记录过运动会上奋力冲刺的汗水，也定格过操场上无忧无虑的笑声。
                  每一个瞬间，都是童年最珍贵的记忆。
                </p>
                <p>
                  我相信，好的照片不仅仅是技术的呈现，
                  更是情感与故事的传递。我希望用我的镜头，
                  为每一个孩子留下值得珍藏一生的回忆。
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-primary-50 rounded-full">
                  <span className="text-primary-700 font-medium">📷 校园摄影</span>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-full">
                  <span className="text-primary-700 font-medium">🎓 毕业季拍摄</span>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-full">
                  <span className="text-primary-700 font-medium">🏆 活动记录</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary-600 text-sm tracking-[0.2em] uppercase">
              我的历程
            </span>
            <h2 className="font-display text-4xl text-primary-800 mt-3">
              成长足迹
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <TimelineItem
              year="2021"
              title="开启摄影之路"
              description="从一名教育工作者转型为校园摄影师，开始用相机记录校园生活"
            />
            <TimelineItem
              year="2022"
              title="建立专业团队"
              description="成立校园光影工作室，为多所小学提供摄影服务"
            />
            <TimelineItem
              year="2023"
              title="丰富作品主题"
              description="拓展运动、课堂、趣味活动等多个主题的拍摄"
            />
            <TimelineItem
              year="2024"
              title="线上作品集"
              description="推出个人摄影作品集网站，让更多人看到校园里的美好瞬间"
              isLast
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary-600 text-sm tracking-[0.2em] uppercase">
              服务内容
            </span>
            <h2 className="font-display text-4xl text-primary-800 mt-3">
              我能为您做什么
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              index={0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="校园日常记录"
              description="记录孩子们的日常校园生活，课堂、课间、午餐等珍贵时刻"
            />
            <ServiceCard
              index={1}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="运动会拍摄"
              description="精彩赛事记录，捕捉运动员们的拼搏瞬间"
            />
            <ServiceCard
              index={2}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              title="毕业季服务"
              description="为毕业生留下珍贵的校园回忆"
            />
            <ServiceCard
              index={3}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              title="趣味活动"
              description="记录校园文化节、汇演等活动精彩瞬间"
            />
            <ServiceCard
              index={4}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="师生合影"
              description="班级合影、师生情谊的温馨记录"
            />
            <ServiceCard
              index={5}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="照片版权保护"
              description="所有照片加水印保护，独家授权给客户使用"
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-800 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-6">
            期待与您合作
          </h2>
          <p className="text-primary-200 text-lg mb-10">
            如果您希望为您的学校或活动留下珍贵的影像记录<br />
            欢迎通过邮件与我联系
          </p>
          <a
            href="mailto:contact@campuslens.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-full font-medium hover:bg-primary-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            发送邮件
          </a>
        </motion.div>
      </section>
    </div>
  )
}