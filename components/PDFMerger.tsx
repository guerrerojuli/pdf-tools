'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import { mergePDFs } from '@/lib/pdfUtils'

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (uploadedFiles: File[]) => {
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf')
    setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    try {
      const pdfBuffers = await Promise.all(files.map(file => file.arrayBuffer()))
      const mergedPdf = await mergePDFs(pdfBuffers)
      const blob = new Blob([mergedPdf], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'merged.pdf'
      link.click()
    } catch (error) {
      console.error('Error merging PDFs:', error)
      alert('An error occurred while merging the PDFs. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <FileUploader onFileUpload={handleFileUpload} acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} />
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <p className="text-sm text-gray-600">{file.name}</p>
            <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button 
        onClick={handleMerge} 
        disabled={files.length === 0 || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Merge and Download'}
      </Button>
    </div>
  )
}

