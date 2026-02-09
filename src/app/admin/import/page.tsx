'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface ImportResult {
  row: number
  name: string
  status: 'valid' | 'invalid' | 'imported' | 'updated' | 'error'
  errors?: string[]
  data?: any
}

interface ImportResponse {
  mode: string
  totalRows: number
  valid: number
  invalid: number
  results: ImportResult[]
}

export default function ImportExportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewData, setPreviewData] = useState<ImportResponse | null>(null)
  const [importResult, setImportResult] = useState<ImportResponse | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile)
      setPreviewData(null)
      setImportResult(null)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewData(null)
      setImportResult(null)
    }
  }

  const handlePreview = async () => {
    if (!file) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', 'preview')

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Preview failed')

      const data = await response.json()
      setPreviewData(data)
    } catch (error) {
      console.error('Preview error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', 'import')

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Import failed')

      const data = await response.json()
      setImportResult(data)
      setPreviewData(null)
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/export')
      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `distributors-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    const template = `name,status,description,website_url,email,phone,address_line1,city,state_region,postal_code,country_hq,location_lat,location_lng,regions_served,languages_supported,products_supported,service_types,priority_rank,countries
Example Distributor,unpublished,A sample distributor,https://example.com,contact@example.com,+1-555-0100,123 Main St,New York,NY,10001,US,40.7128,-74.0060,"North America,Europe","English,Spanish","Classic+,Frontier","Clinic/Orthotic,Retail",100,"US,CA,MX"`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'distributor-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Import / Export</h1>
        <p className="text-gray-600 mt-1">
          Bulk manage distributors using CSV files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import section */}
        <Card>
          <CardHeader>
            <CardTitle>Import Distributors</CardTitle>
            <CardDescription>
              Upload a CSV file to add multiple distributors at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* File drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-turbo-blue bg-turbo-blue-pale'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop a CSV file here, or click to select
                </p>
                <p className="text-xs text-gray-400">Only .csv files are accepted</p>
              </label>
            </div>

            {/* Selected file */}
            {file && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null)
                    setPreviewData(null)
                    setImportResult(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="secondary"
                onClick={handlePreview}
                disabled={!file || isLoading}
                isLoading={isLoading && !previewData && !importResult}
              >
                Preview
              </Button>
              <Button
                onClick={handleImport}
                disabled={!previewData || previewData.valid === 0 || isLoading}
                isLoading={isLoading && !!previewData}
              >
                Import {previewData?.valid || 0} rows
              </Button>
            </div>

            {/* Template download */}
            <button
              onClick={handleDownloadTemplate}
              className="mt-4 text-sm text-turbo-blue hover:underline"
            >
              Download CSV template
            </button>
          </CardContent>
        </Card>

        {/* Export section */}
        <Card>
          <CardHeader>
            <CardTitle>Export Distributors</CardTitle>
            <CardDescription>
              Download all distributors as a CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Export all distributor data including country coverage, products supported,
              and contact information.
            </p>
            <Button onClick={handleExport} disabled={isLoading}>
              <Download className="w-4 h-4" />
              Export to CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview results */}
      {previewData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preview Results</CardTitle>
            <CardDescription>
              Review the data before importing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">{previewData.valid} valid</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm">{previewData.invalid} invalid</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2">Row</th>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Status</th>
                    <th className="text-left px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewData.results.map((result) => (
                    <tr key={result.row}>
                      <td className="px-4 py-2">{result.row}</td>
                      <td className="px-4 py-2 font-medium">{result.name}</td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={result.status === 'valid' ? 'success' : 'danger'}
                        >
                          {result.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {result.errors?.join(', ') || 'Ready to import'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import results */}
      {importResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Import Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">{importResult.valid} imported</span>
              </div>
              {importResult.invalid > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">{importResult.invalid} skipped</span>
                </div>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2">Row</th>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {importResult.results.map((result) => (
                    <tr key={result.row}>
                      <td className="px-4 py-2">{result.row}</td>
                      <td className="px-4 py-2 font-medium">{result.name}</td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            result.status === 'imported' || result.status === 'updated'
                              ? 'success'
                              : 'danger'
                          }
                        >
                          {result.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
