"use client"

import { useState } from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { TransactionForm } from "@/components/transaction-form"
import { InvoiceUpload } from "@/components/invoice-upload"
import { ResultsDisplay } from "@/components/results-display"
import type { TransactionResult } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [transactionResult, setTransactionResult] = useState<TransactionResult | undefined>()
  const [invoiceResult, setInvoiceResult] = useState<
    | {
        isGenuine: boolean
        confidence: number
        invoiceId: string
      }
    | undefined
  >()

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">FraudShield</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-powered system for detecting money laundering and document forgery with high accuracy
        </p>
      </div>

      {(transactionResult && !transactionResult.isEthical) || (invoiceResult && !invoiceResult.isGenuine) ? (
        <div className="mb-8 p-4 border border-destructive rounded-lg bg-destructive/10 flex items-center gap-3 max-w-3xl mx-auto">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">
            <strong>Alert:</strong> Potential fraud detected. Please review the details below and take appropriate
            action.
          </p>
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
              <TransactionForm onResult={setTransactionResult} />
            </CardContent>
          </Card>

          <InvoiceUpload onResult={setInvoiceResult} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          {!transactionResult && !invoiceResult ? (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Shield className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No Results Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter transaction details or upload an invoice to see analysis results.
                </p>
              </div>
            </div>
          ) : (
            <ResultsDisplay transactionResult={transactionResult} invoiceResult={invoiceResult} />
          )}
        </div>
      </div>
    </div>
  )
}

