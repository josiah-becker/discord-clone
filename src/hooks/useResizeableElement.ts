import { useRef, useState } from 'react'

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

  const resize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isResizing.current) {
      setWidth(Math.max(minWidth, Math.min(e.clientX, maxWidth)))
    }
  }

  return {
    width,
    startResizing,
    stopResizing,
    resize,
  }
}

export interface useResizeableElementProps {
  startingWidth?: number
  minWidth?: number
  maxWidth?: number
}
