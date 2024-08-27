'use client';

import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

export const useLatexSyntaxHighlighting = () => {
    const setupLatexSyntaxHighlighting = (monacoInstance: typeof monaco) => {
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