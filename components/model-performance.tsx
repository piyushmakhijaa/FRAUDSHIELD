"use client"

import { BarChartIcon, PieChartIcon, RefreshCw, TrendingUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { type ModelMetrics, retrainModel } from "@/lib/actions"

interface ModelPerformanceProps {
  metrics: ModelMetrics[]
}

// Generate time series data for the last 30 days
const generateTimeSeriesData = () => {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate random values with an upward trend
    const baseAccuracy = 0.75 + (0.2 * (30 - i)) / 30 // Trend from 0.75 to 0.95
    const noise = Math.random() * 0.05 - 0.025 // Random noise between -0.025 and 0.025

    data.push({
      date: date.toISOString().split("T")[0],
      accuracy: Math.min(0.98, Math.max(0.7, baseAccuracy + noise)),
      detectionRate: Math.min(0.95, Math.max(0.65, baseAccuracy - 0.05 + noise)),
    })
  }

  return data
}

// Generate real-time detection data
const generateRealTimeData = () => {
  const data = []
  const now = new Date()

  for (let i = 59; i >= 0; i--) {
    const time = new Date(now)
    time.setMinutes(time.getMinutes() - i)

    // Generate random values with occasional spikes
    const baseValue = 5 + Math.random() * 3
    const spike = Math.random() > 0.9 ? Math.random() * 15 : 0

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      detections: Math.round(baseValue + spike),
    })
  }

  return data
}

// Generate model comparison data for pie chart
const generateModelUsageData = () => {
  return [
    { name: "GNN", value: 65 },
    { name: "Random Forest", value: 15 },
    { name: "Neural Network", value: 12 },
    { name: "Logistic Regression", value: 8 },
  ]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function ModelPerformance({ metrics }: ModelPerformanceProps) {
  const [isRetraining, setIsRetraining] = useState(false)
  const [activeTab, setActiveTab] = useState("bar")
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData())
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData())
  const [modelUsageData, setModelUsageData] = useState(generateModelUsageData())
  const realTimeInterval = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Simulate real-time data updates
  useEffect(() => {
    realTimeInterval.current = setInterval(() => {
      setRealTimeData((prev) => {
        const newData = [...prev]
        newData.shift()

        const lastTime = new Date()
        const baseValue = 5 + Math.random() * 3
        const spike = Math.random() > 0.9 ? Math.random() * 15 : 0

        newData.push({
          time: lastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          detections: Math.round(baseValue + spike),
        })

        return newData
      })
    }, 5000)

    return () => {
      if (realTimeInterval.current) {
        clearInterval(realTimeInterval.current)
      }
    }
  }, [])

  const handleRetrainModel = async () => {
    setIsRetraining(true)
    try {
      const result = await retrainModel()
      toast({
        title: "Model Retraining",
        description: result.message,
        duration: 5000,
      })
    } catch (error) {
      console.error("Error retraining model:", error)
      toast({
        title: "Error",
        description: "Failed to initiate model retraining. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsRetraining(false)
    }
  }

  // Prepare data for the bar chart
  const chartData = metrics.map((metric) => ({
    model: metric.model.replace("Graph Neural Network", "GNN").replace("Neural Network", "NN"),
    accuracy: Number.parseFloat((metric.accuracy * 100).toFixed(1)),
    precision: Number.parseFloat((metric.precision * 100).toFixed(1)),
    recall: Number.parseFloat((metric.recall * 100).toFixed(1)),
    f1Score: Number.parseFloat((metric.f1Score * 100).toFixed(1)),
  }))

  return (
    <div className="space-y-8">
      <Tabs defaultValue="bar" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="bar" className="flex items-center">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Model Comparison
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance Trend
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Model Usage
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Accuracy Comparison</CardTitle>
              <CardDescription>Performance metrics for different fraud detection models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300 px]">
                <ChartContainer
                  config={{
                    accuracy: {
                      label: "Accuracy",
                      color: "hsl(var(--chart-1))",
                    },
                    precision: {
                      label: "Precision",
                      color: "hsl(var(--chart-2))",
                    },
                    recall: {
                      label: "Recall",
                      color: "hsl(var(--chart-3))",
                    },
                    f1Score: {
                      label: "F1 Score",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="model" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="accuracy"
                        fill="var(--color-accuracy)"
                        name="Accuracy"
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                      <Bar
                        dataKey="precision"
                        fill="var(--color-precision)"
                        name="Precision"
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                        animationBegin={300}
                      />
                      <Bar
                        dataKey="recall"
                        fill="var(--color-recall)"
                        name="Recall"
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                        animationBegin={600}
                      />
                      <Bar
                        dataKey="f1Score"
                        fill="var(--color-f1Score)"
                        name="F1 Score"
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                        animationBegin={900}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend (Last 30 Days)</CardTitle>
              <CardDescription>Tracking model accuracy and detection rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300 px]">
                <ChartContainer
                  config={{
                    accuracy: {
                      label: "Accuracy",
                      color: "hsl(var(--chart-1))",
                    },
                    detectionRate: {
                      label: "Detection Rate",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeSeriesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis domain={[0.6, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="accuracy"
                        stroke="var(--color-accuracy)"
                        fill="var(--color-accuracy)"
                        fillOpacity={0.3}
                        name="Accuracy"
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      />
                      <Area
                        type="monotone"
                        dataKey="detectionRate"
                        stroke="var(--color-detectionRate)"
                        fill="var(--color-detectionRate)"
                        fillOpacity={0.3}
                        name="Detection Rate"
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                        animationBegin={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Fraud Detections</CardTitle>
              <CardDescription>Live monitoring of fraud detection events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={realTimeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="detections"
                      stroke="#ff4d4f"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Fraud Detections"
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Usage Distribution</CardTitle>
              <CardDescription>Percentage of transactions processed by each model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    >
                      {modelUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Model Metrics</CardTitle>
          <CardDescription>Comprehensive performance metrics for each model</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
                <TableHead className="text-right">Precision</TableHead>
                <TableHead className="text-right">Recall</TableHead>
                <TableHead className="text-right">F1 Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.model}>
                  <TableCell className="font-medium">{metric.model}</TableCell>
                  <TableCell className="text-right">{(metric.accuracy * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{(metric.precision * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{(metric.recall * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{(metric.f1Score * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRetrainModel} disabled={isRetraining} className="ml-auto">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRetraining ? "animate-spin" : ""}`} />
            {isRetraining ? "Initiating Retraining..." : "Retrain Model"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

