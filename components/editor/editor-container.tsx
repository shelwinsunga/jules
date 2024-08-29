'use client'

import React from 'react'
import { CodeEditor } from './editor'
import { useFrontend } from '@/contexts/FrontendContext'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { db } from '@/lib/constants'
import { useParams } from 'next/navigation'
import { tx } from '@instantdb/react'
import { Skeleton } from '@/components/ui/skeleton'

const EditorContainer = () => {
    const { latex, setLatex, isLoading } = useFrontend()
    const { theme, systemTheme } = useTheme()
    const { id } = useParams<{ id: string }>();

    const handleCodeChange = (newCode: string) => {
        setLatex(newCode);
        db.transact([tx.projects[id].update({ project_content: newCode })])
    }

    if (isLoading) {
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
                <Button variant="outline">
                    Assist
                </Button>
            </div>
            <CodeEditor
                onChange={handleCodeChange}
                value={latex}
                key={theme || systemTheme}
            />
        </div>
    )
}

export default EditorContainer
