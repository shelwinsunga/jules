'use client';
export const useEditorTheme = () => {
    const setTheme = (monaco) => {
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