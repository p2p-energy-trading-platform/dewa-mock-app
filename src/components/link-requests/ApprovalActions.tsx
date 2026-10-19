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
      <Button
        variant="outline"
        onClick={onReject}
        disabled={disabled}
        className="border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800"
      >
        <X />
        Reject
      </Button>
      <Button
        onClick={onApprove}
        disabled={disabled}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Check />
        Approve request
      </Button>
    </div>
  )
}
