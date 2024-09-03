'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { CodeEditor } from './editor'
import { useFrontend } from '@/contexts/FrontendContext'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { db } from '@/lib/constants'
import { useParams } from 'next/navigation'
import { tx } from '@instantdb/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { useProject } from '@/contexts/ProjectContext'

const EditorContainer = () => {
  const { theme, systemTheme } = useTheme()
  const [localContent, setLocalContent] = useState('')
  const [openFile, setOpenFile] = useState<any>(null)
  const { currentlyOpen, isFilesLoading, isProjectLoading } = useProject()

  useEffect(() => {
    if (currentlyOpen && currentlyOpen.content !== localContent) {
      setOpenFile(currentlyOpen)
      setLocalContent(currentlyOpen.content)
    }
  }, [currentlyOpen])

  const debouncedUpdateDb = useDebounce((newCode: string, prevOpenFile: any) => {
    if (prevOpenFile?.id) {
      db.transact([tx.files[prevOpenFile.id].update({ content: newCode })])
    }
  }, 250)

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (newCode !== localContent) {
        setLocalContent(newCode)
        debouncedUpdateDb(newCode, openFile)
      }
    },
    [debouncedUpdateDb, openFile, localContent]
  )

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
      <div className="flex justify-end items-center border-b shadow-sm p-2">
        <Button variant="outline">Assist</Button>
      </div>
      <CodeEditor onChange={handleCodeChange} value={localContent} key={`${theme || systemTheme}-${openFile?.id}`} />
    </div>
  )
}

export default EditorContainer
