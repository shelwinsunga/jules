'use client'

import React, { useState, useEffect } from 'react'
import { CodeEditor } from './editor'
import { useFrontend } from '@/contexts/FrontendContext'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const EditorContainer = () => {
    const { latex, setLatex } = useFrontend()
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleCodeChange = (newCode: string) => {
        setLatex(newCode)
    }

    if (!mounted) return null

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
                key={theme || systemTheme} // Force re-render when theme changes
            />
        </div>
    )
}

export default EditorContainer
