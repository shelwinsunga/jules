'use client'
import '@ungap/with-resolvers';
import { PDFDocumentProxy } from 'pdfjs-dist'
import { RAILWAY_ENDPOINT_URL } from '@/lib/constants'  

export async function createPreview(
  pdfDocument: PDFDocumentProxy,
  pathname: string
): Promise<{ previewFile: File; previewPathname: string }> {
  const page = await pdfDocument.getPage(1)
  const viewport = page.getViewport({ scale: 1.0 })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.height = viewport.height
  canvas.width = viewport.width

  if (!context) {
    throw new Error('Failed to get canvas context')
  }

  await page.render({ canvasContext: context, viewport: viewport }).promise

  const previewBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to create blob'))
      },
      'image/webp',
      0.8
    )
  })

  const previewFile = new File([previewBlob], 'preview.webp', { type: 'image/webp' })
  const previewPathname = `${pathname}/preview.webp`

  return { previewFile, previewPathname }
}

interface EditorFiles {
  [key: string]: any;
}

export async function fetchPdf(files: EditorFiles) {
    const formData = new FormData();
    
    files.forEach((file: EditorFiles) => {
        if (file.type === 'file') {
            const extension = file.name.split('.').pop();
            const mimeType = extension === 'tex' ? 'text/plain' : 'application/octet-stream';
            const blob = new Blob([file.content], { type: mimeType });
            formData.append(file.name, blob);
        }
    });



    const response = await fetch('http://127.0.0.1:8000', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.error}: ${errorData.message}\n\nDetails: ${errorData.details}`);
    }
    
    return response.blob();
}