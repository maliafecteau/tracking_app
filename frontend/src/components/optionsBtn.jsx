import { apiFetch } from '../utils/api'
import React, {useState, useEffect, useRef} from 'react'

export default function optionsBtn() {
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    // close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // handle API calls to flask (edit and delete)
    const handleAction = async (actionName, type, itemId) => {
        try {
            const endpoint = type === 'expense' ? `/api/expenses/${itemId}` : `/api/bills/${itemId}`
            if (actionName === 'delete') {
                const response = await apiFetch(endpoint, { method: 'DELETE' })
                const data = await response.json()

                if (response.ok) {
                    setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`)
                    return
                }

                setError(data.error || 'Unable to delete item. Please log in first.')
            } else if (actionName === 'edit') {
                const response = await apiFetch(endpoint, { method: 'PUT' })
                const data = await response.json()
                if (response.ok) {
                    setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully.`)
                    return
                }
                setError(data.error || 'Unable to update item. Please log in first.')
            }
        } catch (err) {
            setError('An error occurred while processing your request.')
        }
        setIsOpen(false)
    }
            
    return (
        <div className="options-container" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="options-btn">
                &#8942; {/* Vertical ellipses unicode*/}
            </button>
        
        {isOpen && (
            <div className="dropdown-content">
                <button onClick={() => handleAction('edit')}>Edit</button>
                <button onClick={() => handleAction('delete')}>Delete</button>
            </div>
        )}
        </div>
    )
}