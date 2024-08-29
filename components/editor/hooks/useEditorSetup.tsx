'use client';
import { useRef } from 'react';
import { useFrontend } from '@/contexts/FrontendContext';
import { useEditorTheme } from './useEditorTheme';
import { useLatexSyntaxHighlighting } from './useLatexSyntaxHighlighting';
import { editor, languages } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { useParams } from 'next/navigation'
import { db, defaultContent } from '@/lib/constants';

export function useEditorSetup(onChange: (value: string) => void) {
    const { id } = useParams<{ id: string }>();
    const { isLoading, error, data } = db.useQuery({
        projects: {
            $: {
                where: {
                    id: id
                }
            }
        }
    })

    const initializedContent = data?.projects[0]?.project_content || defaultContent;

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const { setLatex } = useFrontend();
    const { setTheme } = useEditorTheme();
    const { setupLatexSyntaxHighlighting } = useLatexSyntaxHighlighting();

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
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

        editor.setValue(initializedContent);
        setLatex(initializedContent);
    };

    return { editorRef, handleEditorDidMount };
};