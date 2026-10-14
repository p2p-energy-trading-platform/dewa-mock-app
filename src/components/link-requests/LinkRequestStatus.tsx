import { Badge } from '#/components/ui/badge'
import type { LinkRequestStatus as RequestStatus } from '#/types/dewa'

const statusStyles: Record<RequestStatus, string> = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
}

export function LinkRequestStatus({ status }: { status: RequestStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  )
}
