'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import { mergePDFsAndImages } from '@/lib/pdfUtils'

export default function PDFImageMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (uploadedFiles: File[]) => {
    const validFiles = uploadedFiles.filter(file => 
      file.type === 'application/pdf' || file.type.startsWith('image/')
    )
    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    try {
      const mergedPdf = await mergePDFsAndImages(files)
      const blob = new Blob([mergedPdf], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'merged_pdf_and_images.pdf'
      link.click()
    } catch (error) {
      console.error('Error merging PDFs and images:', error)
      alert('An error occurred while merging the files. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <FileUploader 
        onFileUpload={handleFileUpload} 
        acceptedFileTypes={{ 
          'application/pdf': ['.pdf'],
          'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        }} 
      />
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

