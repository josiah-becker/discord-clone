import { createFileRoute } from '@tanstack/react-router'
import ResizeableElement from '../components/ResizeableElement'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2 h-full flex overflow-auto">
      {/* Sidebar */}
      <ResizeableElement minWidth={200}>
        <div className="size-full bg-green-700"></div>
      </ResizeableElement>
      <ResizeableElement minWidth={200}></ResizeableElement>
      <div className="h-full flex-1 min-w-96 gap-12 bg-[#25262B] flex"></div>
    </div>
  )
}
