import type { editor, languages } from 'monaco-editor';
import * as monaco from 'monaco-editor';

export interface CodeEditorProps {
    onChange: (value: string) => void;
    value: string;
}


export interface Monaco {
    editor: typeof editor;
    languages: typeof languages;
}

export type Range = monaco.Range;

export type Editor = editor.IStandaloneCodeEditor;
