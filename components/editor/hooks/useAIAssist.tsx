'use client'
import { useState } from 'react'
import { generate } from '@/app/actions'
import { readStreamableValue } from 'ai/rsc'
import { calculateDiff } from '../utils/calculateDiff'
import { createContentWidget } from '../utils/WidgetCreator'
import { promptModal } from '../utils/promptModal'
import { applyEdit } from '../utils/applyEdit'
import * as monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'

export const useAIAssist = () => {
  const handleAIAssist = (editor: editor.IStandaloneCodeEditor, monacoInstance: typeof monaco, setIsStreaming: (isStreaming: boolean) => void) => {
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK, async () => {
      const selection = editor.getSelection()
      const model = editor.getModel()
      if (!model || !selection) return
      const initialText = model.getValue()
      const range = new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      )

      const oldText = model.getValueInRange(range)
      const context = `Replace lines ${selection.startLineNumber}-${selection.endLineNumber}:\n${oldText}`

      const userInput = await promptModal(editor, monacoInstance, selection)

      const { output } = await generate(
        `File content:\n${initialText}\n\nContext: ${context}\n\nUser input: ${userInput}`
      )

      let newText = ''
      let oldDecorations: string[] = []
      let currentLine = selection.startLineNumber
      let buffer = ''
      setIsStreaming(true)


      for await (const delta of readStreamableValue(output)) {
        if (!delta) continue
        buffer += delta.content
        if (buffer.endsWith('\n') || buffer.length > 0) {
          newText += buffer
          const {
            diffText,
            decorations,
            currentLine: updatedLine,
          } = calculateDiff(oldText, newText, monacoInstance, selection)
          currentLine = updatedLine
          await applyEdit(editor, initialText, range, diffText)
          oldDecorations = editor.deltaDecorations(oldDecorations, decorations)
          buffer = ''
        }
      }

      setIsStreaming(false)
      
      const contentWidget = createContentWidget(
        editor,
        monacoInstance,
        selection,
        oldText,
        newText,
        currentLine,
        oldDecorations
      )
      editor.addContentWidget(contentWidget)
    })
  }

  return { handleAIAssist }
}
