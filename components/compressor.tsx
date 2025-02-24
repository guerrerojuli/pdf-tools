'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { FileUploader } from '@/components/file-uploader'

import { compressPdf } from '@/lib/pdfUtils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function Compressor() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState<number>(0.7)
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
        const pdfBuffer = await compressPdf(file, quality)
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
        const link = document.createElement('a')

        link.href = URL.createObjectURL(blob)
        link.download = `${file.name.split('.')[0]}-compressed.pdf`
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
        acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
      />
      {file && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">{file.name}</p>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <Button
          onClick={handleConvert}
          disabled={!file || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Compress and Download'}
        </Button>

        <Select
          value={quality.toString()}
          onValueChange={(value) => setQuality(parseFloat(value))}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Compression level" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              <SelectItem value="0.1">Extreme</SelectItem>
              <SelectItem value="0.5">High</SelectItem>
              <SelectItem value="0.7">Medium</SelectItem>
              <SelectItem value="0.9">Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

