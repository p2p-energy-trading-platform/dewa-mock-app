import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { linkRequests } from '../data/linkRequests'
import { approveLinkRequest, rejectLinkRequest } from '../services/dewaApi'
import type { LinkRequestStatus } from '../types/dewa'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  const request = linkRequests[0]

  const [status, setStatus] = useState<LinkRequestStatus>(request.status)

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          DEWA Mock Customer Portal
        </h1>

        <p className="mt-2 text-gray-600">
          Smart Meter Connection Requests
        </p>

        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Smart Meter Connection Request
          </h2>

          <div className="mt-6 space-y-3">
            <p>
              <strong>Request ID:</strong> {request.requestId}
            </p>

            <p>
              <strong>Meter:</strong> {request.meterId}
            </p>

            <p>
              <strong>Registration:</strong> {request.registrationId}
            </p>

            <p>
              <strong>Requested by:</strong> {request.userReference}
            </p>

            <p>
              <strong>Status:</strong> {status}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {

                const updatedRequest = approveLinkRequest(request.requestId)

                if(updatedRequest) {
                  setStatus(updatedRequest.status)
                }

              }}
              className="rounded-md bg-green-600 px-4 py-2 text-white"
            >
              Approve
            </button>

            <button
              onClick={() => {

                const updatedRequest = rejectLinkRequest(request.requestId)

                if(updatedRequest) {
                  setStatus(updatedRequest.status)
                }

              }}
              className="rounded-md bg-red-600 px-4 py-2 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}