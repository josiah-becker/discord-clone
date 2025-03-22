import { createFileRoute } from '@tanstack/react-router'
import useResizeableElement from '../hooks/useResizeableElement'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { startResizing, width } = useResizeableElement()

  return (
    <div className="p-2 h-full flex overflow-auto">
      {/* Sidebar */}
      <nav
        className="h-full bg-[#1A1C1E] overflow-auto relative"
        style={{ width: `${width}px` }}
      >
        {/* Resizer Handle */}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        />
        <div className="size-full @7xl:bg-red-500"></div>
      </nav>
      <div className="h-full flex-1 gap-12 bg-[#25262B] flex">
        <div className="fixed inset-0 size-40 bg-white"></div>
      </div>
    </div>
  )
}
