import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { logIn } = useAuth()
  return (
    <div>
      <button onClick={() => logIn()} className="text-white">
        Click to log in
      </button>
    </div>
  )
}
