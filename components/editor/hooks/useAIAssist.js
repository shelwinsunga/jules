import { useState } from 'react';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { calculateDiff } from '../utils/calculateDiff';
import { createContentWidget } from '../utils/widgetCreator';

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
            const oldText = editor.getModel().getValueInRange(range);

            const userInput = await promptUserForInput(editor, monaco, selection);

            const context = `Replace lines ${selection.startLineNumber}-${selection.endLineNumber}:\n${oldText}`;
            const { output } = await generate(userInput + '\n\n' + context);
            let newText = '';

            for await (const delta of readStreamableValue(output)) {
                newText += delta;
                setGeneration(currentGeneration => `${currentGeneration}${delta}`);
            }

            const { diffText, decorations, currentLine } = calculateDiff(oldText, newText, monaco, selection);

            editor.executeEdits('insert-diff-text', [{
                range: range,
                text: diffText,
                forceMoveMarkers: true
            }]);

            const oldDecorations = editor.deltaDecorations([], decorations);

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
        inputContainer.style.zIndex = '1000';
        inputContainer.style.background = 'white';
        inputContainer.style.padding = '10px';
        inputContainer.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Enter your text here';
        textarea.style.width = '300px';
        textarea.style.height = '100px';
        textarea.style.marginBottom = '10px';
        textarea.style.resize = 'vertical';
        
        const button = document.createElement('button');
        button.textContent = 'Submit';
        button.style.display = 'block';
        button.onclick = () => {
            resolve(textarea.value);
            document.body.removeChild(inputContainer);
        };

        inputContainer.appendChild(textarea);
        inputContainer.appendChild(button);

        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
            const rect = editorDomNode.getBoundingClientRect();
            const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
            const lineTop = editor.getTopForLineNumber(selection.startLineNumber);
            
            // Calculate position to ensure it's within screen bounds
            let top = rect.top + lineTop - lineHeight;
            let left = rect.left;
            
            // Adjust if it would render off-screen
            if (top + inputContainer.offsetHeight > window.innerHeight) {
                top = window.innerHeight - inputContainer.offsetHeight;
            }
            if (left + inputContainer.offsetWidth > window.innerWidth) {
                left = window.innerWidth - inputContainer.offsetWidth;
            }
            
            // Ensure it's not positioned off the top or left of the screen
            top = Math.max(0, top);
            left = Math.max(0, left);
            
            inputContainer.style.top = `${top}px`;
            inputContainer.style.left = `${left}px`;
        }

        document.body.appendChild(inputContainer);
        textarea.focus();
    });
};