'use client'
import { useRef } from 'react'
import { useEditorTheme } from './useEditorTheme'
import { editor, languages } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import latex from 'monaco-latex'
import { useLatexSyntaxHighlighting } from './useLatexSyntaxHighlighting'

export function useEditorSetup(onChange: (value: string) => void, value: string) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const { setTheme } = useEditorTheme()
  const { setupLatexSyntaxHighlighting } = useLatexSyntaxHighlighting()

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorRef.current = editor
    editor.getModel()?.updateOptions({ tabSize: 4, insertSpaces: true })
    monacoInstance.editor.setModelLanguage(editor.getModel()!, 'latex')
    editor.setScrollTop(1)
    editor.setPosition({ lineNumber: 2, column: 0 })
    editor.focus()

    setTheme(monacoInstance)

    setupLatexSyntaxHighlighting(monacoInstance)

    languages.register({ id: 'latex' });
    languages.setMonarchTokensProvider('latex', latex);
    monacoInstance.editor.setModelLanguage(editor.getModel()!, 'latex');

    editor.setValue(value)
  }

  return { editorRef, handleEditorDidMount }
}
