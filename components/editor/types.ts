import { editor } from 'monaco-editor';

export interface CodeEditorProps {
    onChange: (value: string) => void;
    value: string;
}


export interface Monaco {
    editor: typeof editor;
}
export type Editor = editor.IStandaloneCodeEditor;
