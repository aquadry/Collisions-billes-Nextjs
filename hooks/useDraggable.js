// ===== hooks/useDraggable.js =====
'use client'
import { useRef, useEffect, useState } from 'react'

export default function useDraggable() {
  const elementRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const header = element.querySelector('[class*="header"]')
    if (!header) return

    const handleMouseDown = (e) => {
      setIsDragging(true)
      const rect = element.getBoundingClientRect()
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      element.style.transition = 'none'
      e.preventDefault()
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return

      const x = e.clientX - dragOffset.current.x
      const y = e.clientY - dragOffset.current.y

      const maxX = window.innerWidth - element.offsetWidth
      const maxY = window.innerHeight - element.offsetHeight

      const constrainedX = Math.max(0, Math.min(x, maxX))
      const constrainedY = Math.max(0, Math.min(y, maxY))

      element.style.left = constrainedX + 'px'
      element.style.top = constrainedY + 'px'
      element.style.bottom = 'auto'
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        element.style.transition = 'all 0.3s ease'
      }
    }

    header.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      header.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return { elementRef, isDragging }
}