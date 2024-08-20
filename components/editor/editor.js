// Import necessary dependencies
'use client'
import Editor from '@monaco-editor/react'
import { useRef } from 'react'
import { useFrontend } from '@/contexts/FrontendContext'
import { loader } from '@monaco-editor/react';

const initialContent = `\\documentclass{article}
\\begin{document}
Hello, world! This is a simple LaTeX document.

\\section{A Section}
This is a section in our document.

\\subsection{A Subsection}
This is a subsection with some math: $E = mc^2$
\\end{document}`

// Function to set custom theme for the editor
function setTheme(monaco) {
    monaco.editor.defineTheme('myTheme', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {

        },
    })
    monaco.editor.setTheme('myTheme')
}

// Add this before the CodeEditor component
loader.init().then((monaco) => {
  // Register a new language
  monaco.languages.register({ id: 'latex' });

  // Define the token provider for LaTeX syntax highlighting
  monaco.languages.setMonarchTokensProvider('latex', {
    tokenizer: {
      root: [
        [/\\[a-zA-Z]+/, 'keyword'],
        [/\{|\}/, 'delimiter.curly'],
        [/\[|\]/, 'delimiter.square'],
        [/\$.*?\$/, 'string'],
        [/%.*$/, 'comment'],
      ]
    }
  });
});

// Main CodeEditor component
export const CodeEditor = ({ onChange, value }) => {
    const editorRef = useRef()
    const { setLatex } = useFrontend()

    // Default options for the editor
    const editorDefaultOptions = {
        wordWrap: 'on',
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        minimap: { enabled: false },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
            vertical: 'hidden'
        },
        overviewRulerBorder: false,
    }

    // Handles editor initialization
    const onEditorDidMount = (editor, monaco) => {
        editorRef.current = editor
        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue())
        })
        editor.getModel().updateOptions({
            tabSize: 4,
            insertSpaces: true,
        })
        editor.setScrollTop(1)
        editor.setPosition({
            lineNumber: 2,
            column: 0,
        })
        editor.focus()

        setTheme(monaco)

        // Initialize with the LaTeX content
        editor.setValue(initialContent)
        setLatex(initialContent)

        // Add key binding for Cmd/Ctrl + K
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
            const selection = editor.getSelection();
            const range = new monaco.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn
            );
            const oldText = editor.getModel().getValueInRange(range);
            const newText = 'This is a subsection with some math: $E = mc^2$'; // This should be replaced with actual new text generation

            const oldLines = oldText.split('\n');
            const newLines = newText.split('\n');
            
            let diffText = '';
            let decorations = [];
            let currentLine = selection.startLineNumber;

            // Calculate the actual diff
            const diff = calculateDiff(oldLines, newLines);

            diff.forEach(part => {
                if (part.added) {
                    part.value.split('\n').forEach(line => {
                        if (line) {
                            diffText += line + '\n';
                            decorations.push({
                                range: new monaco.Range(currentLine, 1, currentLine, 1),
                                options: { isWholeLine: true, className: 'diff-new-content' }
                            });
                            currentLine++;
                        }
                    });
                } else if (part.removed) {
                    part.value.split('\n').forEach(line => {
                        if (line) {
                            diffText += line + '\n';
                            decorations.push({
                                range: new monaco.Range(currentLine, 1, currentLine, 1),
                                options: { isWholeLine: true, className: 'diff-old-content' }
                            });
                            currentLine++;
                        }
                    });
                } else {
                    part.value.split('\n').forEach(line => {
                        if (line) {
                            diffText += line + '\n';
                            currentLine++;
                        }
                    });
                }
            });

            // Remove trailing newline
            diffText = diffText.slice(0, -1);

            // Replace the selected text with the diff text
            editor.executeEdits('insert-diff-text', [{
                range: range,
                text: diffText,
                forceMoveMarkers: true
            }]);

            const oldDecorations = editor.deltaDecorations([], decorations);

            // Add widget to approve or reject changes
            const contentWidget = {
                getDomNode: function() {
                    const container = document.createElement('div');
                    container.innerHTML = `
                        <div style="background: white; padding: 5px; border: 1px solid black;">
                            <button id="approve">Approve</button>
                            <button id="reject">Reject</button>
                        </div>
                    `;
                    container.querySelector('#approve').onclick = () => {
                        editor.executeEdits('approve-changes', [{
                            range: new monaco.Range(
                                selection.startLineNumber,
                                1,
                                currentLine - 1,
                                editor.getModel().getLineMaxColumn(currentLine - 1)
                            ),
                            text: newText,
                            forceMoveMarkers: true
                        }]);
                        editor.deltaDecorations(oldDecorations, []);
                        editor.removeContentWidget(contentWidget);
                    };
                    container.querySelector('#reject').onclick = () => {
                        editor.executeEdits('reject-changes', [{
                            range: new monaco.Range(
                                selection.startLineNumber,
                                1,
                                currentLine - 1,
                                editor.getModel().getLineMaxColumn(currentLine - 1)
                            ),
                            text: oldText,
                            forceMoveMarkers: true
                        }]);
                        editor.deltaDecorations(oldDecorations, []);
                        editor.removeContentWidget(contentWidget);
                    };
                    return container;
                },
                getId: function() {
                    return 'diff-widget';
                },
                getPosition: function() {
                    return {
                        position: {
                            lineNumber: currentLine,
                            column: 1
                        },
                        preference: [monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            };
            
            editor.addContentWidget(contentWidget);
        });

        // Update the CSS for better visibility
        const style = document.createElement('style');
        style.textContent = `
            .diff-old-content { background-color: #ffeeee; }
            .diff-new-content { background-color: #eeffee; }
        `;
        document.head.appendChild(style);

        // Function to calculate the diff
        function calculateDiff(oldLines, newLines) {
            const diff = [];
            let oldIndex = 0;
            let newIndex = 0;

            while (oldIndex < oldLines.length || newIndex < newLines.length) {
                if (oldIndex < oldLines.length && newIndex < newLines.length && oldLines[oldIndex] === newLines[newIndex]) {
                    diff.push({ value: oldLines[oldIndex] + '\n' });
                    oldIndex++;
                    newIndex++;
                } else if (newIndex < newLines.length && (oldIndex >= oldLines.length || oldLines[oldIndex] !== newLines[newIndex])) {
                    diff.push({ added: true, value: newLines[newIndex] + '\n' });
                    newIndex++;
                } else if (oldIndex < oldLines.length) {
                    diff.push({ removed: true, value: oldLines[oldIndex] + '\n' });
                    oldIndex++;
                }
            }

            return diff;
        }
    }

    // Render the Editor component
    return (
            <Editor
                theme="vs-dark"
                language="latex"
                height="100%"
                width="100%"
                value={value}
                onMount={onEditorDidMount}
                options={editorDefaultOptions}
            />
    )
}

export default CodeEditor