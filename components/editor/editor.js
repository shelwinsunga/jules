// Import necessary dependencies
'use client'
import Editor from '@monaco-editor/react'
import { useRef } from 'react'

const initialContent = `\\documentclass{article}
\\begin{document}
Hello, world! This is a simple LaTeX document.

\\section{A Section}
This is a section in our document.

\\subsection{A Subsection}
This is a subsection with some math: $E = mc^2$
\\end{document}`

// Function to set custom theme for the editor
function setTheme(monaco) {
    monaco.editor.defineTheme('myTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {

        },
    })
    monaco.editor.setTheme('myTheme')
}

// Main CodeEditor component
export const CodeEditor = ({ onChange, value }) => {
    const editorRef = useRef()

    // Default options for the editor
    const editorDefaultOptions = {
        wordWrap: 'on',
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        minimap: { enabled: false },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
            vertical: 'hidden'
        },
        overviewRulerBorder: false,
    }

    // Handles editor initialization
    const onEditorDidMount = (editor, monaco) => {
        editorRef.current = editor
        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue())
        })
        editor.getModel().updateOptions({
            tabSize: 4,
            insertSpaces: true,
        })
        editor.setScrollTop(1)
        editor.setPosition({
            lineNumber: 2,
            column: 0,
        })
        editor.focus()

        setTheme(monaco)

        // Initialize with the LaTeX content
        editor.setValue(initialContent)
    }

    // Render the Editor component
    return (
            <Editor
                theme="vs-dark"
                language="latex"
                height="100%"
                width="100%"
                value={value}
                onMount={onEditorDidMount}
                options={editorDefaultOptions}
            />
    )
}

export default CodeEditor