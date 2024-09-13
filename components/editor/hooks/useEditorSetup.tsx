'use client'
import { useRef } from 'react'
import { useEditorTheme } from './useEditorTheme'
import { useLatexSyntaxHighlighting } from './useLatexSyntaxHighlighting'
import { editor, languages } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { setupLatexCompletions } from './useLatexCompletions'

export function useEditorSetup(onChange: (value: string) => void, value: string) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const { setTheme } = useEditorTheme()
  const { setupLatexSyntaxHighlighting } = useLatexSyntaxHighlighting()

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorRef.current = editor
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue())
    })
    editor.getModel()?.updateOptions({ tabSize: 4, insertSpaces: true })
    monacoInstance.editor.setModelLanguage(editor.getModel()!, 'latex') // Add this line
    editor.setScrollTop(1)
    editor.setPosition({ lineNumber: 2, column: 0 })
    editor.focus()

    setTheme(monacoInstance)
    setupLatexSyntaxHighlighting(monacoInstance)
    setupLatexCompletions(monacoInstance) 
    editor.setValue(value)
  }

  return { editorRef, handleEditorDidMount }
}
