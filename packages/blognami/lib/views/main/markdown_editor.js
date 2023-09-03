
export default {
    render(){
        return this.renderHtml`
            <blognami-modal>
                <div class="markdown-editor" data-autosubmit="true" data-component="blognami-markdown-editor">
                    <div class="markdown-editor-text-pane">
                        <textarea name="value">${this.params.value}</textarea>
                    </div>
                    <div class="markdown-editor-preview-pane"></div>
                </div>
            </blognami-modal>
        `;
    }
};
