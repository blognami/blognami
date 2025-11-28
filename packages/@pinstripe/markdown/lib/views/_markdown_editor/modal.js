
export const styles = ({ colors, shadow, remify }) => `
    .root {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        background: ${colors.white};
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
        border-width: 0 ${remify(1)} 0 0;
        border-color: ${colors.gray[500]};
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
        font-size: ${remify(16)};
        font-family: monospace;
    }
    .preview-pane {
        position: relative;
        overflow-y: auto;
        padding: 1em;
    }

    .preview-pane pinstripe-frame > * + * {
        margin-top: ${remify(20)};
    }

    .actions {
        position: absolute;
        top: ${remify(8)};
        right: ${remify(8)};
        z-index: 10;
    }
    .actions button {
        display: none;
        background: color-mix(in oklch, ${colors.white} 95%, transparent);
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(3)};
        padding: ${remify(4)} ${remify(8)};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
        cursor: pointer;
        box-shadow: ${shadow['2xs']};
        transition: all 0.2s ease;
    }
    .actions button[data-display="true"] {
        display: block;
    }
    .actions button:hover {
        background: ${colors.white};
        border-color: ${colors.gray[400]};
        box-shadow: ${shadow.sm};
    }
    .actions button:active {
        transform: translateY(${remify(1)});
        box-shadow: ${shadow.xs};
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
            <pinstripe-modal class="${this.cssClasses.modal}" width="75rem" height="full">
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
