'use client'

import React, { useState } from 'react'
import { CodeEditor } from './editor'

const EditorContainer = () => {
    const [code, setCode] = useState('')

    const handleCodeChange = (newCode) => {
        setCode(newCode)
    }

    return (
            <CodeEditor
                onChange={handleCodeChange}
                value={code}
            />
    )
}

export default EditorContainer
