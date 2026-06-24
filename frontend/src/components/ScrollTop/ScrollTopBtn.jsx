import './ScrollTopBtn.css'
import React, { useState, useEffect } from 'react'

const ScrollTopBtn = () => {
     const [isVisible, setIsVisible] = useState(false)

     const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Set top coordinate to 0 and behavior to smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    
    // Clean up the listener on unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-btn" aria-label="Scroll to top">
          ↑
        </button>
      )}
    </div>
  )
}

export default ScrollTopBtn