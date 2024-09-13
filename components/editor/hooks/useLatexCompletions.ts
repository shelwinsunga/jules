import * as monaco from 'monaco-editor'
import { latexSuggestions } from '../utils/latexSuggestions'

export function setupLatexCompletions(monacoInstance: typeof monaco) {
  monacoInstance.languages.registerCompletionItemProvider('latex', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = latexSuggestions.map(suggestion => ({
        label: suggestion.label,
        kind: monacoInstance.languages.CompletionItemKind.Function,
        insertText: suggestion.insertText,
        insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      }))


      return { suggestions }
    },
  })
}