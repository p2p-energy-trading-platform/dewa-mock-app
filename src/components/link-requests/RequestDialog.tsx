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
import type { LinkRequest, LinkRequestStatus } from '#/types/dewa'
import { ApprovalActions } from './ApprovalActions'
import { RequestMetadata } from './RequestMetadata'
import { LinkRequestStatus as StatusBadge } from './LinkRequestStatus'

export function RequestDialog({
  request,
  open,
  onOpenChange,
  onDecision,
}: {
  request: LinkRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDecision: (requestId: string, status: LinkRequestStatus) => void
}) {
  if (!request) {
    return null
  }

  const isPending = request.status === 'PENDING'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <div className="bg-muted/50 px-6 py-6 sm:px-7">
          <DialogHeader>
            <div className="mb-3 flex items-center justify-between pr-8">
              <StatusBadge status={request.status} />
              <span className="text-xs font-medium text-muted-foreground">
                {request.requestId}
              </span>
            </div>
            <DialogTitle className="text-xl text-foreground">
              Review connection request
            </DialogTitle>
            <DialogDescription className="mt-1">
              Confirm the meter and account details before making a decision.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-7">
          <RequestMetadata request={request} />
          <div className="flex gap-3 rounded-lg border border-primary/15 bg-primary/5 p-3 text-sm text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Approving links this meter to the account shown above. This is a
              demonstration workflow.
            </p>
          </div>
          {!isPending && (
            <div
              role="status"
              className={`flex items-center gap-2 text-sm font-medium ${
                request.status === 'APPROVED'
                  ? 'text-emerald-700'
                  : 'text-rose-700'
              }`}
            >
              {request.status === 'APPROVED' ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
              This request has been {request.status.toLowerCase()}.
            </div>
          )}
        </div>

        <Separator />
        <DialogFooter className="gap-3 px-6 py-4 sm:justify-between sm:px-7">
          <p className="self-center text-xs text-muted-foreground">
            DEWA Connect · Mock workspace
          </p>
          <ApprovalActions
            onApprove={() => onDecision(request.requestId, 'APPROVED')}
            onReject={() => onDecision(request.requestId, 'REJECTED')}
            disabled={!isPending}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
