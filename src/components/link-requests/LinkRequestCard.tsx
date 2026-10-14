import { ArrowUpRight, Gauge, Hash, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { LinkRequestStatus } from './LinkRequestStatus'
import type { LinkRequest } from '#/types/dewa'

export function LinkRequestCard({
  request,
  onView,
}: {
  request: LinkRequest
  onView: (request: LinkRequest) => void
}) {
  return (
    <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {request.requestId}
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-950">
            Smart meter connection
          </h2>
        </div>
        <LinkRequestStatus status={request.status} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
          <DetailItem
            icon={<Gauge />}
            label="Meter ID"
            value={request.meterId}
          />
          <DetailItem
            icon={<Hash />}
            label="Registration"
            value={request.registrationId}
          />
          <DetailItem
            icon={<UserRound />}
            label="User reference"
            value={request.userReference}
          />
        </div>
        <Button
          variant="outline"
          className="mt-5 w-full justify-between border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => onView(request)}
        >
          View request
          <ArrowUpRight />
        </Button>
      </CardContent>
    </Card>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}
