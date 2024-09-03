'use client'
import { editor, Range } from 'monaco-editor'

export const applyEdit = async (
  editor: editor.IStandaloneCodeEditor,
  initialText: string,
  range: Range,
  diffText: string
) => {
  const model = editor.getModel()
  if (!model) return
  model.setValue(initialText)
  model.pushEditOperations(
    [],
    [
      {
        range: range,
        text: diffText,
      },
    ],
    () => null
  )
}
