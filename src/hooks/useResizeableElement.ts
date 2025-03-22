import { useEffect, useRef, useState } from 'react'

export default function useResizeableElement({
  startingWidth = 300,
  minWidth = 200,
  maxWidth = document.body.getBoundingClientRect().width,
}: useResizeableElementProps = {}) {
  const [width, setWidth] = useState(startingWidth)
  const isResizing = useRef(false)

  console.log('width', width)

  const startResizing = () => {
    isResizing.current = true
  }

  const stopResizing = () => {
    isResizing.current = false
  }

  const resize = (e: MouseEvent) => {
    if (isResizing.current) {
      setWidth(Math.max(minWidth, Math.min(e.clientX, maxWidth)))
    }
  }

  useEffect(() => {
    document.body.addEventListener('mousemove', resize)
    document.body.addEventListener('mouseup', stopResizing)

    return () => {
      document.body.removeEventListener('mousemove', resize)
      document.body.removeEventListener('mouseup', stopResizing)
    }
  })

  return {
    width,
    startResizing,
  }
}

export interface useResizeableElementProps {
  startingWidth?: number
  minWidth?: number
  maxWidth?: number
}
