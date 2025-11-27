
export const styles = `
    .root {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 1;
        margin: 0 auto;
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
        position: relative;
        overflow-y: auto;
        padding: 1em;
    }
    
    .preview-pane pinstripe-frame > * + * {
        margin-top: 2rem;
    }
    
    .actions {
        position: absolute;
        top: 0.8rem;
        right: 0.8rem;
        z-index: 10;
    }
    .actions button {
        display: none;
        background: rgba(255, 255, 255, 0.95);
        border: 0.1rem solid rgb(220, 220, 220);
        border-radius: 0.3rem;
        padding: 0.4rem 0.8rem;
        font-size: 1.2rem;
        color: rgb(60, 60, 60);
        cursor: pointer;
        box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.08);
        transition: all 0.2s ease;
    }
    .actions button[data-display="true"] {
        display: block;
    }
    .actions button:hover {
        background: rgb(255, 255, 255);
        border-color: rgb(180, 180, 180);
        box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.15);
    }
    .actions button:active {
        transform: translateY(0.1rem);
        box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    }
`;

export const decorators = {
    modal(){
        const anchorTextarea = this.frame.parent;
        const editorTextarea = this.find('[data-part="editor-textarea"]');
        const saveChangesButton = this.find('[data-part="save-changes-button"]');
        const hasSaveChangesButton = anchorTextarea.params.hasSaveChangesButton === 'true';
    
        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;
        
        const previewFrame = this.frame.find('[data-part="editor-preview-pane"] pinstripe-frame');
    
        previewFrame.observe((current) => {
            while(current.parent && current.parent != previewFrame) {
                current = current.parent;
            }
            if(current.node.scrollIntoView) current.node.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        })

        const updatePreview = () => {
            const { value } = this.values;
            const formData = new FormData();
            formData.append('value', value);
            previewFrame.load(previewFrame.url, { method: 'POST', body: formData });
            anchorTextarea.value = value;
        };

        updatePreview();
        
        let previousValue = editorTextarea.value;
        this.setInterval(() => {
            const { value } = editorTextarea;
            if(previousValue != value){
                previousValue = value;
                updatePreview();
                if(hasSaveChangesButton){
                    saveChangesButton.attributes['data-display'] = 'true';
                }
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

        saveChangesButton.on('click', () => {
            this.form.submit({ skipPatch: true });
            saveChangesButton.attributes['data-display'] = 'false';
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
            <pinstripe-modal class="${this.cssClasses.modal}" width="120.0rem" height="full">
                <div class="${this.cssClasses.root}">
                    <div class="${this.cssClasses.textPane}">
                        <textarea name="value" data-part="editor-textarea">${this.params.value}</textarea>
                    </div>
                    <div class="${this.cssClasses.previewPane}" data-part="editor-preview-pane">
                        <div class="${this.cssClasses.actions}">
                            <button data-part="save-changes-button">Save Changes</button>
                        </div>
                        <pinstripe-frame url="/_markdown_editor/preview" load-on-init="false"></pinstripe-frame>
                    </div>
                </div>
            </pinstripe-modal>
        `;
    }
};
