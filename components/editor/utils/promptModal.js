
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const promptModal = async (editor, monaco, selection) => {
    return new Promise((resolve, reject) => {
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'absolute';
        inputContainer.style.width = '400px';
        inputContainer.style.height = '150px';
        inputContainer.style.zIndex = '1000';

        const PromptContent = () => {
            const [inputValue, setInputValue] = React.useState('');
            const textareaRef = React.useRef(null);

            React.useEffect(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, []);

            const handleSubmit = () => {
                resolve(inputValue);
                document.body.removeChild(inputContainer);
            };

            const handleClose = () => {
                document.body.removeChild(inputContainer);
                reject(new Error('User cancelled input'));
            };

            const handleKeyDown = (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                } else if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
                    console.log('Ctrl+K or Cmd+K pressed');
                    event.preventDefault();
                    handleClose();
                }
            };

            return (
                <div className="flex bg-background border rounded-md p-2 gap-2 flex-col shadow-md">
                    <div className="w-full">
                        <Textarea
                            ref={textareaRef}
                            placeholder="Enter your text here"
                            className="w-full h-full mb-2 border-none outline-none resize-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="flex justify-between p-2">
                        <Button size="sm" onClick={handleSubmit}>Submit</Button>
                        <Button size="sm" variant="destructive" onClick={handleClose}>Close</Button>
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(inputContainer); // Use createRoot
        root.render(<PromptContent />);

        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
            const rect = editorDomNode.getBoundingClientRect();
            const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
            const lineTop = editor.getTopForLineNumber(selection.startLineNumber);
            
            let top = rect.top + lineTop - lineHeight;
            let left = rect.left;
            
            if (window) {
                if (top + inputContainer.offsetHeight > window.innerHeight) {
                    top = window.innerHeight - inputContainer.offsetHeight;
                }
                if (left + inputContainer.offsetWidth > window.innerWidth) {
                    left = window.innerWidth - inputContainer.offsetWidth;
                }
            }
            
            top = Math.max(0, top);
            left = Math.max(0, left);
            
            inputContainer.style.top = `${top}px`;
            inputContainer.style.left = `${left}px`;
        }

        document.body.appendChild(inputContainer);
    });
};