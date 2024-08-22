'use client';
export const applyEdit = async (editor, initialText, range, diffText) => {
    editor.executeEdits('reset-to-initial', [{
        range: editor.getModel().getFullModelRange(),
        text: initialText,
        forceMoveMarkers: true
    }]);
    
    editor.executeEdits('insert-diff-text', [{
        range: range,
        text: diffText,
        forceMoveMarkers: true
    }]);
}