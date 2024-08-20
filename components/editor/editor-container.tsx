'use client'

import React, { useState } from 'react'
import { CodeEditor } from './editor'
import { useFrontend } from '@/contexts/FrontendContext'

const EditorContainer = () => {
    const { latex, setLatex } = useFrontend()

    const handleCodeChange = (newCode: string) => {
        setLatex(newCode)
    }

    return (
            <CodeEditor
                onChange={handleCodeChange}
                value={latex}
            />
    )
}

export default EditorContainer
