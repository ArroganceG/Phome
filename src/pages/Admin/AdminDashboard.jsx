import { useState, useEffect, useCallback, useMemo } from 'react'
import { loadPhotos, updatePhoto, deletePhoto, addPhoto, getCategories, addCategory, updateCategory, deleteCategory } from '../../services/photoStorage'
import { api } from '../../services/api'

const PHOTOS_PER_PAGE = 12

export default function AdminDashboard() {
  const [photos, setPhotos] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [dragOverCategory, setDragOverCategory] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState('作品')
  const [selectedPhotos, setSelectedPhotos] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [photosData, categoriesData] = await Promise.all([
        loadPhotos(),
        getCategories()
      ])
      setPhotos(photosData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load data:', error)
      showMessage('error', '加载数据失败，请检查服务器连接')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }, [])

  const handleUpload = async (files) => {
    setUploading(true)
    let skipCount = 0
    let successCount = 0
    const duplicates = []

    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const base64 = await fileToBase64(file)
          const fileName = file.name.replace(/\.[^/.]+$/, '')

          try {
            await addPhoto({
              title: fileName,
              category: uploadCategory,
              imageBase64: base64
            })
            successCount++
          } catch (error) {
            if (error.message && error.message.includes('已存在')) {
              duplicates.push(fileName)
            } else {
              console.error('Upload failed:', error)
            }
          }
        }
      }

      await fetchData()

      if (duplicates.length > 0) {
        showMessage('warning', `上传完成！成功 ${successCount} 张，跳过 ${duplicates.length} 张重复照片`)
      } else {
        showMessage('success', `成功上传 ${successCount} 张照片到"${uploadCategory}"！`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      showMessage('error', '上传失败')
    } finally {
      setUploading(false)
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleUpload(files)
    }
    e.target.value = ''
  }

  const handleDragStart = (e, photoId) => {
    e.dataTransfer.setData('photoId', String(photoId))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, category) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCategory(category)
  }

  const handleDragLeave = () => {
    setDragOverCategory(null)
  }

  const handleDrop = async (e, newCategory) => {
    e.preventDefault()
    setDragOverCategory(null)

    if (newCategory === '全部') return

    const photoId = e.dataTransfer.getData('photoId')
    if (photoId) {
      const result = await updatePhoto(photoId, { category: newCategory })
      if (result) {
        setPhotos(prevPhotos =>
          prevPhotos.map(p =>
            p.id === photoId ? { ...p, category: newCategory } : p
          )
        )
        showMessage('success', `已将照片移动到"${newCategory}"`)
      }
    }
  }

  const handleDelete = async (photoId) => {
    if (!window.confirm('确定要删除这张照片吗？')) return

    const result = await deletePhoto(photoId)
    if (result) {
      const updatedPhotos = photos.filter(p => p.id !== photoId)
      setPhotos(updatedPhotos)
      setSelectedPhotos(prev => prev.filter(id => id !== photoId))

      const filteredPhotos = selectedCategory === '全部'
        ? updatedPhotos
        : updatedPhotos.filter(p => p.category === selectedCategory)
      const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE)
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages)
      }

      showMessage('success', '删除成功！')
    }
  }

  const handleBatchDelete = async () => {
    if (selectedPhotos.length === 0) {
      showMessage('error', '请先选择要删除的照片')
      return
    }

    if (!window.confirm(`确定要删除选中的 ${selectedPhotos.length} 张照片吗？`)) return

    try {
      const result = await api.photos.batchDelete(selectedPhotos)
      console.log('Batch delete result:', result)
      const updatedPhotos = photos.filter(p => !selectedPhotos.includes(p.id))
      setPhotos(updatedPhotos)
      setSelectedPhotos([])
      if (updatedPhotos.length > 0) {
        const newTotalPages = Math.ceil(updatedPhotos.length / PHOTOS_PER_PAGE)
        if (currentPage > newTotalPages) {
          setCurrentPage(Math.max(1, newTotalPages))
        }
      } else {
        setCurrentPage(1)
      }
      showMessage('success', `成功删除 ${selectedPhotos.length} 张照片！`)
    } catch (error) {
      console.error('Batch delete failed:', error)
      showMessage('error', `批量删除失败: ${error.message}`)
    }
  }

  const toggleSelectPhoto = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const selectAll = () => {
    if (selectedPhotos.length === paginatedPhotos.length) {
      setSelectedPhotos([])
    } else {
      setSelectedPhotos(paginatedPhotos.map(p => p.id))
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      const result = await addCategory(newCategoryName.trim())
      if (result) {
        setCategories(result)
        setNewCategoryName('')
        showMessage('success', `已添加分类"${newCategoryName.trim()}"`)
      }
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setEditCategoryName(category)
  }

  const saveCategory = async () => {
    if (editingCategory && editCategoryName.trim()) {
      const newName = editCategoryName.trim()
      const result = await updateCategory(editingCategory, newName)
      if (result) {
        setCategories(result)
        setPhotos(prevPhotos =>
          prevPhotos.map(p =>
            p.category === editingCategory ? { ...p, category: newName } : p
          )
        )
        showMessage('success', `已将分类重命名为"${newName}"`)
      }
    }
    setEditingCategory(null)
    setEditCategoryName('')
  }

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`确定要删除分类"${category}"吗？该分类下的照片将移动到"未分类"。`)) return
    const result = await deleteCategory(category)
    if (result) {
      setCategories(result)
      setPhotos(prevPhotos =>
        prevPhotos.map(p =>
          p.category === category ? { ...p, category: '未分类' } : p
        )
      )
      if (selectedCategory === category) {
        setSelectedCategory('全部')
      }
      showMessage('success', `已删除分类"${category}"，照片已移动到"未分类"`)
    }
  }

  const startEditing = (photo) => {
    setEditingId(photo.id)
    setEditTitle(photo.title)
  }

  const saveTitle = async () => {
    if (editingId && editTitle.trim()) {
      const newTitle = editTitle.trim()
      const result = await updatePhoto(editingId, { title: newTitle })
      if (result) {
        setPhotos(prevPhotos =>
          prevPhotos.map(p =>
            p.id === editingId ? { ...p, title: newTitle } : p
          )
        )
        showMessage('success', '标题已更新！')
      }
    }
    setEditingId(null)
    setEditTitle('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const filteredPhotos = useMemo(() => {
    return selectedCategory === '全部'
      ? photos
      : photos.filter(p => p.category === selectedCategory)
  }, [photos, selectedCategory])

  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE)
  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * PHOTOS_PER_PAGE
    return filteredPhotos.slice(start, start + PHOTOS_PER_PAGE)
  }, [filteredPhotos, currentPage])

  const photosByCategory = useMemo(() => {
    const result = {}
    categories.forEach(cat => {
      result[cat] = photos.filter(p => p.category === cat)
    })
    return result
  }, [photos, categories])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-primary-800 mb-2">📸 照片管理</h1>
        <p className="text-gray-600">
          共 {photos.length} 张照片 | 云端存储模式
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          message.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-8">
        <h2 className="font-medium text-gray-700 mb-4">📤 上传新照片</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">导入到分类：</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 bg-white"
            >
              {categories.filter(c => c !== '全部').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <label className={`border-2 border-dashed border-primary-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors block ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium">{uploading ? '上传中...' : '点击选择照片或拖拽到这里'}</p>
            <p className="text-gray-400 text-sm">支持 JPG、PNG、GIF、WebP 格式</p>
          </div>
        </label>
      </div>

      <div className="mb-6">
        <h2 className="font-medium text-gray-700 mb-4">🔍 按分类筛选</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {cat} ({cat === '全部' ? photos.length : photosByCategory[cat]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-700">
            📷 照片列表
            <span className="text-gray-400 text-sm ml-2">
              (显示 {paginatedPhotos.length} 张，共 {filteredPhotos.length} 张)
            </span>
          </h2>
          {selectedPhotos.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ 批量删除 ({selectedPhotos.length})
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPhotos.length === paginatedPhotos.length && paginatedPhotos.length > 0}
              onChange={selectAll}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">全选当前页</span>
          </label>
          <span className="text-sm text-gray-500">
            已选择 {selectedPhotos.length} 张
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedPhotos.map((photo) => (
            <div
              key={photo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, photo.id)}
              className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative ${selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div
                className="absolute top-2 left-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedPhotos.includes(photo.id)}
                  onChange={() => toggleSelectPhoto(photo.id)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white/80"
                />
              </div>
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                {editingId === photo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary-500"
                      autoFocus
                    />
                    <button
                      onClick={saveTitle}
                      className="px-2 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-2 py-1 bg-gray-200 text-gray-600 text-sm rounded hover:bg-gray-300"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <p
                    className="font-medium text-gray-800 cursor-pointer hover:text-primary-600 mb-2 truncate"
                    onClick={() => startEditing(photo)}
                    title="点击修改标题"
                  >
                    {photo.title}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {photo.category}
                  </span>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {selectedCategory === '全部' ? '暂无照片，上传一些吧！' : `暂无"${selectedCategory}"分类的照片`}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50"
            >
              上一页
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200 hover:bg-primary-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
        <h2 className="font-display text-xl text-primary-800 mb-4">🏷️ 拖拽分类管理</h2>
        <p className="text-gray-600 text-sm mb-6">将照片拖拽到分类框中来修改分类</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.filter(cat => cat !== '全部').map(category => (
            <div
              key={category}
              onDragOver={(e) => handleDragOver(e, category)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, category)}
              className={`min-h-[180px] rounded-xl border-2 border-dashed p-3 transition-colors overflow-hidden ${
                dragOverCategory === category
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200'
              }`}
            >
              <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"></span>
                {editingCategory === category ? (
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveCategory()}
                    onBlur={saveCategory}
                    className="flex-1 px-1 py-0.5 text-sm border border-primary-300 rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{category}</span>
                )}
                <span className="text-xs text-gray-400 flex-shrink-0">({photosByCategory[category]?.length || 0})</span>
                {category !== '全部' && editingCategory !== category && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-xs text-gray-400 hover:text-primary-600"
                      title="编辑分类"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="text-xs text-gray-400 hover:text-red-600"
                      title="删除分类"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </h3>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                {photosByCategory[category]?.slice(0, 10).map((photo) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, photo.id)}
                    className="bg-gray-100 rounded p-1.5 flex items-center gap-1.5 cursor-grab active:cursor-grabbing"
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-6 h-6 rounded object-cover flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 truncate">
                      {photo.title}
                    </span>
                  </div>
                ))}
                {photosByCategory[category]?.length > 10 && (
                  <p className="text-xs text-gray-400 text-center">
                    还有 {photosByCategory[category].length - 10} 张...
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="min-h-[180px] rounded-xl border-2 border-dashed border-primary-300 p-3 flex flex-col items-center justify-center">
            <form onSubmit={handleAddCategory} className="w-full">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="新分类名称"
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded mb-2 focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={!newCategoryName.trim()}
                className="w-full px-3 py-1.5 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                添加分类
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">💡 使用提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 点击照片标题可以直接编辑</li>
          <li>• 拖拽照片可以修改分类</li>
          <li>• 数据保存在云端服务器，可跨设备访问</li>
        </ul>
      </div>
    </div>
  )
}