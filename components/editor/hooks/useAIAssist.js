'use client';
import { useState } from 'react';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { calculateDiff } from '../utils/calculateDiff';
import { createContentWidget } from '../utils/WidgetCreator';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const useAIAssist = (editorRef) => {
    const [generation, setGeneration] = useState('');


    const handleAIAssist = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, async () => {
            const selection = editor.getSelection();
            const range = new monaco.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn
            );
            const initialText = editor.getModel().getValue();
            const oldText = editor.getModel().getValueInRange(range);
            const userInput = await promptUserForInput(editor, monaco, selection);
            const context = `Replace lines ${selection.startLineNumber}-${selection.endLineNumber}:\n${oldText}`;
            const fileContent = editor.getModel().getValue();
            const { output } = await generate(`File content:\n${fileContent}\n\nContext: ${context}\n\nUser input: ${userInput}`);
            let newText = '';
            let oldDecorations = [];
            let currentLine = selection.startLineNumber; // Initialize currentLine here

            for await (const delta of readStreamableValue(output)) {
                editor.executeEdits('reset-to-initial', [{
                    range: editor.getModel().getFullModelRange(),
                    text: initialText,
                    forceMoveMarkers: true
                }]);

                newText += delta;
                setGeneration(currentGeneration => `${currentGeneration}${delta}`);
                const { diffText, decorations, currentLine: updatedLine } = calculateDiff(oldText, newText, monaco, selection);
                currentLine = updatedLine; // Update currentLine

                editor.executeEdits('insert-diff-text', [{
                    range: range,
                    text: diffText,
                    forceMoveMarkers: true
                }]);
                oldDecorations = editor.deltaDecorations(oldDecorations, decorations);
            }

            const { diffText, decorations, currentLine: finalLine } = calculateDiff(oldText, newText, monaco, selection);
            currentLine = finalLine; // Update currentLine

            const contentWidget = createContentWidget(editor, monaco, selection, oldText, newText, currentLine, oldDecorations);
            editor.addContentWidget(contentWidget);
            
        });
        // Add CSS for diff highlighting
        const style = document.createElement('style');
        style.textContent = `
            .diff-old-content { background-color: #ffeeee; }
            .diff-new-content { background-color: #eeffee; }
        `;
        document.head.appendChild(style);
    };

    return { handleAIAssist };
};

// Helper function to prompt user for input
const promptUserForInput = async (editor, monaco, selection) => {
    return new Promise((resolve) => {
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'absolute';
        inputContainer.style.width = '400px';
        inputContainer.style.height = '150px';
        inputContainer.style.zIndex = '1000';

        const PromptContent = () => {
            const [inputValue, setInputValue] = React.useState('');
            const textareaRef = React.useRef(null);

            React.useEffect(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, []);

            const handleSubmit = () => {
                resolve(inputValue);
                document.body.removeChild(inputContainer);
            };

            const handleKeyDown = (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                }
            };

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
                    <div className="flex justify-start p-2">
                        <Button size="sm" onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            );
        };

        ReactDOM.render(<PromptContent />, inputContainer);

        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
            const rect = editorDomNode.getBoundingClientRect();
            const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
            const lineTop = editor.getTopForLineNumber(selection.startLineNumber);
            
            let top = rect.top + lineTop - lineHeight;
            let left = rect.left;
            
            if (window) {
                if (top + inputContainer.offsetHeight > window.innerHeight) {
                    top = window.innerHeight - inputContainer.offsetHeight;
                }
                if (left + inputContainer.offsetWidth > window.innerWidth) {
                    left = window.innerWidth - inputContainer.offsetWidth;
                }
            }
            
            top = Math.max(0, top);
            left = Math.max(0, left);
            
            inputContainer.style.top = `${top}px`;
            inputContainer.style.left = `${left}px`;
        }

        document.body.appendChild(inputContainer);
    });
};