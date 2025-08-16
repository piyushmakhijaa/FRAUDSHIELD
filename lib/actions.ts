"use server"

import { revalidatePath } from "next/cache"

export type TransactionData = {
  fromAccount: string
  toAccount: string
  paymentType: string
  currency: string
  amount: number
  timestamp: string
}

export type TransactionResult = {
  isEthical: boolean
  confidence: number
  reason?: string
  alertId?: string
}

export type Alert = {
  id: string
  transactionId: string
  fromAccount: string
  toAccount: string
  amount: number
  currency: string
  timestamp: string
  status: "pending" | "under_review" | "resolved" | "escalated"
  reason: string
  invoiceId?: string
}

export type ModelMetrics = {
  model: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
}

// Mock data for alerts
const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    transactionId: "tx-001",
    fromAccount: "1234567890",
    toAccount: "0987654321",
    amount: 15000,
    currency: "USD",
    timestamp: "2023-03-15T10:30:00Z",
    status: "pending",
    reason: "Unusual transaction pattern detected",
  },
  {
    id: "alert-002",
    transactionId: "tx-002",
    fromAccount: "2345678901",
    toAccount: "1098765432",
    amount: 25000,
    currency: "EUR",
    timestamp: "2023-03-16T14:45:00Z",
    status: "under_review",
    reason: "Multiple high-value transactions in short period",
    invoiceId: "inv-002",
  },
  {
    id: "alert-003",
    transactionId: "tx-003",
    fromAccount: "3456789012",
    toAccount: "2109876543",
    amount: 9500,
    currency: "USD",
    timestamp: "2023-03-17T09:15:00Z",
    status: "pending",
    reason: "Transaction with high-risk jurisdiction",
  },
  {
    id: "alert-004",
    transactionId: "tx-004",
    fromAccount: "4567890123",
    toAccount: "3210987654",
    amount: 12000,
    currency: "GBP",
    timestamp: "2023-03-18T16:20:00Z",
    status: "pending",
    reason: "Forged invoice detected",
    invoiceId: "inv-004",
  },
  {
    id: "alert-005",
    transactionId: "tx-005",
    fromAccount: "5678901234",
    toAccount: "4321098765",
    amount: 30000,
    currency: "USD",
    timestamp: "2023-03-19T11:10:00Z",
    status: "escalated",
    reason: "Structured transactions to avoid reporting",
  },
]

// Mock model metrics data
const mockModelMetrics: ModelMetrics[] = [
  {
    model: "Graph Neural Network (GNN)",
    accuracy: 0.94,
    precision: 0.92,
    recall: 0.89,
    f1Score: 0.9,
  },
  {
    model: "Random Forest",
    accuracy: 0.87,
    precision: 0.85,
    recall: 0.82,
    f1Score: 0.83,
  },
  {
    model: "Logistic Regression",
    accuracy: 0.78,
    precision: 0.76,
    recall: 0.75,
    f1Score: 0.75,
  },
  {
    model: "Neural Network",
    accuracy: 0.89,
    precision: 0.88,
    recall: 0.86,
    f1Score: 0.87,
  },
]

export async function checkTransaction(formData: FormData): Promise<TransactionResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const fromAccount = formData.get("fromAccount") as string
  const toAccount = formData.get("toAccount") as string
  const paymentType = formData.get("paymentType") as string
  const currency = formData.get("currency") as string
  const amount = Number.parseFloat(formData.get("amount") as string)

  // Simple mock logic for demonstration
  const isEthical = !(amount > 10000 || fromAccount.startsWith("999") || toAccount.startsWith("888"))

  return {
    isEthical,
    confidence: isEthical ? 0.95 : 0.87,
    reason: isEthical ? undefined : "High-value transaction with suspicious pattern",
    alertId: isEthical ? undefined : `alert-${Math.floor(Math.random() * 1000)}`,
  }
}

export async function uploadInvoice(formData: FormData) {
  const response = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData
  })

  if (!response.ok) throw new Error("Upload failed")

  const data = await response.json()
  return {
    isGenuine: data.isGenuine,
    confidence: data.confidence,
    invoiceId: data.invoiceId
  }
}


export async function getAlerts(): Promise<Alert[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return mockAlerts
}

export async function updateAlertStatus(alertId: string, status: Alert["status"]) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would update the database
  console.log(`Alert ${alertId} status updated to ${status}`)

  revalidatePath("/pending-alerts")
  return { success: true }
}

export async function getModelMetrics(): Promise<ModelMetrics[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return mockModelMetrics
}

export async function retrainModel(): Promise<{ success: boolean; message: string }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return {
    success: true,
    message: "Model retraining initiated successfully. This process may take several hours to complete.",
  }
}

