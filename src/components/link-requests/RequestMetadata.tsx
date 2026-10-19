import { cn } from '#/lib/utils'
import type { LinkRequest } from '#/types/dewa'

const requestFields = [
  { key: 'meterId', label: 'Meter ID' },
  { key: 'registrationId', label: 'Registration ID' },
  { key: 'userReference', label: 'Account reference' },
] as const

export function RequestMetadata({
  request,
  className,
}: {
  request: LinkRequest
  className?: string
}) {
  return (
    <dl className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3', className)}>
      {requestFields.map(({ key, label }) => (
        <div key={key} className="min-w-0">
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-1 truncate text-sm font-semibold text-foreground">
            {request[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
