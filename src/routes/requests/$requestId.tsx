import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/requests/$requestId')({
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})
