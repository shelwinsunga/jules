'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { CodeEditor } from './editor'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { db } from '@/lib/constants'
import { tx } from '@instantdb/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject } from '@/contexts/ProjectContext'
import { getFileExtension } from '@/lib/utils/client-utils';
import ImageViewer from './image-viewer'
import { MousePointer2 } from 'lucide-react'
import { Command } from 'lucide-react' // Add this import for the Command icon


const isMac = navigator.userAgent.includes('Macintosh');

const EditorContainer = () => {
  const { theme, systemTheme } = useTheme()
  const [localContent, setLocalContent] = useState('')
  const [openFile, setOpenFile] = useState<any>(null)
  const { currentlyOpen, isFilesLoading, isProjectLoading } = useProject();
  const [isStreaming,setIsStreaming] = useState(false);
  const isStreamingRef = useRef(false);
  const fileType = getFileExtension(currentlyOpen?.name || '');
  

  const isImageFile = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileType.toLowerCase());

  useEffect(() => {
    if (currentlyOpen && currentlyOpen.id !== openFile?.id) {
      setOpenFile(currentlyOpen)
      setLocalContent(currentlyOpen.content)
    }
  }, [currentlyOpen?.id])
  
  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (newCode !== localContent && !isStreamingRef.current) {
        setLocalContent(newCode);
        db.transact([tx.files[openFile.id].update({ content: newCode })]);
      }
    },
    [localContent, openFile]
  )

  const handleIsStreamingChange = useCallback((streaming: boolean) => {
    setIsStreaming(streaming);
    isStreamingRef.current = streaming;
  }, []);

  if (isProjectLoading || isFilesLoading) {
    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex justify-end items-center border-b shadow-sm p-2">
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="flex-grow" />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-end w-full items-center border-b shadow-sm p-2">
        <div className="flex items-center border space-x-2 px-3 h-9 rounded-md text-sm text-muted-foreground">
          <span>Select and</span>
          {isMac ? (
            <>
              <Command className="h-4 w-4" />
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-background/50 border rounded">K</kbd>
            </>
          ) : (
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-background border rounded">Ctrl+K</kbd>
          )}
          <span>for AI Autocomplete</span>
        </div>
      </div>
      {!currentlyOpen ? (
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          No file open
        </div>
      ) : isImageFile ? (
        <div className="flex-grow flex items-center justify-center bg-background">
          <div className="relative w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}>
            <ImageViewer
              src={currentlyOpen?.content || ''}
              alt={currentlyOpen?.name || 'Image'}
            />
          </div>
        </div>
      ) : (
        <CodeEditor onChange={handleCodeChange} setIsStreaming={handleIsStreamingChange} value={localContent} key={`${theme || systemTheme}-${openFile?.id}`} />
      )}
    </div>
  )
}

export default EditorContainer
