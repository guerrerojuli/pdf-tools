'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PDFMerger from './components/PDFMerger'
import ImageToPDF from './components/ImageToPDF'
import PDFImageMerger from './components/PDFImageMerger'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-4xl font-bold mb-8">PDF Tools</h1>
      <Tabs defaultValue="merge-pdf" className="w-full max-w-3xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="merge-pdf">Merge PDFs</TabsTrigger>
          <TabsTrigger value="image-to-pdf">Image to PDF</TabsTrigger>
          <TabsTrigger value="pdf-image-merge">PDF & Image Merge</TabsTrigger>
        </TabsList>
        <TabsContent value="merge-pdf">
          <PDFMerger />
        </TabsContent>
        <TabsContent value="image-to-pdf">
          <ImageToPDF />
        </TabsContent>
        <TabsContent value="pdf-image-merge">
          <PDFImageMerger />
        </TabsContent>
      </Tabs>
    </main>
  )
}

