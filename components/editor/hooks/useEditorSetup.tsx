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
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue())
    })
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

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      const selection = editor.getSelection()
      if (selection) {
        const model = editor.getModel()
        if (model) {
          const startLineNumber = selection.startLineNumber
          const endLineNumber = selection.endLineNumber
          const operations = []

          for (let i = startLineNumber; i <= endLineNumber; i++) {
            const lineContent = model.getLineContent(i)
            if (lineContent.startsWith('%')) {
              operations.push({
                range: new monaco.Range(i, 1, i, 2),
                text: '',
              })
            } else {
              operations.push({
                range: new monaco.Range(i, 1, i, 1),
                text: '%',
              })
            }
          }

          model.pushEditOperations([], operations, () => null)
        }
      }
    })
  }

  return { editorRef, handleEditorDidMount }
}
