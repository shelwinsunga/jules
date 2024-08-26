'use client';
export const applyEdit = async (editor, initialText, range, diffText) => {
    editor.getModel().setValue(initialText);
    editor.getModel().pushEditOperations(
        [],
        [{
            range: range,
            text: diffText,
        }],
        () => null
    );
}