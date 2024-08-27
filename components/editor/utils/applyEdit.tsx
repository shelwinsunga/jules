'use client';
import { ApplyEditProps } from '@/components/editor/types';

export const applyEdit = async ({ editor, initialText, range, diffText }: ApplyEditProps) => {
    const model = editor.getModel();
    if (!model) return;
    model.setValue(initialText);
    model.pushEditOperations(
        [],
        [{
            range: range,
            text: diffText,
        }],
        () => null
    );
}