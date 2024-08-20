export const calculateDiff = (oldText, newText, monaco, selection) => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    let diffText = '';
    let decorations = [];
    let currentLine = selection.startLineNumber;

    const diff = [];
    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
        if (oldIndex < oldLines.length && newIndex < newLines.length && oldLines[oldIndex] === newLines[newIndex]) {
            diff.push({ value: oldLines[oldIndex] + '\n' });
            oldIndex++;
            newIndex++;
        } else if (oldIndex < oldLines.length) {
            diff.push({ removed: true, value: oldLines[oldIndex] + '\n' });
            oldIndex++;
        } else if (newIndex < newLines.length) {
            diff.push({ added: true, value: newLines[newIndex] + '\n' });
            newIndex++;
        }
    }

    diff.forEach(part => {
        if (part.removed) {
            part.value.split('\n').forEach(line => {
                if (line) {
                    diffText += line + '\n';
                    decorations.push({
                        range: new monaco.Range(currentLine, 1, currentLine, 1),
                        options: { isWholeLine: true, className: 'diff-old-content' }
                    });
                    currentLine++;
                }
            });
        } else if (part.added) {
            part.value.split('\n').forEach(line => {
                if (line) {
                    diffText += line + '\n';
                    decorations.push({
                        range: new monaco.Range(currentLine, 1, currentLine, 1),
                        options: { isWholeLine: true, className: 'diff-new-content' }
                    });
                    currentLine++;
                }
            });
        } else {
            part.value.split('\n').forEach(line => {
                if (line) {
                    diffText += line + '\n';
                    currentLine++;
                }
            });
        }
    });

    // Remove trailing newline
    diffText = diffText.slice(0, -1);

    return { diffText, decorations, currentLine };
};