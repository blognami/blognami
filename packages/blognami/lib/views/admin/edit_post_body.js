
export default async ({ posts, params, renderHtml, renderScript, renderMarkdown }) => {
    const post = posts.idEq(params.id).first();

    if(params._method == 'POST'){
        await post.update({ body: params.body });
    }
    
    const body = await post.body;
    
    return renderHtml`
        <div class="modal is-active">
            <div class="modal-background"></div>

            <div class="markdown-editor" data-widget="form" data-method="post">
                <div class="markdown-editor-text-pane">
                    <div class="markdown-editor-toolbar">
                        <button class="button is-small" data-widget="anchor" data-url="/admin/insert_image" data-target="_overlay">Insert</button>
                        ${renderScript(function(){
                            this.parent.on('mousedown', function(event){
                                event.stopPropagation();
                            });
                        })}
                    </div>
                    <textarea name="body">${body}</textarea>
                    ${renderScript(function(){
                        this.parent.on('mousemove', function(){
                            this.addClass('is-toolbar');
                        });

                        this.parent.on('keydown', function(){
                            this.removeClass('is-toolbar');
                        });

                        this.parent.on('mousedown', function(){
                            this.removeClass('is-toolbar');
                        });
                    })}
                </div>
                <div class="markdown-editor-preview-pane content">
                    ${renderMarkdown(body)}
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close"></button>
            ${renderScript(function(){
                this.parent.on('click', '.modal-background, .modal-close', (e) => {
                    this.frame.frame.load();
                });
            })}
        </div>
    `;
};
