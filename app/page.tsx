import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Merger }from '@/components/merger'
import { ImageToPDF } from '@/components/image-to-pdf'

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-4xl font-bold mb-8">PDF Tools</h1>
      <Tabs defaultValue="merge" className="w-full max-w-3xl">
        <TabsList className="flex-col md:grid md:grid-cols-2 w-full h-full">
          <TabsTrigger className="w-full" value="merge">Merge to PDF</TabsTrigger>
          <TabsTrigger className="w-full" value="image-to-pdf">Image to PDF</TabsTrigger>
        </TabsList>
        <TabsContent value="merge">
          <Merger />
        </TabsContent>
        <TabsContent value="image-to-pdf">
          <ImageToPDF />
        </TabsContent>
      </Tabs>
    </main>
  )
}
