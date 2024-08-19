// Import necessary dependencies
'use client'
import Editor from '@monaco-editor/react'
import { useRef } from 'react'

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
    }

    // Render the Editor component
    return (
            <Editor
                theme="vs-dark"
                language="python"
                height="100%"
                width="100%"
                value={value}
                onMount={onEditorDidMount}
                options={editorDefaultOptions}
            />
    )
}

export default CodeEditor