import { Check, X } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function ApprovalActions({
  onApprove,
  onReject,
  disabled = false,
}: {
  onApprove: () => void
  onReject: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row">
      <Button variant="outline" onClick={onReject} disabled={disabled}>
        <X />
        Reject
      </Button>
      <Button
        onClick={onApprove}
        disabled={disabled}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        <Check />
        Approve request
      </Button>
    </div>
  )
}
