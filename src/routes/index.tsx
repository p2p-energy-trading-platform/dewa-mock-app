import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { LinkRequestCard } from '../components/link-requests/LinkRequestCard'
import { RequestDialog } from '../components/link-requests/RequestDialog'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { linkRequests } from '../data/linkRequests'
import type { LinkRequest, LinkRequestStatus } from '../types/dewa'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [requests, setRequests] = useState(linkRequests)
  const [selectedRequest, setSelectedRequest] = useState<LinkRequest | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | LinkRequestStatus>(
    'ALL',
  )

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header pendingCount={pendingCount} />
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">Customer portal</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Connection requests
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Review incoming smart meter link requests and approve them when
              the details match.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="w-fit bg-white text-slate-600 shadow-sm"
          >
            {requests.length} total{' '}
            {requests.length === 1 ? 'request' : 'requests'}
          </Badge>
        </div>

        <div className="mt-9 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by request, meter, or registration ID"
              className="border-0 pl-9 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
            <SlidersHorizontal className="size-4 text-slate-400" />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as typeof statusFilter)
              }
            >
              <SelectTrigger className="w-[150px] border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {filteredRequests.length}
            </span>{' '}
            {filteredRequests.length === 1 ? 'request' : 'requests'}
          </p>
          {(search || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('ALL')
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </Button>
          )}
        </div>

        {filteredRequests.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {filteredRequests.map((request) => (
              <LinkRequestCard
                key={request.requestId}
                request={request}
                onView={setSelectedRequest}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="font-medium text-slate-700">No matching requests</p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        )}
        <RequestDialog
          request={selectedRequest}
          open={selectedRequest !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedRequest(null)
          }}
          onStatusChange={(updatedRequest) => {
            setRequests((currentRequests) =>
              currentRequests.map((request) =>
                request.requestId === updatedRequest.requestId
                  ? { ...updatedRequest }
                  : request,
              ),
            )
          }}
        />
      </div>
    </main>
  )
}
