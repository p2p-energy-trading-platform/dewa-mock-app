import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  CircleX,
  ClipboardList,
  FileSearch2,
  Gauge,
  Search,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { RequestDialog } from '../components/link-requests/RequestDialog'
import { LinkRequestStatus } from '../components/link-requests/LinkRequestStatus'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { linkRequests as mockLinkRequests } from '../data/linkRequests'
import type {
  LinkRequest,
  LinkRequestStatus as RequestStatus,
} from '../types/dewa'

export const Route = createFileRoute('/')({
  ssr: false,
  component: Home,
})

function Home() {
  const [requests, setRequests] = useState<LinkRequest[]>(() =>
    mockLinkRequests.map((request) => ({ ...request })),
  )
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | RequestStatus>('ALL')

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === 'ALL' || request.status === statusFilter
      const matchesSearch =
        !normalizedSearch ||
        [
          request.requestId,
          request.registrationId,
          request.meterId,
          request.userReference,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [requests, search, statusFilter])

  const pendingCount = requests.filter(
    (request) => request.status === 'PENDING',
  ).length
  const approvedCount = requests.filter(
    (request) => request.status === 'APPROVED',
  ).length
  const rejectedCount = requests.filter(
    (request) => request.status === 'REJECTED',
  ).length
  const selectedRequest =
    requests.find((request) => request.requestId === selectedRequestId) ?? null

  function updateRequestStatus(requestId: string, status: RequestStatus) {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.requestId === requestId ? { ...request, status } : request,
      ),
    )
  }

  const summaryItems = [
    {
      label: 'Pending review',
      value: pendingCount,
      detail: 'Awaiting your decision',
      icon: ClipboardList,
      iconClass: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Approved',
      value: approvedCount,
      detail: 'Linked successfully',
      icon: CheckCircle2,
      iconClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Rejected',
      value: rejectedCount,
      detail: 'Not linked',
      icon: CircleX,
      iconClass: 'bg-rose-50 text-rose-700',
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-card">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap className="size-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                DEWA Connect
              </p>
              <p className="text-xs text-muted-foreground">
                Smart meter registration
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="gap-2 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Demo workspace
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Utility services&nbsp; / &nbsp;Requests
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-[2.15rem]">
              Connection requests
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Review customer smart meter link requests and confirm the account
              details before approving.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="size-5" />
            </span>
            <div>
              <p className="text-xl leading-6 font-semibold tabular-nums">
                {pendingCount}
              </p>
              <p className="text-xs text-muted-foreground">Need review</p>
            </div>
          </div>
        </div>

        <section
          aria-label="Request summary"
          className="mt-7 grid gap-4 sm:grid-cols-3"
        >
          {summaryItems.map((item) => {
            const Icon = item.icon

            return (
              <Card
                key={item.label}
                className="gap-0 rounded-xl py-0 shadow-sm"
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <p className="text-2xl leading-none font-semibold tabular-nums">
                        {item.value}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="mt-8" aria-labelledby="request-list-heading">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2
                id="request-list-heading"
                className="text-lg font-semibold tracking-tight"
              >
                All requests
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Search the queue or filter by request status.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filteredRequests.length}
              </span>{' '}
              of {requests.length} requests
            </p>
          </div>

          <Card className="mt-4 gap-0 overflow-hidden rounded-xl py-0 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search requests"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search request, meter, registration or account"
                  className="h-10 border-border bg-background pl-9 shadow-none focus-visible:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as typeof statusFilter)
                  }
                >
                  <SelectTrigger
                    aria-label="Filter by status"
                    className="h-10 w-full min-w-40 bg-background sm:w-44"
                  >
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {(search || statusFilter !== 'ALL') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('ALL')
                    }}
                    className="shrink-0 text-primary hover:text-primary"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-11 pl-5 text-xs font-semibold text-muted-foreground">
                      Request
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                      Meter ID
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                      Account reference
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                      Received
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="h-11 pr-5 text-right text-xs font-semibold text-muted-foreground">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.requestId} className="group">
                      <TableCell className="py-4 pl-5">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Gauge className="size-4" />
                          </span>
                          <div>
                            <p className="font-medium text-foreground">
                              {request.requestId}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {request.registrationId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {request.meterId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.userReference}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatReceivedDate(request.createdAt)}
                      </TableCell>
                      <TableCell>
                        <LinkRequestStatus status={request.status} />
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedRequestId(request.requestId)
                          }
                          aria-label={`${request.status === 'PENDING' ? 'Review' : 'View'} ${request.requestId}`}
                          className="gap-1.5 border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                        >
                          {request.status === 'PENDING' ? 'Review' : 'View'}
                          <ArrowUpRight />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <FileSearch2 className="size-5" />
                </span>
                <p className="mt-4 font-medium">No matching requests</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try another search term or choose a different status filter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('ALL')
                  }}
                  className="mt-4"
                >
                  Show all requests
                </Button>
              </div>
            )}
          </Card>
        </section>
      </div>

      <RequestDialog
        request={selectedRequest}
        open={selectedRequest !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRequestId(null)
        }}
        onDecision={updateRequestStatus}
      />
    </main>
  )
}

function formatReceivedDate(createdAt?: string) {
  if (!createdAt) return '—'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(createdAt))
}
