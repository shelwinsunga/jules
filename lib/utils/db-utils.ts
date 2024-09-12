'use client'
import { db } from '@/lib/constants'
import { createPreview } from '@/lib/utils/pdf-utils'
import { pdfjs } from 'react-pdf'

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

export async function savePdfToStorage(blob: Blob, pathname: string): Promise<void> {
  const pdfFile = new File([blob], 'main.pdf', { type: blob.type })
  await db.storage.upload(pathname, pdfFile)
}

export async function savePreviewToStorage(blob: Blob, pathname: string): Promise<void> {
  const pdfDocument = await pdfjs.getDocument({ data: await blob.arrayBuffer() }).promise
  const { previewFile } = await createPreview(pdfDocument, pathname)
  await db.storage.upload(pathname, previewFile)
}

export async function deleteFileFromStorage(pathname: string): Promise<void> {
  await db.storage.delete(pathname)
}
