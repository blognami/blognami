
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        const anchorTextarea = this.frame.parent;
        const editorTextarea = this.descendants.find(n => n.is('.markdown-editor-text-pane > textarea'));

        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;
        
        const previewFrame = this.frame.descendants.find(n => n.is('.markdown-editor-preview-pane'));

        this.on('submit', () => {
            const { value } = this.values;
            previewFrame.load({ _method: 'post', value });
            anchorTextarea.value = value;
        });

        this.assignProps({
            replaceLine(index, content){
                const lines = editorTextarea.value.split(/\n/);
                lines[index] = content;
                editorTextarea.value = lines.join('\n');
                editorTextarea.focus();
                const position = lines.slice(0, index + 1).join('\n').length;
                editorTextarea.node.selectionStart = position;
                editorTextarea.node.selectionEnd = position;
            }
        });
    }
};
