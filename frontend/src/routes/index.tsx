import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const { auth } = context
    if (!auth.isLoggedIn()) throw redirect({ to: '/login' })
    else throw redirect({ to: '/dashboard' })
  },
  component: Index,
})

function Index() {
  return <Outlet />
}
