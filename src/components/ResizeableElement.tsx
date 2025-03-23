import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'

export default function ResizeableElement({
  startingWidth = 300,
  minWidth = 0,
  maxWidth = document.body.getBoundingClientRect().width,
  snapToZero = 0,
  onSnapEnd,
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
    if (width < snapToZero) {
      onSnapEnd?.()
    }
  }

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && resizeRef.current) {
        const width = Math.max(
          minWidth,
          e.clientX - resizeRef.current.getBoundingClientRect().left
        )

        if (width < snapToZero) {
          resizeRef.current.style.transitionProperty = 'width'
          resizeRef.current.style.transitionTimingFunction =
            'cubic-bezier(0.4, 0, 0.2, 1)'
          resizeRef.current.style.transitionDuration = '300ms'
          setWidth(0)
        } else {
          resizeRef.current.style.transitionProperty = ''
          resizeRef.current.style.transitionTimingFunction = ''
          resizeRef.current.style.transitionDuration = ''
          setWidth(width)
        }
      }
    },
    [isResizing, minWidth, snapToZero]
  )

  useEffect(() => {
    document.body.addEventListener('mousemove', resize)
    document.body.addEventListener('mouseup', stopResizing)

    return () => {
      document.body.removeEventListener('mousemove', resize)
      document.body.removeEventListener('mouseup', stopResizing)
    }
  })

  return (
    <div
      ref={resizeRef}
      className="relative"
      {...props}
      style={{
        width: `${width}px`,
        minWidth: `${isResizing ? minWidth : width > maxWidth ? maxWidth : width}px`,
        maxWidth: `${maxWidth}px`,
      }}
    >
      <div className="overflow-hidden">{children}</div>
      <button
        className="absolute top-0 right-0 w-4 translate-x-2 h-full cursor-ew-resize"
        onMouseDown={startResizing}
      />
    </div>
  )
}

interface ResizeableElementProps extends HTMLAttributes<HTMLDivElement> {
  startingWidth?: number
  minWidth?: number
  maxWidth?: number
  snapToZero?: number
  onSnapEnd?: () => void
  children?: React.ReactNode
}
