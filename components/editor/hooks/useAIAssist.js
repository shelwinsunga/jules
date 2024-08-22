'use client';
import { useState } from 'react';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { calculateDiff } from '../utils/calculateDiff';
import { createContentWidget } from '../utils/WidgetCreator';
import { promptModal } from '../utils/promptModal';

export const useAIAssist = (editorRef) => {

    const applyEdit = async (editor, initialText, range, diffText) => {
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
    }

    const handleAIAssist = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, async () => {
            const selection = editor.getSelection();
            const initialText = editor.getModel().getValue();
            const range = new monaco.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn
            );
            const oldText = editor.getModel().getValueInRange(range);
            const context = `Replace lines ${selection.startLineNumber}-${selection.endLineNumber}:\n${oldText}`;
            const userInput = await promptModal(editor, monaco, selection);
            const { output } = await generate(`File content:\n${initialText}\n\nContext: ${context}\n\nUser input: ${userInput}`);

            let newText = '';
            let oldDecorations = [];
            let currentLine = selection.startLineNumber; 
            let buffer = '';

            for await (const delta of readStreamableValue(output)) {
                buffer += delta;

                if (buffer.endsWith('\n') || buffer.length > 0) {
                    newText += buffer;
                    const { diffText, decorations, currentLine: updatedLine } = calculateDiff(oldText, newText, monaco, selection);
                    currentLine = updatedLine; // Update currentLine
                    await applyEdit(editor, initialText, range, diffText);
                    oldDecorations = editor.deltaDecorations(oldDecorations, decorations);
                    buffer = '';
                }
            }

            const { currentLine: finalLine } = calculateDiff(oldText, newText, monaco, selection);
            currentLine = finalLine;

            const contentWidget = createContentWidget(editor, monaco, selection, oldText, newText, currentLine, oldDecorations);
            editor.addContentWidget(contentWidget);
            
        });
    };

    return { handleAIAssist };
};