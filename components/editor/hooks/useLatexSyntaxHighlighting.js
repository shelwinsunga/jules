import { loader } from '@monaco-editor/react';

export const useLatexSyntaxHighlighting = () => {
    const setupLatexSyntaxHighlighting = (monaco) => {
        monaco.languages.register({ id: 'latex' });
        monaco.languages.setMonarchTokensProvider('latex', {
            tokenizer: {
                root: [
                    [/\\[a-zA-Z]+/, 'keyword'],
                    [/\{|\}/, 'delimiter.curly'],
                    [/\[|\]/, 'delimiter.square'],
                    [/\$.*?\$/, 'string'],
                    [/%.*$/, 'comment'],
                ]
            }
        });
    };

    loader.init().then(setupLatexSyntaxHighlighting);

    return { setupLatexSyntaxHighlighting };
};