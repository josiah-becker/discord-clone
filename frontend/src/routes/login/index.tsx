import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { logIn } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className="flex flex-col p-12 gap-4 max-w-96">
      <input
        onChange={(e) => setUsername(e.target.value)}
        className="text-white placeholder:text-white"
        type="text"
        placeholder="username"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="text-white placeholder:text-white"
        type="password"
        placeholder="password"
      />
      <button
        onClick={async () => {
          const res = await logIn(username, password)
          if (res) nav({ to: '/dashboard' })
          else alert('Invalid credentials')
        }}
        className="text-white bg-gray-700"
      >
        Click to log in
      </button>
    </div>
  )
}
