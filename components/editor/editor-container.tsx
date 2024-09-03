'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { CodeEditor } from './editor'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { db } from '@/lib/constants'
import { tx } from '@instantdb/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { useProject } from '@/contexts/ProjectContext'

const EditorContainer = () => {
  const { theme, systemTheme } = useTheme()
  const [localContent, setLocalContent] = useState('')
  const [openFile, setOpenFile] = useState<any>(null)
  const { currentlyOpen, isFilesLoading, isProjectLoading } = useProject()
  const [isLLMStreaming, setIsLLMStreaming] = useState(false)
  
  useEffect(() => {
    console.log('isLLMStreaming:', isLLMStreaming)
  }, [isLLMStreaming])

  useEffect(() => {
    console.log('useEffect for currentlyOpen rerendered')
    if (currentlyOpen && currentlyOpen.content !== localContent) {
      setOpenFile(currentlyOpen)
      setLocalContent(currentlyOpen.content)
    }
  }, [currentlyOpen])

  const updateDb = useCallback((newCode: string, prevOpenFile: any) => {
    console.log('updateDb called')
    if (prevOpenFile?.id) {
      db.transact([tx.files[prevOpenFile.id].update({ content: newCode })])
    }
  }, [])

  const debouncedUpdateDb = useDebounce(updateDb, 250)

  const handleCodeChange = useCallback(
    (newCode: string) => {
      console.log('handleCodeChange called')
      if (newCode !== localContent) {
        setLocalContent(newCode)
        
        if (isLLMStreaming) {
          // Use debounce for LLM streaming
          debouncedUpdateDb(newCode, openFile)
        } else {
          // For regular typing, update immediately without delay
          updateDb(newCode, openFile)
        }
      }
    },
    [debouncedUpdateDb, updateDb, openFile, localContent, isLLMStreaming]
  )

  if (isProjectLoading || isFilesLoading) {
    console.log('Rendering loading state')
    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex justify-end items-center border-b shadow-sm p-2">
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="flex-grow" />
      </div>
    )
  }

  console.log('Rendering main editor')
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-end items-center border-b shadow-sm p-2">
        <Button variant="outline">Assist</Button>
      </div>
      <CodeEditor 
        onChange={handleCodeChange} 
        value={localContent} 
        key={`${theme || systemTheme}-${openFile?.id}`}
        setIsLLMStreaming={setIsLLMStreaming}
      />
    </div>
  )
}

export default EditorContainer
