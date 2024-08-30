'use client'
import { db } from '@/lib/constants';
import { createPreview } from '@/lib/pdf-utils';
import { pdfjs } from 'react-pdf';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export async function savePdfToStorage(blob: Blob, id: string): Promise<void> {
    const pdfFile = new File([blob], "main.pdf", { type: blob.type });
    const pdfPathname = `${id}/main.pdf`;
    await db.storage.put(pdfPathname, pdfFile);
}

export async function savePreviewToStorage(blob: Blob, id: string): Promise<void> {
    const pdfDocument = await pdfjs.getDocument({ data: await blob.arrayBuffer() }).promise;
    const { previewFile, previewPathname } = await createPreview(pdfDocument, id);
    await db.storage.put(previewPathname, previewFile);
}
