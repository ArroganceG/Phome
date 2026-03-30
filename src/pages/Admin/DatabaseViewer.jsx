import { useState, useEffect } from 'react'
import { api } from '../../services/api'

export default function DatabaseViewer() {
  const [photos, setPhotos] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('photos')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [photosData, categoriesData] = await Promise.all([
        api.photos.list(),
        api.categories.list()
      ])
      setPhotos(photosData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-primary-800 mb-2">🗄️ 数据库查看器</h1>
        <p className="text-gray-600">实时查看数据库中的数据</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'photos'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
          }`}
        >
          📷 照片 ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
          }`}
        >
          🏷️ 分类 ({categories.length})
        </button>
      </div>

      {activeTab === 'photos' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">标题</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">分类</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">图片路径</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">日期</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {photos.map((photo) => (
                  <tr key={photo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{photo.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{photo.title}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                        {photo.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs max-w-[200px] truncate">{photo.src}</td>
                    <td className="px-4 py-3 text-gray-500">{photo.date}</td>
                  </tr>
                ))}
                {photos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      暂无照片数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">分类名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">照片数量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category, index) => {
                const count = category === '全部'
                  ? photos.length
                  : photos.filter(p => p.category === category).length
                return (
                  <tr key={category} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{category}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                        {count} 张
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">💡 数据库信息</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 数据库文件位置: <code className="bg-blue-100 px-1 rounded">backend/data/db.sqlite</code></li>
          <li>• 数据库类型: SQLite (sql.js)</li>
          <li>• 照片总数: {photos.length}</li>
          <li>• 分类总数: {categories.length}</li>
        </ul>
      </div>
    </div>
  )
}