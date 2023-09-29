
import { Component } from '../../../haberdash/lib/component.js';
import { Markdown } from '../../../haberdash/lib/markdown.js';

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

Component.register('blognami-markdown-editor/line-inserter', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', () => {
            const { lineContent } = this.params;
            const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).params;
            const markdownEditor =  this.parents.find(n => n.is('.markdown-editor'));
    
            markdownEditor.replaceLine(lineNumber - 1, lineContent);
        });
    }
});

Component.register('blognami-markdown-editor/anchor', {
    meta(){
        this.include('a');
    },

    initialize(...args){
        this.constructor.for('a').prototype.initialize.call(this, ...args);

        this.patch({ 
            ...this.attributes,
            'data-target': '_overlay',
            'data-href': '/markdown_editor'
        });
    }
});