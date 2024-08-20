
import { editor } from 'monaco-editor';

export const editorDefaultOptions: editor.IStandaloneEditorConstructionOptions = {
    wordWrap: 'on',
    folding: false,
    lineNumbersMinChars: 3,
    fontSize: 16,
    scrollBeyondLastLine: true,
    scrollBeyondLastColumn: 5,
    automaticLayout: true,
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollbar: {
        vertical: 'visible'
    },
    overviewRulerBorder: false,
};