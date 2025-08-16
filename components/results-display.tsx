"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TransactionResult } from "@/lib/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ResultsDisplayProps {
  transactionResult?: TransactionResult
  invoiceResult?: {
    isGenuine: boolean
    confidence: number
    invoiceId: string
  }
}

export function ResultsDisplay({ transactionResult, invoiceResult }: ResultsDisplayProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [alertSent, setAlertSent] = useState(false)

  if (!transactionResult && !invoiceResult) {
    return null
  }

  const showAlert = (transactionResult && !transactionResult.isEthical) || (invoiceResult && !invoiceResult.isGenuine)

  const handleSendAlert = () => {
    setAlertDialogOpen(false)
    setAlertSent(true)
    // In a real app, this would send an alert to authorities
  }

  return (
    <>
      <Card className={showAlert ? "border-destructive" : "border-green-500"}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${
                showAlert ? "bg-destructive/10" : "bg-green-500/10"
              }`}
            >
              {showAlert ? (
                <AlertTriangle className="w-6 h-6 text-destructive" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            <div className="text-center">
              <h3 className={`text-xl font-bold ${showAlert ? "text-destructive" : "text-green-500"}`}>
                {showAlert ? "Fraud/Laundering Detected" : "Payment is Ethical"}
              </h3>

              {transactionResult && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Transaction Analysis</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Confidence:</span>
                      <span>{(transactionResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={transactionResult.confidence * 100}
                      className={`h-2 w-full ${transactionResult.isEthical ? "bg-green-200" : "bg-red-200"}`}
                    />
                  </div>
                  {transactionResult.reason && (
                    <p className="text-sm text-muted-foreground mt-2">Reason: {transactionResult.reason}</p>
                  )}
                </div>
              )}

              {invoiceResult && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Invoice Analysis</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Document is {invoiceResult.isGenuine ? "Genuine" : "Forged"}</span>
                      <span>{(invoiceResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={invoiceResult.confidence * 100}
                      className={`h-2 w-full ${invoiceResult.isGenuine ? "bg-green-200" : "bg-red-200"}`}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Invoice ID: {invoiceResult.invoiceId}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {showAlert && (
          <CardFooter>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setAlertDialogOpen(true)}
              disabled={alertSent}
            >
              <Bell className="mr-2 h-4 w-4" />
              {alertSent ? "Alert Sent to Authorities" : "Send Alert to Authorities"}
            </Button>
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Alert to Authorities</AlertDialogTitle>
            <AlertDialogDescription>
              This will notify relevant authorities about this suspicious transaction. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendAlert}>Send Alert</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

