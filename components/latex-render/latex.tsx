'use client'
import { useState, useEffect, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import LatexError from './latex-error'
import { Label } from '@/components/ui/label'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { savePdfToStorage, savePreviewToStorage } from '@/lib/utils/db-utils'
import { Download } from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import { createPathname } from '@/lib/utils/client-utils'
import { useFrontend } from '@/contexts/FrontendContext'
import { fetchPdf } from '@/lib/utils/pdf-utils'
import { Loader2 } from 'lucide-react'
import LatexLoading from './latex-loading'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

function LatexRenderer() {
  const { user } = useFrontend();
  const { project: data, isLoading: isDataLoading, projectId, currentlyOpen, files } = useProject();

  const latex = currentlyOpen?.content

  const [numPages, setNumPages] = useState<number>(0)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoFetch, setAutoFetch] = useState(false)
  const [isDocumentReady, setIsDocumentReady] = useState(false)
  const [scale, setScale] = useState(0.9)

  useEffect(() => {
    if (!isDataLoading && data?.cachedPdfUrl) {
      setPdfUrl(data.cachedPdfUrl)
    }
  }, [isDataLoading, data])

  const handlePdf = async () => {
    if (isDataLoading || !user) return
    setIsLoading(true)
    setError(null)
    setIsDocumentReady(false)
    try {
      const blob = await fetchPdf(files);
      const pathname = createPathname(user.id, projectId)
      await savePdfToStorage(blob, pathname + 'main.pdf', projectId)
      await savePreviewToStorage(blob, pathname + 'preview.webp', projectId)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (error) {
      console.error('Error fetching PDF:', error)
      setError(error instanceof Error ? error.message : String(error))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (autoFetch && latex && latex.trim() !== '') {
          handlePdf()
        }
      }, 1000)
    }

    resetTimer()

    return () => clearTimeout(debounceTimer)
  }, [latex, autoFetch, isDataLoading, user])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsDocumentReady(true)
  }

  const options = useMemo(
    () => ({
      cMapUrl: 'cmaps/',
      cMapPacked: true,
    }),
    []
  )

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0))
  }

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5))
  }

  const handleResetZoom = () => {
    setScale(0.9)
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${data?.title || 'document'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <LatexLoading />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center border-b shadow-sm p-2 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePdf} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate PDF'
            )}
          </Button>
          <Switch checked={autoFetch} onCheckedChange={setAutoFetch} />
          <Label htmlFor="auto-fetch">Auto Compile</Label>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow w-full h-full bg-foreground/5">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <LatexLoading />
          </div>
        ) : error ? (
          <LatexError error={error} />
        ) : pdfUrl ? (
          <div className="flex justify-center w-full">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center w-full max-w-4xl"
              loading={<Skeleton className="w-full h-full max-w-4xl" />}
              options={options}
            >
              {isDocumentReady &&
                Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    className="mb-4 shadow-lg"
                    scale={scale}
                    width={Math.min(window.innerWidth - 80, 800)}
                    loading={<Skeleton className="w-full h-[calc(100vh-80px)] mb-4" />}
                  />
                ))}
            </Document>
          </div>
        ) : (
          null
        )}
      </ScrollArea>
    </div>
  )
}

export default LatexRenderer