'use client';
import { useState } from 'react';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { calculateDiff } from '../utils/calculateDiff';
import { createContentWidget } from '../utils/WidgetCreator';
import { promptModal } from '../utils/promptModal';

export const useAIAssist = (editorRef) => {

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
            const userInput = await promptModal(editor, monaco, selection);
            const context = `Replace lines ${selection.startLineNumber}-${selection.endLineNumber}:\n${oldText}`;
            const fileContent = editor.getModel().getValue();
            const { output } = await generate(`File content:\n${fileContent}\n\nContext: ${context}\n\nUser input: ${userInput}`);
            let newText = '';
            let oldDecorations = [];
            let currentLine = selection.startLineNumber; // Initialize currentLine here

            let buffer = '';

            for await (const delta of readStreamableValue(output)) {
                buffer += delta;

                if (buffer.endsWith('\n')) {
                    newText += buffer;
                    const { diffText, decorations, currentLine: updatedLine } = calculateDiff(oldText, newText, monaco, selection);
                    currentLine = updatedLine; // Update currentLine

                    editor.executeEdits('reset-to-initial', [{
                        range: editor.getModel().getFullModelRange(),
                        text: initialText,
                        forceMoveMarkers: true
                    }]);

                    editor.executeEdits('insert-diff-text', [{
                        range: range,
                        text: diffText,
                        forceMoveMarkers: true
                    }]);
                    oldDecorations = editor.deltaDecorations(oldDecorations, decorations);

                    buffer = '';
                }
            }

            if (buffer) {
                newText += buffer;
                const { diffText, decorations, currentLine: updatedLine } = calculateDiff(oldText, newText, monaco, selection);
                currentLine = updatedLine; // Update currentLine

                editor.executeEdits('reset-to-initial', [{
                    range: editor.getModel().getFullModelRange(),
                    text: initialText,
                    forceMoveMarkers: true
                }]);

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
