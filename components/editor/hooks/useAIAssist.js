'use client';
import { useState } from 'react';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { calculateDiff } from '../utils/calculateDiff';
import { createContentWidget } from '../utils/WidgetCreator';
import { promptModal } from '../utils/promptModal';
import { applyEdit } from '../utils/applyEdit';

export const useAIAssist = (editorRef) => {

    const handleAIAssist = (editor, monaco) => {
        // Add a command to the editor that triggers on Ctrl+K
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
            
            // Prompt the user for input
            const userInput = await promptModal(editor, monaco, selection);
            
            // Generate new content based on the user input and context
            const { output } = await generate(`File content:\n${initialText}\n\nContext: ${context}\n\nUser input: ${userInput}`);

            let newText = '';
            let oldDecorations = [];
            let currentLine = selection.startLineNumber; 
            let buffer = '';

            // Read the generated output in a streamable manner
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

            // Final calculation of differences
            const { currentLine: finalLine } = calculateDiff(oldText, newText, monaco, selection);
            currentLine = finalLine;

            // Create and add a content widget to the editor
            const contentWidget = createContentWidget(editor, monaco, selection, oldText, newText, currentLine, oldDecorations);
            editor.addContentWidget(contentWidget);
            
        });
    };

    return { handleAIAssist };
};