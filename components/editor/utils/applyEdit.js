'use client';
export const applyEdit = async (editor, initialText, range, diffText) => {
    // Reset to initial text without adding to undo stack
    editor.getModel().setValue(initialText);
    
    // Apply diff text without adding to undo stack
    editor.getModel().pushEditOperations(
        [],
        [{
            range: range,
            text: diffText,
        }],
        () => null
    );
}