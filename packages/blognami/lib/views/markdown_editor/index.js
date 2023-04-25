
export default {
    render(){
        return this.renderHtml`
            <div class="modal" data-component="a" data-action="remove" data-ignore-events-from-children="true">
                <button data-component="a" data-action="remove"></button>
                <div class="markdown-editor" data-autosubmit="true" data-component="pinstripe-markdown-editor">
                    <div class="markdown-editor-text-pane">
                        <textarea name="value">${this.params.value}</textarea>
                    </div>
                    <div class="markdown-editor-preview-pane" data-url="/markdown_editor/preview" data-component="pinstripe-frame"></div>
                </div>
            </div>
        `;
    }
};
