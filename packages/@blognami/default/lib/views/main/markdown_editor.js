
export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal>
                <div class="markdown-editor" data-autosubmit="true" data-component="blognami-markdown-editor">
                    <div class="markdown-editor-text-pane">
                        <textarea name="value">${this.params.value}</textarea>
                    </div>
                    <div class="markdown-editor-preview-pane"></div>
                </div>
            </pinstripe-modal>
        `;
    }
};
