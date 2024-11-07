import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import * as monaco from 'monaco-editor'

export const promptModal = async (
  editor: monaco.editor.IStandaloneCodeEditor,
  monacoInstance: typeof monaco,
  selection: monaco.Range
) => {
  return new Promise((resolve, reject) => {
    const inputContainer = document.createElement('div')
    inputContainer.style.position = 'fixed'
    inputContainer.style.width = '400px'
    inputContainer.style.height = '150px'
    inputContainer.style.zIndex = '1000'

    const PromptContent = () => {
      const [inputValue, setInputValue] = useState('')
      const textareaRef = useRef<HTMLTextAreaElement>(null)

      useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, [])

      const handleSubmit = () => {
        resolve(inputValue)
        document.body.removeChild(inputContainer)
      }

      const handleClose = () => {
        document.body.removeChild(inputContainer)
        reject(new Error('User cancelled input'))
      }

      const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          handleSubmit()
        } else if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault()
          handleClose()
        }
      }

      return (
        <div className="flex bg-background border rounded-md p-2 gap-2 flex-col shadow-md">
          <div className="w-full">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your text here"
              className="w-full h-full mb-2 border-none outline-none resize-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex justify-between p-2">
            <Button size="sm" onClick={handleSubmit}>
              Submit
            </Button>
            <Button size="sm" variant="destructive" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      )
    }

    const root = ReactDOM.createRoot(inputContainer)
    root.render(<PromptContent />)

    const editorDomNode = editor.getDomNode()
    if (editorDomNode) {
      const rect = editorDomNode.getBoundingClientRect()
      const lineHeight = editor.getOption(monacoInstance.editor.EditorOption.lineHeight)
      const lineTop = editor.getTopForLineNumber(selection.startLineNumber)

      const modalHeight = 150 // Set this to the actual height of your modal
      const modalWidth = 400 // Set this to the actual width of your modal

      let top = rect.top + lineTop - lineHeight
      let left = rect.left

      if (window) {
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth

        // Adjust vertical position
        if (top + modalHeight > viewportHeight) {
          // If modal would overflow bottom, position it above the cursor
          top = Math.max(0, top - modalHeight)
        }

        // Adjust horizontal position
        if (left + modalWidth > viewportWidth) {
          left = Math.max(0, viewportWidth - modalWidth)
        }

        // Ensure the modal is fully visible
        top = Math.min(Math.max(0, top), viewportHeight - modalHeight)
        left = Math.min(Math.max(0, left), viewportWidth - modalWidth)
      }

      inputContainer.style.top = `${top}px`
      inputContainer.style.left = `${left}px`
    }

    document.body.appendChild(inputContainer)
  })
}
