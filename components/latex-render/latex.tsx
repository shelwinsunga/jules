'use client'
import { useEffect, useMemo } from 'react'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
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
import LatexCanvas from './latex-canvas'
import { updateProject } from '@/hooks/data'
import { usePdfViewer } from './pdf-viewer-reducer'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

function LatexRenderer() {
  const { user } = useFrontend();
  const { project: data, isLoading: isDataLoading, projectId, currentlyOpen, files } = useProject();
  const scale = data?.projectScale ?? 0.9;
  const autoFetch = data?.isAutoFetching ?? false;
  const latex = currentlyOpen?.content

  const [state, dispatch] = usePdfViewer();
  const { isLoading, error, isDocumentReady, pdfUrl, numPages } = state;

  // Add cleanup effect for PDF URLs
  useEffect(() => {
    return () => {
      if (state.pdfUrl) {
        URL.revokeObjectURL(state.pdfUrl)
        dispatch({ type: 'CLEANUP_URL', url: state.pdfUrl })
      }
    }
  }, [state.pdfUrl])

  useEffect(() => {
    if (!isDataLoading && data?.cachedPdfUrl) {
      dispatch({ type: 'SET_PDF_URL', url: data.cachedPdfUrl })
    }
  }, [isDataLoading, data])

  const handlePdf = async () => {
    if (isDataLoading || !user) return
    dispatch({ type: 'START_LOADING' })
    try {
      const blob = await fetchPdf(files);
      const pathname = createPathname(user.id, projectId)
      await savePdfToStorage(blob, pathname + 'main.pdf', projectId)
      await savePreviewToStorage(blob, pathname + 'preview.webp', projectId)
      const url = URL.createObjectURL(blob)
      dispatch({ type: 'SET_PDF_URL', url })
    } catch (error) {
      console.error('Error fetching PDF:', error)
      dispatch({
        type: 'SET_ERROR',
        error: error instanceof Error ? error.message : String(error)
      })
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
    dispatch({ type: 'SET_DOCUMENT_READY', numPages })
  }

  // Options for PDF.js rendering
  // cMapUrl: URL for character map (cMap) files
  // cMapPacked: Use packed character maps for better performance
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
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${data?.title || 'document'}.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading PDF:', error));
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
          <Switch checked={autoFetch} onCheckedChange={(checked) => updateProject(projectId, { isAutoFetching: checked })} />
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
      {state.isLoading ? (
        <LatexLoading />
      ) : state.error ? (
        <div className="flex justify-center items-start w-full h-full">
          <LatexError error={state.error} />
        </div>
      ) : state.pdfUrl ? (
        <LatexCanvas
          pdfUrl={state.pdfUrl}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          options={options}
          isDocumentReady={state.isDocumentReady}
          numPages={state.numPages}
          scale={scale}
        />
      ) : null}
    </div>
  )
}

export default LatexRenderer
