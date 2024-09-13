'use client'
import { db } from '@/lib/constants'
import { createPreview } from '@/lib/utils/pdf-utils'
import { pdfjs } from 'react-pdf'
import { tx } from '@instantdb/react'

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

export async function savePdfToStorage(blob: Blob, pathname: string, projectId: string): Promise<void> {
  
  const pdfFile = new File([blob], 'main.pdf', { type: blob.type })
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
  await db.storage.upload(pathname, pdfFile)
  const downloadURL = await db.storage.getDownloadUrl(pathname)
  db.transact([
    tx.projects[projectId].update({
      cachedPdfUrl: downloadURL,
      cachedPdfExpiresAt: expiresAt,
      last_compiled: new Date().toISOString()
    })
  ])
}

export async function savePreviewToStorage(blob: Blob, pathname: string, projectId: string): Promise<void> {
  const pdfDocument = await pdfjs.getDocument({ data: await blob.arrayBuffer() }).promise
  const { previewFile } = await createPreview(pdfDocument, pathname)
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
  await db.storage.upload(pathname, previewFile)
  const downloadURL = await db.storage.getDownloadUrl(pathname)
  db.transact([
    tx.projects[projectId].update({
      cachedPreviewUrl: downloadURL,
      cachedPreviewExpiresAt: expiresAt
    })
  ])
}

export async function deleteFileFromStorage(pathname: string): Promise<void> {
  await db.storage.delete(pathname)
}
