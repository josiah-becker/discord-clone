import { createFileRoute } from '@tanstack/react-router'
import useResizeableElement from '../hooks/useResizeableElement'

export const Route = createFileRoute('/')({
  component: Index,
})

const Yuhs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
function Index() {
  const { resize, startResizing, stopResizing, width } = useResizeableElement()

  return (
    <div
      className="p-2 h-full flex overflow-auto"
      onMouseMove={(e) => resize(e)}
      onMouseUp={stopResizing}
    >
      {/* Sidebar */}
      <nav
        className="h-full bg-[#1A1C1E] overflow-auto relative @container-[size]"
        style={{ width: `${width}px` }}
      >
        {/* Resizer Handle */}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        />
        <div className="size-full @7xl:bg-red-500"></div>
      </nav>
      <div className="h-full flex-1 gap-12 bg-[#25262B] flex"></div>
    </div>
  )
}
