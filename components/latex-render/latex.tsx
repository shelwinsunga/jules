'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import LatexError from './latex-error'
import { Label } from '@/components/ui/label'
import { ZoomIn, ZoomOut, RotateCcw, Download, Loader2 } from 'lucide-react'
import { savePdfToStorage, savePreviewToStorage } from '@/lib/utils/db-utils'
import { useProject } from '@/contexts/ProjectContext'
import { createPathname } from '@/lib/utils/client-utils'
import { useFrontend } from '@/contexts/FrontendContext'
import { fetchPdf } from '@/lib/utils/pdf-utils'
import LatexLoading from './latex-loading'
import LatexCanvas from './latex-canvas'
import { updateProject } from '@/hooks/data'
import { useDebounce } from 'use-debounce'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

function LatexRenderer() {
  const { user } = useFrontend()
  const { project: data, isLoading: isDataLoading, projectId, currentlyOpen, files } = useProject()
  const scale = data?.projectScale ?? 0.9
  const autoFetch = data?.isAutoFetching ?? false
  const latex = currentlyOpen?.content

  const [numPages, setNumPages] = useState<number>(0)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDocumentReady, setIsDocumentReady] = useState(false)
  const [debouncedLatex] = useDebounce(latex, 1000)
  const [isAutoCompiling, setIsAutoCompiling] = useState(false)

  // Memoize dependencies to stabilize handlePdf
  const handlePdf = useCallback(async (isAuto: boolean = false) => {
    if (isDataLoading || !user) return
    setIsLoading(true)
    if (isAuto) setIsAutoCompiling(true)
    setError(null)
    setIsDocumentReady(false)

    try {
      const blob = await fetchPdf(files)
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
      if (isAuto) setIsAutoCompiling(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoading, user, files, projectId])

  // Handle manual PDF generation
  const handleManualPdf = useCallback(() => {
    handlePdf(false)
  }, [handlePdf])

  // Handle auto compilation
  useEffect(() => {
    if (autoFetch && debouncedLatex && debouncedLatex.trim() !== '') {
      handlePdf(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLatex, autoFetch])

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
    const newScale = Math.min(scale + 0.1, 2.0)
    updateProject(projectId, { projectScale: newScale })
  }

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.5)
    updateProject(projectId, { projectScale: newScale })
  }

  const handleResetZoom = () => {
    updateProject(projectId, { projectScale: 0.9 })
  }

  const handleDownload = () => {
    if (pdfUrl) {
      fetch(pdfUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${data?.title || 'document'}.pdf`
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        })
        .catch(error => console.error('Error downloading PDF:', error))
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
          <Button variant="outline" onClick={handleManualPdf} disabled={isLoading}>
            {isLoading || isAutoCompiling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate PDF'
            )}
          </Button>
          <Switch
            checked={autoFetch}
            onCheckedChange={(checked) =>
              updateProject(projectId, { isAutoFetching: checked })
            }
          />
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
          <Button size="sm" onClick={handleDownload} disabled={!pdfUrl}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isLoading || isAutoCompiling ? (
        <div className="flex justify-center items-center w-full h-full">
          <LatexLoading  />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <LatexError error={error} />
          <Button variant="secondary" onClick={() => handlePdf(true)}>
            Retry
          </Button>
        </div>
      ) : pdfUrl ? (
        <LatexCanvas
          pdfUrl={pdfUrl}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          options={options}
          isDocumentReady={isDocumentReady}
          numPages={numPages}
          scale={scale}
        />
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <span>No PDF generated yet.</span>
        </div>
      )}
    </div>
  )
}

export default LatexRenderer