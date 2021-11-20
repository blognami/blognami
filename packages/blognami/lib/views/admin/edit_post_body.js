
export default async ({ posts, params, renderHtml, renderMarkdown }) => {
    const post = posts.idEq(params.id).first();

    if(params._method == 'POST'){
        await post.update({ body: params.body });
    }
    
    const body = await post.body;
    
    return renderHtml`
        <div class="modal is-active">
            <div class="modal-background" data-widget="button" data-action="load" data-target="_parent"></div>

            <div class="markdown-editor" data-widget="form" data-method="post" data-autosubmit="true">
                <div class="markdown-editor-text-pane">
                    <textarea name="body">${body}</textarea>
                </div>
                <div class="markdown-editor-preview-pane content">
                    ${renderMarkdown(body)}
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" data-widget="button" data-action="load"  data-target="_parent">></button>
        </div>
    `;
};
