'use client';

export const createContentWidget = (editor, monaco, selection, oldText, newText, currentLine, oldDecorations) => {
    return {
        getDomNode: function() {
            const container = document.createElement('div');
            container.innerHTML = `
                <div style="background: white; padding: 5px; border: 1px solid black;">
                    <button id="reject">Reject</button>
                    <button id="approve">Approve</button>
                </div>
            `;
            container.querySelector('#reject').onclick = () => {
                editor.executeEdits('reject-changes', [{
                    range: new monaco.Range(
                        selection.startLineNumber,
                        1,
                        currentLine - 1,
                        editor.getModel().getLineMaxColumn(currentLine - 1)
                    ),
                    text: oldText,
                    forceMoveMarkers: true
                }]);
                editor.deltaDecorations(oldDecorations, []);
                editor.removeContentWidget(this);
            };
            container.querySelector('#approve').onclick = () => {
                editor.executeEdits('approve-changes', [{
                    range: new monaco.Range(
                        selection.startLineNumber,
                        1,
                        currentLine - 1,
                        editor.getModel().getLineMaxColumn(currentLine - 1)
                    ),
                    text: newText,
                    forceMoveMarkers: true
                }]);
                editor.deltaDecorations(oldDecorations, []); // funct signature is (,)
                editor.removeContentWidget(this);
            };
            return container;
        },
        getId: function() {
            return 'diff-widget';
        },
        getPosition: function() {
            return {
                position: {
                    lineNumber: currentLine,
                    column: 1
                },
                preference: [monaco.editor.ContentWidgetPositionPreference.BELOW]
            };
        }
    };
};