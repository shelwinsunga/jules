import type { editor, languages } from 'monaco-editor';

export interface CodeEditorProps {
    onChange: (value: string) => void;
    value: string;
}


export interface Monaco {
    editor: typeof editor;
    languages: typeof languages;
}


export type Editor = editor.IStandaloneCodeEditor;
