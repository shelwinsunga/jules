'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';

export const createContentWidget = (editor, monaco, selection, oldText, newText, currentLine, oldDecorations) => {
    return {
        getDomNode: function() {
            const container = document.createElement('div');

            const handleReject = () => {
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

            const handleApprove = () => {
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
                editor.deltaDecorations(oldDecorations, []);
                editor.removeContentWidget(this);
            };

            const WidgetContent = () => (
                <div className="w-full bg-background border border-border rounded-md p-2 shadow-sm flex gap-4">
                    <Button variant="outline" className="bg-green-500" size="sm" onClick={handleApprove}>
                        Approve
                    </Button>
                    <Button variant="destructive" size="sm" className="mr-2" onClick={handleReject}>
                        Reject
                    </Button>
   
                </div>
            );

            ReactDOM.render(<WidgetContent />, container);
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