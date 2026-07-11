
export const styles = ({ colors, shadow, remify, fonts }) => `
    .root {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: ${colors.white};
        z-index: 1;
        margin: 0 auto;
    }
    .toolbar {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 0;
        padding: 0 ${remify(12)};
        overflow: hidden;
        border-bottom: 0 solid ${colors.gray[300]};
        transition: height 0.2s ease;
    }
    .toolbar:has(button[data-display="true"]) {
        height: ${remify(48)};
        border-bottom-width: ${remify(1)};
    }
    .panes {
        flex: 1 1 0;
        min-height: 0;
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .text-pane, .side-panes {
        flex: 1 1 0;
        height: 100%;
        min-height: 0;
        min-width: 0;
    }
    .side-panes {
        display: flex;
        flex-direction: column;
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
        font-family: ${fonts.sans};
        font-size: ${remify(16)};
        line-height: 1.5;
    }
    .preview-pane {
        flex: 1 1 0;
        min-height: 0;
        min-width: 0;
        overflow-y: auto;
        padding: 1em;
    }
    .context-pane {
        display: none;
        flex: 0 1 auto;
        max-height: 50%;
        min-width: 0;
        overflow-y: auto;
        padding: 1em;
        border-bottom: ${remify(1)} solid ${colors.gray[300]};
    }
    .root[data-has-context="true"] .context-pane {
        display: block;
    }

    .preview-pane pinstripe-frame > * + * {
        margin-top: ${remify(20)};
    }
    .toolbar button {
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
    .toolbar button[data-display="true"] {
        display: block;
    }
    .toolbar button:hover {
        background: ${colors.white};
        border-color: ${colors.gray[400]};
        box-shadow: ${shadow.sm};
    }
    .toolbar button:active {
        transform: translateY(${remify(1)});
        box-shadow: ${shadow.xs};
    }
    .view-toggle {
        display: none;
        margin-right: auto;
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(3)};
        overflow: hidden;
    }
    .view-toggle button {
        display: block;
        border: none;
        border-radius: 0;
        box-shadow: none;
        background: ${colors.white};
        padding: ${remify(4)} ${remify(10)};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
        cursor: pointer;
        transition: background 0.15s ease;
    }
    .view-toggle button + button {
        border-left: ${remify(1)} solid ${colors.gray[300]};
    }
    .view-toggle [data-part="context-toggle"] {
        display: none;
    }
    .view-toggle [data-part="preview-toggle"] {
        display: none;
    }
    .root[data-mobile-view="edit"] .view-toggle [data-part="edit-toggle"],
    .root[data-mobile-view="preview"] .view-toggle [data-part="preview-toggle"],
    .root[data-mobile-view="context"] .view-toggle [data-part="context-toggle"] {
        background: ${colors.gray[200]};
        color: ${colors.gray[900]};
    }

    @media (max-width: 47.99rem) {
        .toolbar {
            height: ${remify(48)};
            border-bottom-width: ${remify(1)};
        }
        .view-toggle {
            display: flex;
        }
        .view-toggle [data-part="preview-toggle"] {
            display: block;
        }
        .root[data-slash-line="true"] .view-toggle {
            display: none;
        }
        .panes {
            flex-direction: column;
            gap: ${remify(16)};
        }
        .text-pane, .preview-pane {
            height: auto;
        }
        .text-pane {
            border-width: 0;
        }
        .side-panes {
            display: contents;
        }
        .context-pane {
            max-height: none;
            border-bottom: none;
        }
        .root[data-has-context="true"] .context-pane {
            display: none;
        }
        .root[data-mobile-view="context"] .context-pane {
            display: block;
        }
        .root[data-mobile-view="context"] .text-pane,
        .root[data-mobile-view="context"] .preview-pane {
            display: none;
        }
        .root[data-has-context="true"] .view-toggle [data-part="context-toggle"] {
            display: block;
        }
        .root[data-mobile-view="edit"] .preview-pane {
            display: none;
        }
        .root[data-mobile-view="preview"] .text-pane {
            display: none;
        }
        .root[data-slash-line="true"] .text-pane,
        .root[data-slash-line="true"] .preview-pane {
            display: block;
        }
        .root[data-slash-line="true"] .text-pane::after {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -${remify(10)};
            width: ${remify(40)};
            height: ${remify(4)};
            border-radius: ${remify(999)};
            background: ${colors.gray[400]};
        }
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

        const root = this.find('[data-part="editor-root"]');

        const setMobileView = view => {
            root.attributes['data-mobile-view'] = view;
        };
        setMobileView('edit');

        this.find('[data-part="edit-toggle"]').on('click', () => setMobileView('edit'));
        this.find('[data-part="preview-toggle"]').on('click', () => setMobileView('preview'));

        const { contextUrl } = anchorTextarea.params;
        if(contextUrl){
            root.attributes['data-has-context'] = 'true';
            const contextFrame = this.find('[data-part="editor-context-pane"] pinstripe-frame');
            contextFrame.on('load', (event) => {
                const { patched, body } = event.detail;
                if(patched) return;
                const matches = `${body}`.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                contextFrame.patch(matches ? matches[1] : `${body}`);
            });
            contextFrame.load(contextUrl, { skipPatch: true });
            this.find('[data-part="context-toggle"]').on('click', () => setMobileView('context'));
        }

        const updateSlashLine = () => {
            const { value } = editorTextarea;
            const position = editorTextarea.node.selectionStart;
            const lineStart = value.lastIndexOf('\n', position - 1) + 1;
            const newlineIndex = value.indexOf('\n', position);
            const lineEnd = newlineIndex === -1 ? value.length : newlineIndex;
            const line = value.slice(lineStart, lineEnd);
            root.attributes['data-slash-line'] = /^\//.test(line) ? 'true' : 'false';
        };
        updateSlashLine();
        ['input', 'keyup', 'click', 'select'].forEach(eventName => {
            editorTextarea.on(eventName, updateSlashLine);
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
                updateSlashLine();
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
                <div class="${this.cssClasses.root}" data-part="editor-root">
                    <div class="${this.cssClasses.toolbar}">
                        <div class="${this.cssClasses.viewToggle}">
                            <button type="button" data-part="edit-toggle">Edit</button>
                            <button type="button" data-part="preview-toggle">Preview</button>
                            <button type="button" data-part="context-toggle" data-test-id="context-toggle">Context</button>
                        </div>
                        <button data-part="save-changes-button">Save Changes</button>
                    </div>
                    <div class="${this.cssClasses.panes}">
                        <div class="${this.cssClasses.textPane}">
                            <textarea name="value" data-part="editor-textarea">${this.params.value}</textarea>
                        </div>
                        <div class="${this.cssClasses.sidePanes}">
                            <div class="${this.cssClasses.contextPane}" data-part="editor-context-pane" data-test-id="context-pane">
                                <pinstripe-frame load-on-init="false"></pinstripe-frame>
                            </div>
                            <div class="${this.cssClasses.previewPane}" data-part="editor-preview-pane">
                                ${this.renderView('_pinstripe/_content', {
                                    body: this.renderHtml`<pinstripe-frame url="/_markdown_editor/preview" load-on-init="false"></pinstripe-frame>`
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </pinstripe-modal>
        `;
    }
};
