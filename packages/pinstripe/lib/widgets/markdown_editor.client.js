
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const anchorTextarea = this.frame.parent;
        const editorTextarea = this.descendants.find(n => n.is('textarea'));

        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;
        
        const previewFrame = this.frame.descendants.find(n => n.is('.markdown-editor-preview-pane'));

        this.on('submit', () => {
            const { value } = this.values;
            previewFrame.load({ _method: 'post', value });
            anchorTextarea.value = value
        })
    }
};
