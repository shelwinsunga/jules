'use client'

import React, { useState } from 'react'
import { CodeEditor } from './editor'
import { useFrontend } from '@/contexts/FrontendContext'
import { Button } from '@/components/ui/button'
const EditorContainer = () => {
    const { latex, setLatex } = useFrontend()

    const handleCodeChange = (newCode: string) => {
        setLatex(newCode)
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
            />
        </div>
    )
}

export default EditorContainer
