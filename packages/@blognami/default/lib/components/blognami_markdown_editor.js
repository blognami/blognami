
import { Markdown } from 'blognami';

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
    
        previewFrame.observe((current) => {
            while(current.parent && current.parent != previewFrame) {
                current = current.parent;
            }
            if(current.node.scrollIntoView) current.node.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        })

        const updatePreview = () => {
            const { value } = this.values;
            previewFrame.patch(Markdown.render(value).toString());
            anchorTextarea.value = value;
        };

        updatePreview();

        let previousValue = editorTextarea.value;
        this.setInterval(() => {
            const { value } = editorTextarea;
            if(previousValue != value){
                previousValue = value;
                updatePreview();
            }
        }, 100);
    },

    replaceLine(index, content){
        const editorTextarea = this.descendants.find(n => n.is('.markdown-editor-text-pane > textarea'));
        const lines = editorTextarea.value.split(/\n/);
        lines[index] = content;
        editorTextarea.value = lines.join('\n');
        editorTextarea.focus();
        const position = lines.slice(0, index + 1).join('\n').length;
        editorTextarea.node.selectionStart = position;
        editorTextarea.node.selectionEnd = position;
    }
};