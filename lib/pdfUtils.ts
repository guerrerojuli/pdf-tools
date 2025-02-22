import { PDFDocument } from 'pdf-lib'

export async function convertImageToPDF(imageFile: File): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const imageBytes = await imageFile.arrayBuffer()

  let image
  if (imageFile.type === 'image/jpeg') {
    image = await pdfDoc.embedJpg(imageBytes)
  } else if (imageFile.type === 'image/png') {
    image = await pdfDoc.embedPng(imageBytes)
  } else {
    throw new Error('Unsupported image format')
  }

  const page = pdfDoc.addPage()
  const { width, height } = image.scale(1)
  page.setSize(width, height)
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  })

  return pdfDoc.save()
}

export async function mergeToPDF(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    if (file.type === 'application/pdf') {
      const pdfBytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(pdfBytes)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    } else if (file.type.startsWith('image/')) {
      const imageBytes = await file.arrayBuffer()
      let image
      if (file.type === 'image/jpeg') {
        image = await mergedPdf.embedJpg(imageBytes)
      } else if (file.type === 'image/png') {
        image = await mergedPdf.embedPng(imageBytes)
      } else {
        throw new Error('Unsupported image format')
      }
      const page = mergedPdf.addPage()
      const { width, height } = image.scale(1)
      page.setSize(width, height)
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      })
    }
  }

  return mergedPdf.save()
}

