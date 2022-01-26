
export default ({ renderForm, images, renderHtml }) => renderForm(images, {
    fields: [{ name: 'file', type: 'file' }],

    success(image){
        return renderHtml`
            <div data-decorator="markdown-editor">
                <span data-line-content="![${image.title}](/${image.slug})" data-trigger="click"></span>
            </div>
        `;
    }
});
