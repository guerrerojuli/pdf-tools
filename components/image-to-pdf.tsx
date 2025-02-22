'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { FileUploader } from '@/components/file-uploader'

import { convertImageToPDF } from '@/lib/pdfUtils'

export function ImageToPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, startProcessing] = useTransition()

  const handleFileUpload = (uploadedFiles: File[]) => {
    if (uploadedFiles.length > 0) {
      setFile(uploadedFiles[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleConvert = async () => {
    if (!file) return

    startProcessing(async () => {
      try {
        const pdfBuffer = await convertImageToPDF(file)
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${file.name.split('.')[0]}.pdf`
        link.click()
      } catch (error) {
        console.error('Error converting image to PDF:', error)
        alert('An error occurred while converting the image. Please try again.')
      }
    })
  }

  return (
    <div className="space-y-4">
      <FileUploader
        onFileUpload={handleFileUpload}
        acceptedFileTypes={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
      />
      {file && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">{file.name}</p>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Button
        onClick={handleConvert}
        disabled={!file || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Convert and Download'}
      </Button>
    </div>
  )
}

