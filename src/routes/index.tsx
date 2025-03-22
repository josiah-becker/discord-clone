import { createFileRoute } from '@tanstack/react-router'
import ResizeableElement from '../components/ResizeableElement'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="h-full flex overflow-auto">
      {/* Sidebar */}
      <ResizeableElement maxWidth={450} snapToZero={100}></ResizeableElement>
      <div className="h-full flex-1 min-w-96 gap-12 bg-[#25262B] flex"></div>
    </div>
  )
}
