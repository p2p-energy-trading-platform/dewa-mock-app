import { useEffect, useState } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Separator } from '#/components/ui/separator'
import { approveLinkRequest, rejectLinkRequest } from '#/services/dewaApi'
import type { LinkRequest, LinkRequestStatus } from '#/types/dewa'
import { ApprovalActions } from './ApprovalActions'
import { LinkRequestStatus as StatusBadge } from './LinkRequestStatus'

export function RequestDialog({
  request,
  open,
  onOpenChange,
  onStatusChange,
}: {
  request: LinkRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (request: LinkRequest) => void
}) {
  const [status, setStatus] = useState<LinkRequestStatus>(
    request?.status ?? 'PENDING',
  )

  useEffect(() => {
    setStatus(request?.status ?? 'PENDING')
  }, [request])

  if (!request) {
    return null
  }

  const handleDecision = (decision: 'approve' | 'reject') => {
    const updatedRequest =
      decision === 'approve'
        ? approveLinkRequest(request.requestId)
        : rejectLinkRequest(request.requestId)

    if (updatedRequest) {
      setStatus(updatedRequest.status)
      onStatusChange(updatedRequest)
    }
  }

  const isPending = status === 'PENDING'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="bg-slate-50 px-6 py-6">
          <DialogHeader>
            <div className="mb-3 flex items-center justify-between pr-8">
              <p className="font-mono text-xs font-medium text-slate-500">
                {request.requestId}
              </p>
              <StatusBadge status={status} />
            </div>
            <DialogTitle className="text-xl text-slate-950">
              Review connection request
            </DialogTitle>
            <DialogDescription className="mt-1">
              Verify the meter details before approving this smart meter link.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Detail label="Registration ID" value={request.registrationId} />
            <Detail label="Meter ID" value={request.meterId} />
            <Detail label="User reference" value={request.userReference} />
            <Detail label="Request type" value="Smart meter link" />
          </div>
          <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>Approving links this meter to the requesting user account.</p>
          </div>
          {!isPending && (
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                status === 'APPROVED' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {status === 'APPROVED' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
              This request has been {status.toLowerCase()}.
            </div>
          )}
        </div>
        <Separator />
        <DialogFooter className="px-6 py-4 sm:justify-between">
          <p className="self-center text-xs text-slate-400">
            DEWA mock workflow
          </p>
          <ApprovalActions
            onApprove={() => handleDecision('approve')}
            onReject={() => handleDecision('reject')}
            disabled={!isPending}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
