export const useEditorTheme = () => {
    const setTheme = (monaco) => {
        monaco.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {},
        });
        monaco.editor.setTheme('myTheme');
    };

    return { setTheme };
};