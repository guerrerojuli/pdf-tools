'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { FileUploader } from '@/components/file-uploader'  

import { mergeToPDF } from '@/lib/pdfUtils'

export function Merger() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, startProcessing] = useTransition()

  const handleFileUpload = (uploadedFiles: File[]) => {
    const validFiles = uploadedFiles.filter(file =>
      file.type === 'application/pdf' || file.type.startsWith('image/')
    )
    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleMerge = () => {
    if (files.length === 0) return

    startProcessing(async () => {
      try {
        const mergedPdf = await mergeToPDF(files)
        const blob = new Blob([mergedPdf as BlobPart], { type: 'application/pdf' })
        const link = document.createElement('a')

        link.href = URL.createObjectURL(blob)
        link.download = 'merged.pdf'
        link.click()
      } catch (error) {
        console.error('Error merging PDFs and images:', error)
        alert('An error occurred while merging the files. Please try again.')
      }
    })
  }

  return (
    <div className="space-y-4">
      <FileUploader
        onFileUpload={handleFileUpload}
        acceptedFileTypes={{
          'application/pdf': ['.pdf'],
          'image/*': ['.png', '.jpg', '.jpeg']
        }}
      />
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">{file.name}</p>
          <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        onClick={handleMerge}
        disabled={files.length === 0 || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Merge and Download'}
      </Button>
    </div>
  )
}

