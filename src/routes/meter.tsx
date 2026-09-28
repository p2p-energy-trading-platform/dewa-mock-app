import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/meter"!</div>
}
