'use client';

import { loader } from '@monaco-editor/react';
import { Monaco } from '@/components/editor/types';
export const useLatexSyntaxHighlighting = () => {
    const setupLatexSyntaxHighlighting = (monaco: Monaco) => {
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