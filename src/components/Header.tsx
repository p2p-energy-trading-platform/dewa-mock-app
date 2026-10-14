import { ClipboardList, Zap } from 'lucide-react'

export function Header({ pendingCount }: { pendingCount: number }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Zap className="size-5 fill-current" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950">
              DEWA Connect
            </p>
            <p className="text-xs text-slate-500">Smart meter registration</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
          <ClipboardList className="size-3.5" />
          {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'}
        </div>
      </div>
    </header>
  )
}
