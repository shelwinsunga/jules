import { useRef } from 'react';
import { useFrontend } from '@/contexts/FrontendContext';
import { useEditorTheme } from './useEditorTheme';
import { useLatexSyntaxHighlighting } from './useLatexSyntaxHighlighting';
import * as monaco from 'monaco-editor';

const initialContent = `\\documentclass{article}
\\begin{document}
Hello, world! This is a simple LaTeX document.

\\section{A Section}
This is a section in our document.

\\subsection{A Subsection}
This is a subsection with some math: $E = mc^2$
\\end{document}`

export const useEditorSetup = (onChange: (value: string) => void) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const { setLatex } = useFrontend();
    const { setTheme } = useEditorTheme();
    const { setupLatexSyntaxHighlighting } = useLatexSyntaxHighlighting();

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        editorRef.current = editor;
        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
        });
        editor.getModel()?.updateOptions({ tabSize: 4, insertSpaces: true });
        editor.setScrollTop(1);
        editor.setPosition({ lineNumber: 2, column: 0 });
        editor.focus();

        setTheme(monacoInstance);
        setupLatexSyntaxHighlighting(monacoInstance);

        editor.setValue(initialContent);
        setLatex(initialContent);
    };

    return { editorRef, handleEditorDidMount };
};