"use client"

import { AlertTriangle, CheckCircle, Clock, Eye, Search } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Alert, updateAlertStatus } from "@/lib/actions"

interface PendingAlertsListProps {
  alerts: Alert[]
}

export function PendingAlertsList({ alerts }: PendingAlertsListProps) {
  const [alertList, setAlertList] = useState(alerts);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredAlerts = alertList.filter((alert) => {
    const matchesSearch =
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.toAccount.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || alert.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert)
  }

  const handleUpdateStatus = async (alertId: string, newStatus: Alert["status"]) => {
    setIsUpdating(true);
    try {
      await updateAlertStatus(alertId, newStatus);
      
      // Update state properly
      setAlertList((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, status: newStatus } : alert
        )
      );
  
      // Also update the selected alert if it's open
      setSelectedAlert((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Error updating alert status:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  

  const getStatusBadge = (status: Alert["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Under Review
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Resolved
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Escalated
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Alert ID</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No alerts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{alert.transactionId}</span>
                      <span className="text-xs text-muted-foreground">
                        {alert.fromAccount.substring(0, 4)}...→{alert.toAccount.substring(0, 4)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alert.amount.toLocaleString()} {alert.currency}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(alert)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        {selectedAlert && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Alert Details</DialogTitle>
              <DialogDescription>Review the details of this alert and update its status.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Alert ID:</span>
                <span className="col-span-3">{selectedAlert.id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Transaction:</span>
                <span className="col-span-3">{selectedAlert.transactionId}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">From Account:</span>
                <span className="col-span-3">{selectedAlert.fromAccount}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">To Account:</span>
                <span className="col-span-3">{selectedAlert.toAccount}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Amount:</span>
                <span className="col-span-3">
                  {selectedAlert.amount.toLocaleString()} {selectedAlert.currency}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Date:</span>
                <span className="col-span-3">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">{getStatusBadge(selectedAlert.status)}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Reason:</span>
                <span className="col-span-3">{selectedAlert.reason}</span>
              </div>
              {selectedAlert.invoiceId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Invoice ID:</span>
                  <span className="col-span-3">{selectedAlert.invoiceId}</span>
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 sm:justify-center">

              {selectedAlert.status !== "resolved" && (
                <Button
                  onClick={() => handleUpdateStatus(selectedAlert.id, "resolved")}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolve
                </Button>
              )}
              {selectedAlert.status !== "under_review" && selectedAlert.status !== "resolved" && (
                <Button
                  onClick={() => handleUpdateStatus(selectedAlert.id, "under_review")}
                  disabled={isUpdating}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Review
                </Button>
              )}
              {selectedAlert.status !== "escalated" && selectedAlert.status !== "resolved" && (
                <Button
                  onClick={() => handleUpdateStatus(selectedAlert.id, "escalated")}
                  disabled={isUpdating}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Escalate
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

