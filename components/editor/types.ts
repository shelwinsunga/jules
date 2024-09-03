import type { editor, languages } from 'monaco-editor'
import * as monaco from 'monaco-editor'

export interface CodeEditorProps {
  onChange: (value: string) => void
  value: string
}

export interface ApplyEditProps {
  editor: Editor
  initialText: string
  range: Range
  diffText: string
}

export type Range = monaco.Range

export type Editor = editor.IStandaloneCodeEditor

export type StreamableValue = {}
