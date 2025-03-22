import { HTMLAttributes, useEffect, useRef, useState } from 'react'

export default function ResizeableElement({
  startingWidth = 300,
  minWidth = 0,
  maxWidth = document.body.getBoundingClientRect().width,
  children,
  ...props
}: ResizeableElementProps) {
  const [width, setWidth] = useState(startingWidth)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)

  const startResizing = () => {
    setIsResizing(true)
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = (e: MouseEvent) => {
    if (isResizing && resizeRef.current) {
      setWidth(
        Math.max(
          minWidth,
          e.clientX - resizeRef.current.getBoundingClientRect().left
        )
      )
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

  console.log('resizing', isResizing)

  return (
    <div
      ref={resizeRef}
      className="relative"
      {...props}
      style={{
        width: `${width}px`,
        minWidth: `${isResizing ? minWidth : width}px`,
        maxWidth: `${maxWidth}px`,
      }}
    >
      {children}
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        onMouseDown={startResizing}
      />
    </div>
  )
}

interface ResizeableElementProps extends HTMLAttributes<HTMLDivElement> {
  startingWidth?: number
  minWidth?: number
  maxWidth?: number
  children?: React.ReactNode
}
