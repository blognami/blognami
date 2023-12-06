
import { Markdown } from 'pinstripe';

export const styles = `
    .root {
        display: flex;
        flex-direction: row;
        width: 100vw;
        height: calc(100vh - 4rem);
        max-width: 120.0rem;
        background: #fff;
        z-index: 1;
    }
    .text-pane, .preview-pane {
        flex: 1 1 0;
        height: 100%;
    }
    .text-pane {
        position: relative;
        border-style: solid;
        border-width: 0 0.1rem 0 0;
        border-color: rgb(99, 99, 99);
        padding: 0;
    }
    .text-pane > textarea {
        border: none;
        height: 100%;
        width: 100%;
        resize: none;
        outline: none;
        padding: 1em;
    }

    .text-pane > textarea, .preview-pane > p {
        font-size: 1.6rem;
        font-family: monospace;
    }

    .preview-pane {
        overflow-y: auto;
        padding: 1em;
    }
    .preview-pane > * + * {
        margin-top: 2rem;
    }
`;

export const decorators = {
    modal(){
        const anchorTextarea = this.frame.parent;
        const editorTextarea = this.descendants.find(n => n.is('[data-part="editor-textarea"]'));
    
        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;
        
        const previewFrame = this.frame.descendants.find(n => n.is('[data-part="editor-preview-pane"]'));
    
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
    },

    lineInserter(){
        this.on('click', () => {
            const { lineContent } = this.params;
            const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).params;

            this.modal.replaceLine(lineNumber - 1, lineContent);
        });
    }
};

export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal class="${this.cssClasses.modal}">
                <div class="${this.cssClasses.root}">
                    <div class="${this.cssClasses.textPane}">
                        <textarea name="value" data-part="editor-textarea">${this.params.value}</textarea>
                    </div>
                    <div class="${this.cssClasses.previewPane}" data-part="editor-preview-pane"></div>
                </div>
            </pinstripe-modal>
        `;
    }
};
