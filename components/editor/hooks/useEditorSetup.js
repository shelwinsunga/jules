import { useRef } from 'react';
import { useFrontend } from '@/contexts/FrontendContext';
import { useEditorTheme } from './useEditorTheme';
import { useLatexSyntaxHighlighting } from './useLatexSyntaxHighlighting';

const initialContent = `...`; // Move this to a separate file if it's large

export const useEditorSetup = (onChange) => {
    const editorRef = useRef();
    const { setLatex } = useFrontend();
    const { setTheme } = useEditorTheme();
    const { setupLatexSyntaxHighlighting } = useLatexSyntaxHighlighting();

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
        });
        editor.getModel().updateOptions({ tabSize: 4, insertSpaces: true });
        editor.setScrollTop(1);
        editor.setPosition({ lineNumber: 2, column: 0 });
        editor.focus();

        setTheme(monaco);
        setupLatexSyntaxHighlighting(monaco);

        editor.setValue(initialContent);
        setLatex(initialContent);
    };

    return { editorRef, handleEditorDidMount };
};