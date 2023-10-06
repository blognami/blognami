
export default {
    styles: `
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
    `,

    render(){
        return this.renderHtml`
            <pinstripe-modal>
                <div class="${this.cssClasses.root}" data-autosubmit="true" data-component="blognami-markdown-editor">
                    <div class="${this.cssClasses.textPane}">
                        <textarea name="value" data-part="editor-textarea">${this.params.value}</textarea>
                    </div>
                    <div class="${this.cssClasses.previewPane}" data-part="editor-preview-pane"></div>
                </div>
            </pinstripe-modal>
        `;
    }
};
