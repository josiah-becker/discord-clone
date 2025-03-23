import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const { auth } = context
    if (!auth.isLoggedIn()) throw redirect({ to: '/login' })
  },
})
