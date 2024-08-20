// Import necessary dependencies
'use client'
import Editor from '@monaco-editor/react'
import { useRef } from 'react'
import { useFrontend } from '@/contexts/FrontendContext'
import { loader } from '@monaco-editor/react';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { useEffect } from 'react';
import { useState } from 'react';

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
    const [generation, setGeneration] = useState('');
    const [originalText, setOriginalText] = useState('');
    const [currentDiff, setCurrentDiff] = useState([]);
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
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, async () => {
            const selection = editor.getSelection();
            const range = new monaco.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn
            );
            const oldText = editor.getModel().getValueInRange(range);
            setOriginalText(oldText);

            // Prompt the user for input
            const userInput = await new Promise((resolve) => {
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

            // Generate text using the user input
            
            const context = `Replace lines ${selection.startLineNumber}-${selection.endLineNumber}:\n${oldText}`;
            const { output } = await generate(userInput + '\n\n' + context);
            let newText = '';

            for await (const delta of readStreamableValue(output)) {
                newText += delta;
                setGeneration(currentGeneration => `${currentGeneration}${delta}`);
                
                // Calculate and apply diff in real-time
                const newDiff = calculateDiff(originalText.split('\n'), newText.split('\n'));
                setCurrentDiff(newDiff);
                
                // Apply the diff to the editor
                applyDiffToEditor(editor, monaco, selection.startLineNumber, newDiff);
            }

            // Add widget to approve or reject changes
            const contentWidget = {
                getDomNode: function() {
                    const container = document.createElement('div');
                    container.innerHTML = `
                        <div style="background: white; padding: 5px; border: 1px solid black;">
                            <button id="reject">Reject</button>
                            <button id="approve">Approve</button>
                        </div>
                    `;
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
                if (newIndex < newLines.length) {
                    // Check if the new line is a continuation of the previous line
                    if (diff.length > 0 && diff[diff.length - 1].added) {
                        diff[diff.length - 1].value += newLines[newIndex] + '\n';
                    } else {
                        diff.push({ added: true, value: newLines[newIndex] + '\n' });
                    }
                    newIndex++;
                } else if (oldIndex < oldLines.length) {
                    diff.push({ removed: true, value: oldLines[oldIndex] + '\n' });
                    oldIndex++;
                }
            }

            return diff;
        }

        // Function to apply the diff to the editor
        function applyDiffToEditor(editor, monaco, startLineNumber, diff) {
            let currentLine = startLineNumber;
            let diffText = '';
            let decorations = [];

            diff.forEach(part => {
                if (part.removed) {
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
                } else if (part.added) {
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
                range: new monaco.Range(startLineNumber, 1, currentLine, 1),
                text: diffText,
                forceMoveMarkers: true
            }]);

            editor.deltaDecorations([], decorations);
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