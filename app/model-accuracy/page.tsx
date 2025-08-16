import { Suspense } from "react"
import { getModelMetrics } from "@/lib/actions"
import { ModelPerformance } from "@/components/model-performance"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart } from "lucide-react"

export const dynamic = "force-dynamic"

async function ModelMetricsContent() {
  const metrics = await getModelMetrics()

  return <ModelPerformance metrics={metrics} />
}

export default function ModelAccuracyPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Model Accuracy</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Performance metrics and analytics for our fraud detection models, including GNN and other algorithms
        </p>
      </div>

      <Suspense fallback={<ModelPerformanceSkeleton />}>
        <ModelMetricsContent />
      </Suspense>
    </div>
  )
}

function ModelPerformanceSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border">
        <div className="border-b p-6">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="mt-2 h-4 w-[350px]" />
        </div>
        <div className="p-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="border-b p-6">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="mt-2 h-4 w-[350px]" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 border-b pb-4">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 border-b pb-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end p-6">
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>
    </div>
  )
}

