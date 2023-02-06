
import { Component } from '../component.js'

Component.register('pinstripe-markdown-editor', {
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
    
        this.on('submit', () => {
            const { value } = this.values;
            const formData = new FormData();
            formData.append('value', value);
            previewFrame.load(previewFrame.url, { method: 'POST', body: formData });
            anchorTextarea.value = value;
        });
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
});

Component.register('pinstripe-markdown-editor/line-inserter', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', () => {
            const { lineContent } = this.data;
            const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).data;
            const markdownEditor =  this.parents.find(n => n.is('.markdown-editor'));
    
            markdownEditor.replaceLine(lineNumber - 1, lineContent);
        });
    }
});

Component.register('pinstripe-markdown-editor/anchor', {
    meta(){
        this.include('pinstripe-anchor');
    },

    initialize(...args){
        this.constructor.for('pinstripe-anchor').prototype.initialize.call(this, ...args);

        this.patch({ 
            ...this.attributes,
            'data-target': '_overlay',
            'data-href': '/markdown_editor'
        });
    }
});