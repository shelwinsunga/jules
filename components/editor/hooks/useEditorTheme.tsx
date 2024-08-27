'use client';
import { Monaco } from '@/components/editor/types';

export const useEditorTheme = () => {
    const setTheme = (monaco: Monaco) => {
        monaco.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#ffffff',
            },
        });
        monaco.editor.setTheme('myTheme');
    };

    return { setTheme };
};