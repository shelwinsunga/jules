'use client'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from '@/components/ui/button'
import * as monaco from 'monaco-editor'

export const createContentWidget = (
  editor: monaco.editor.IStandaloneCodeEditor,
  monacoInstance: typeof monaco,
  selection: monaco.Range,
  oldText: string,
  newText: string,
  currentLine: number,
  oldDecorations: string[]
) => {
  return {
    getDomNode: function () {
      const container = document.createElement('div')
      const model = editor.getModel()
      if (!model) return container // Return empty container if no model

      const handleReject = () => {
        editor.executeEdits('reject-changes', [
          {
            range: new monacoInstance.Range(
              selection.startLineNumber,
              1,
              currentLine - 1,
              model.getLineMaxColumn(currentLine - 1)
            ),
            text: oldText,
            forceMoveMarkers: true,
          },
        ])
        editor.deltaDecorations(oldDecorations, [])
        editor.removeContentWidget(this)
      }

      const handleApprove = () => {
        editor.executeEdits('approve-changes', [
          {
            range: new monacoInstance.Range(
              selection.startLineNumber,
              1,
              currentLine - 1,
              model.getLineMaxColumn(currentLine - 1)
            ),
            text: newText,
            forceMoveMarkers: true,
          },
        ])
        editor.deltaDecorations(oldDecorations, [])
        editor.removeContentWidget(this)
      }

      const WidgetContent = () => (
        <div className="w-full bg-background border border-border rounded-md p-2 shadow-sm flex gap-4">
          <Button variant="outline" size="sm" onClick={handleApprove}>
            Approve
          </Button>
          <Button variant="destructive" size="sm" className="mr-2" onClick={handleReject}>
            Reject
          </Button>
        </div>
      )

      const root = ReactDOM.createRoot(container)
      root.render(<WidgetContent />)
      return container
    },
    getId: function () {
      return 'diff-widget'
    },
    getPosition: function () {
      return {
        position: {
          lineNumber: currentLine,
          column: 1,
        },
        preference: [monacoInstance.editor.ContentWidgetPositionPreference.BELOW],
      }
    },
  }
}
