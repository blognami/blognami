
import { whenever } from "../node_wrapper.js";

whenever('pinstripe-markdown-editor', function(){
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
});

whenever('pinstripe-markdown-editor/line-inserter', function(){
    this.on('click', () => {
        const { lineContent } = this.data;
        const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).data;
        const markdownEditor =  this.parents.find(n => n.is('.markdown-editor'));

        markdownEditor.replaceLine(lineNumber - 1, lineContent);
    });
});

whenever('pinstripe-markdown-editor/anchor', function(){
    this.apply('pinstripe-anchor');

    this.patch({ 
        ...this.attributes,
        'data-target': '_overlay',
        'data-href': '/markdown_editor'
    });
});