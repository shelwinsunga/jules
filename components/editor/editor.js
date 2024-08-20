import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorSetup } from './hooks/useEditorSetup';
import { useAIAssist } from './hooks/useAIAssist';
import { editorDefaultOptions } from './constants/editorDefaults';

export const CodeEditor = ({ onChange, value }) => {
    const { editorRef, handleEditorDidMount } = useEditorSetup(onChange);
    const { handleAIAssist } = useAIAssist(editorRef);

    return (
        <Editor
            theme="vs-dark"
            language="latex"
            height="100%"
            width="100%"
            value={value}
            onMount={(editor, monaco) => {
                handleEditorDidMount(editor, monaco);
                handleAIAssist(editor, monaco);
            }}
            options={editorDefaultOptions}
        />
    );
};

export default CodeEditor;