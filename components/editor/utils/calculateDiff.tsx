'use client'
import * as monaco from 'monaco-editor'

export const calculateDiff = (
  oldText: string,
  newText: string,
  monacoInstance: typeof monaco,
  selection: monaco.Selection
) => {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')

  let diffText = ''
  let decorations: monaco.editor.IModelDeltaDecoration[] = []
  let currentLine = selection.startLineNumber

  const diff = []
  let oldIndex = 0
  let newIndex = 0

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex < oldLines.length && newIndex < newLines.length && oldLines[oldIndex] === newLines[newIndex]) {
      diff.push({ value: oldLines[oldIndex] })
      oldIndex++
      newIndex++
    } else if (oldIndex < oldLines.length) {
      diff.push({ removed: true, value: oldLines[oldIndex] })
      oldIndex++
    } else if (newIndex < newLines.length) {
      diff.push({ added: true, value: newLines[newIndex] })
      newIndex++
    }
  }

  diff.forEach((part) => {
    if (part.removed) {
      diffText += part.value + '\n'
      decorations.push({
        range: new monacoInstance.Range(currentLine, 1, currentLine, 1),
        options: { isWholeLine: true, className: 'diff-old-content' },
      })
      currentLine++
    } else if (part.added) {
      diffText += part.value + '\n'
      decorations.push({
        range: new monacoInstance.Range(currentLine, 1, currentLine, 1),
        options: { isWholeLine: true, className: 'diff-new-content' },
      })
      currentLine++
    } else {
      diffText += part.value + '\n'
      currentLine++
    }
  })

  // Remove trailing newline if it wasn't in the original text
  if (!oldText.endsWith('\n') && !newText.endsWith('\n')) {
    diffText = diffText.slice(0, -1)
  }

  return { diffText, decorations, currentLine }
}
