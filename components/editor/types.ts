import { editor } from 'monaco-editor';

export interface CodeEditorProps {
    onChange: (value: string) => void;
    value: string;
}

export type Editor = editor.IStandaloneCodeEditor;
