
export default {
    decorate(nodeWrapper){
        if(nodeWrapper.is('.markdown-editor')) this.decorateMarkdownEditor(nodeWrapper);
        if(nodeWrapper.is('[data-line-content]')) this.decorateLineInserter(nodeWrapper);
    },

    decorateMarkdownEditor(nodeWrapper){
        const anchorTextarea = nodeWrapper.frame.parent;
        const editorTextarea = nodeWrapper.descendants.find(n => n.is('.markdown-editor-text-pane > textarea'));

        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;
        
        const previewFrame = nodeWrapper.frame.descendants.find(n => n.is('.markdown-editor-preview-pane'));

        nodeWrapper.on('submit', () => {
            const { value } = nodeWrapper.values;
            previewFrame.load({ _method: 'post', value });
            anchorTextarea.value = value;
        });

        nodeWrapper.assignProps({
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
    },

    decorateLineInserter(nodeWrapper){
        nodeWrapper.on('click', () => {
            const { lineContent } = nodeWrapper.data;
            const { lineNumber } = nodeWrapper.parents.find(n => n.is('[data-line-number]')).data;
            const markdownEditor =  nodeWrapper.parents.find(n => n.is('.markdown-editor'));

            markdownEditor.replaceLine(lineNumber, lineContent);
        });
    }
};
