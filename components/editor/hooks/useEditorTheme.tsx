'use client';
import * as monaco from 'monaco-editor';

export const useEditorTheme = () => {
    const setTheme = (monacoInstance: typeof monaco) => {
        monacoInstance.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#ffffff',
            },
        });
        monacoInstance.editor.setTheme('myTheme');
    };

    return { setTheme };
};