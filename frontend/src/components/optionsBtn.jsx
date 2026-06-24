import { apiFetch } from '../utils/api'
import React, { useState, useEffect, useRef } from 'react'
import './OptionsBtn.css'

const OptionsBtn = ({ idKey, itemType, onDelete, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showCategoryPanel, setShowCategoryPanel] = useState(false)
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#4ECDC4')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowCategoryPanel(false)
        setShowNewCategoryForm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function loadCategories() {
    const res = await apiFetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  async function handleDelete() {
    try {
      const endpoint = itemType === 'expense'
        ? `/api/expenses/${idKey}`
        : `/api/bills/${idKey}`
      const response = await apiFetch(endpoint, { method: 'DELETE' })
      if (response.ok) {
        if (onDelete) onDelete()
      } else {
        const data = await response.json()
        setError(data.error || 'Unable to delete item.')
      }
    } catch {
      setError('An error occurred.')
    }
    setIsOpen(false)
  }

  async function handleCategorySelect(categoryName) {
  try {
    setError('')
    setMessage('')

    const response = await apiFetch(`/api/expenses/${idKey}/category`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryName }),
    })

    const data = await response.json()

    if (response.ok) {
      setMessage('Category updated.')

      if (onCategoryChange) {
        onCategoryChange(data.category)
      }

      setShowCategoryPanel(false)
      setIsOpen(false)
    } else {
      setError(data.error || 'Unable to update category.')
    }
  } catch {
    setError('An error occurred while updating category.')
  }
}

  async function handleCreateCategory(event) {
    event.preventDefault()
    const response = await apiFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: newCategoryName, color: newCategoryColor }),
    })
    if (response.ok) {
      const data = await response.json()
      setCategories(current => [...current, data])
      setNewCategoryName('')
      setShowNewCategoryForm(false)
      await handleCategorySelect(data.name)
    } else {
      const data = await response.json()
      setError(data.error || 'Unable to create category.')
    }
  }

  return (
    <div className="options-container" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="options-btn">. . .</button>

      {isOpen && !showCategoryPanel && (
        <div className="dropdown-content">
          {itemType === 'expense' && (
            <button onClick={() => {
              setShowCategoryPanel(true)
              loadCategories()
            }}>
              Edit Category
            </button>
          )}
          <button onClick={handleDelete}>Delete</button>
          {error && <p className="options-error">{error}</p>}
        </div>
      )}

      {isOpen && showCategoryPanel && (
        <div className="dropdown-content category-panel">
          <p className="category-panel-title">Select Category</p>
          {categories.map(cat => (
            <button
              key={cat.id}
              className="category-option"
              onClick={() => handleCategorySelect(cat.name)}
            >
              <span
                className="category-dot"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          ))}

          {!showNewCategoryForm ? (
            <button
              className="category-new-btn"
              onClick={() => setShowNewCategoryForm(true)}
            >
              + New Category
            </button>
          ) : (
            <form onSubmit={handleCreateCategory} className="new-category-form">
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                required
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={e => setNewCategoryColor(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowNewCategoryForm(false)}>Cancel</button>
            </form>
          )}

          <button
            className="category-back-btn"
            onClick={() => setShowCategoryPanel(false)}
          >
            ← Back
          </button>
          {error && <p className="options-error">{error}</p>}
        </div>
      )}

      {message && <p className="options-message">{message}</p>}
    </div>
  )
}

export default OptionsBtn