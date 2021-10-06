
import { defineView } from 'pinstripe';

defineView('admin/edit_post_body', ({ renderHtml, renderMarkdown, params: { body }, renderScript }) => renderHtml`
    <div class="modal is-active">
        <div class="modal-background"></div>

        <div class="markdown-editor" data-widget="form" data-method="post">
            <textarea name="body" class="markdown-editor-text-pane">${body}</textarea>
            <div class="markdown-editor-preview-pane content">
                ${renderMarkdown(body)}
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
        ${renderScript(function(){
            this.parent.on('click', '.modal-background, .modal-close', () => {
                this.frame.frame.load();
            });
        })}
    </div>
`);
