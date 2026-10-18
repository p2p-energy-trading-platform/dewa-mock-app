import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ApprovalActions } from '../../components/link-requests/ApprovalActions'
import { LinkRequestStatus } from '../../components/link-requests/LinkRequestStatus'
import {
  approveLinkRequest,
  getLinkRequest,
  linkRequestQueryKey,
  linkRequestsQueryKey,
  rejectLinkRequest,
} from '../../services/dewaApi'
import type { LinkRequestStatusResponse } from '../../services/dewaApi'
import type { LinkRequest } from '../../types/dewa'

export const Route = createFileRoute('/requests/$requestId')({
  ssr: false,
  component: RequestDetails,
})

function RequestDetails() {
  const { requestId } = Route.useParams()
  const queryClient = useQueryClient()
  const requestQuery = useQuery({
    queryKey: linkRequestQueryKey(requestId),
    queryFn: ({ signal }) => getLinkRequest(requestId, signal),
  })
  const decisionMutation = useMutation({
    mutationFn: (decision: 'approve' | 'reject') =>
      decision === 'approve'
        ? approveLinkRequest(requestId)
        : rejectLinkRequest(requestId),
    onSuccess: async (result) => {
      queryClient.setQueryData<LinkRequestStatusResponse>(
        linkRequestQueryKey(requestId),
        (request) =>
          request ? { ...request, status: result.status } : request,
      )
      queryClient.setQueryData<LinkRequest[]>(
        linkRequestsQueryKey,
        (requests) =>
          requests?.map((request) =>
            request.requestId === requestId
              ? { ...request, status: result.status }
              : request,
          ),
      )
      await queryClient.invalidateQueries({ queryKey: linkRequestsQueryKey })
    },
  })

  if (requestQuery.isLoading) {
    return <p className="p-8 text-slate-500">Loading request…</p>
  }

  if (requestQuery.isError) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p role="alert" className="mx-auto max-w-3xl text-rose-700">
          {requestQuery.error instanceof Error
            ? requestQuery.error.message
            : 'Could not load this request.'}
        </p>
      </main>
    )
  }

  const request = requestQuery.data

  if (!request) {
    return <p className="p-8">Request not found</p>
  }

  const isPending = request.status === 'PENDING'

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">DEWA Mock Customer Portal</h1>
        <p className="mt-2 text-gray-600">Smart Meter Connection Request</p>

        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Request Details</h2>
            <LinkRequestStatus status={request.status} />
          </div>

          <div className="mt-6 space-y-3">
            <p>
              <strong>Request ID:</strong> {requestId}
            </p>
            <p>
              <strong>Registration ID:</strong> {request.registrationId}
            </p>
            <p>
              <strong>Meter ID:</strong> {request.meterId}
            </p>
          </div>

          {decisionMutation.isError && (
            <p role="alert" className="mt-5 text-sm font-medium text-rose-700">
              {decisionMutation.error instanceof Error
                ? decisionMutation.error.message
                : 'Could not update this request. Please try again.'}
            </p>
          )}

          {!isPending && (
            <p className="mt-5 text-sm font-medium text-slate-600">
              This request has been {request.status.toLowerCase()}.
            </p>
          )}

          <div className="mt-6">
            <ApprovalActions
              onApprove={() => decisionMutation.mutate('approve')}
              onReject={() => decisionMutation.mutate('reject')}
              disabled={!isPending || decisionMutation.isPending}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
