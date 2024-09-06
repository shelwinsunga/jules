'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { CodeEditor } from './editor'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { db } from '@/lib/constants'
import { tx } from '@instantdb/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject } from '@/contexts/ProjectContext'

const EditorContainer = () => {
  const { theme, systemTheme } = useTheme()
  const [localContent, setLocalContent] = useState('')
  const [openFile, setOpenFile] = useState<any>(null)
  const { currentlyOpen, isFilesLoading, isProjectLoading } = useProject()
  const contentRef = useRef(localContent)

  useEffect(() => {
    if (currentlyOpen && currentlyOpen.content !== localContent) {
      setOpenFile(currentlyOpen)
      setLocalContent(currentlyOpen.content)
      contentRef.current = currentlyOpen.content
    }
  }, [currentlyOpen])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (openFile?.id && contentRef.current !== localContent) {
        db.transact([tx.files[openFile.id].update({ content: localContent })])
        contentRef.current = localContent
      }
    }, 500)

    return () => clearInterval(intervalId)
  }, [openFile, localContent])

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (newCode !== localContent) {
        setLocalContent(newCode)
      }
    },
    [localContent]
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
