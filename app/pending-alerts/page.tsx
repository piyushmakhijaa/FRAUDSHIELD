import { Suspense } from "react"
import { getAlerts } from "@/lib/actions"
import { PendingAlertsList } from "@/components/pending-alerts-list"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"

export const dynamic = "force-dynamic"

async function AlertsContent() {
  const alerts = await getAlerts()

  return <PendingAlertsList alerts={alerts} />
}

export default function PendingAlertsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h1 className="text-4xl font-bold tracking-tight">Pending Alerts</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Review and manage transactions flagged for potential money laundering or document forgery
        </p>
      </div>

      <Suspense fallback={<AlertsListSkeleton />}>
        <AlertsContent />
      </Suspense>
    </div>
  )
}

function AlertsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-[180px]" />
      </div>

      <div className="rounded-md border">
        <div className="h-10 border-b bg-muted/50 px-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 border-b p-4">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="hidden h-6 w-[100px] md:block" />
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

