"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadInvoice } from "@/lib/actions"

export function InvoiceUpload({
  onResult,
}: {
  onResult: (result: { isGenuine: boolean; confidence: number; invoiceId: string }) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("invoice", file)

      const result = await uploadInvoice(formData)

      // Set to 100% when complete
      setUploadProgress(100)
      setTimeout(() => {
        onResult(result)
        setFile(null)
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (error) {
      console.error("Error uploading invoice:", error)
      setIsUploading(false)
    } finally {
      clearInterval(progressInterval)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">Upload Invoice</h3>
            <p className="text-sm text-muted-foreground">Upload an invoice to check for forgery</p>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="invoice-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <div className="flex items-center space-x-2">
                      <FileCheck className="w-8 h-8 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, PNG, JPG or TIFF (MAX. 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="invoice-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.tiff"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {isUploading && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-xs text-center text-muted-foreground">
                {uploadProgress < 100 ? "Uploading and analyzing invoice..." : "Analysis complete!"}
              </p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? "Processing..." : "Analyze Invoice"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

