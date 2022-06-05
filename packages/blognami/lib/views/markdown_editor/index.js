
export default ({ renderHtml, params }) => {
    const { value = '' } = params;

    return renderHtml`
        <div class="modal" data-node-wrapper="anchor" data-action="remove" data-ignore-events-from-children="true">
            <button data-node-wrapper="anchor" data-action="remove"></button>
            <div class="markdown-editor" data-autosubmit="true" data-node-wrapper="markdown-editor">
                <div class="markdown-editor-text-pane">
                    <textarea name="value">${value}</textarea>
                </div>
                <div class="markdown-editor-preview-pane" data-url="/markdown_editor/preview" data-node-wrapper="frame"></div>
            </div>
        </div>
    `;
};
