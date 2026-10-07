import { createFileRoute, Link } from '@tanstack/react-router'
import { linkRequests } from '../data/linkRequests'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">DEWA Mock Customer Portal</h1>

        <p className="mt-2 text-gray-600">Smart Meter Connection Requests</p>

        <div className="mt-8 space-y-4">
          {linkRequests.map((request) => (
            <div
              key={request.requestId}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{request.requestId}</h2>

                  <p className="mt-2 text-gray-600">Meter: {request.meterId}</p>

                  <p className="text-gray-600">
                    Registration: {request.registrationId}
                  </p>

                  <p className="text-gray-600">Status: {request.status}</p>
                </div>

                <Link
                  to="/requests/$requestId"
                  params={{ requestId: request.requestId }}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
